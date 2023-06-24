import {
  editProductById,
  getAllProducts,
  getDatabase,
  sendEditReq,
  categoryAdd,
  sendReq,
  addProductLogs,
} from "../utils/utils.js";
const edit = async () => {
  const $renderCtn = document.querySelector(".drug_render_list");

  // DOM LISTENERS
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $search = document.querySelector("#edited__drug");
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const $pharmacyUnit = JSON.parse(sessionStorage.getItem("unit"));
  const $notifyCtn = document.querySelector(".notification");
  const $message = document.querySelector(".notification__message");
  let productDatabase = null;
  await getProducts();
  // connect to database
  async function getProducts() {
    $notifyCtn.classList.remove("no_display");
    const response = await getDatabase(
      token,
      getAllProducts,
      $location,
      $pharmacyUnit,
      $message
    );
    if (response?.ok) {
      productDatabase = await response.json();
      $notifyCtn.classList.add("no_display");
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 900);
  }

  // Form elements
  const $addCategory = document.querySelector(".add_category");
  const $removeCategory = document.querySelector(".remove_category");
  const $categoryCtn = document.querySelector(".new_category");
  const $categoryAdded = document.querySelector(".category_added");
  const $category = document.querySelector(".category");
  const $editForm = document.querySelector(".edit");
  const $form = document.querySelector(".edit_form");
  const $drugName = document.querySelector("#name");
  const $unitOfIssue = document.querySelector("#unit_of_issue");
  const $costPrice = document.querySelector("#cost_price");
  const $fgPrice = document.querySelector("#fg_price");
  const $packSize = document.querySelector("#pack_size");
  const $quantity = document.querySelector("#quantity");
  const $minimumQuantity = document.querySelector("#minimum_quantity");
  const $expiryDate = document.querySelector("#expiry_date");
  const $productCategory = document.querySelector("#product_category");
  const $elementId = document.querySelector(".element_id");
  const $cancelBtn = document.querySelector(".cancel_button");
  const $submitBtn = document.querySelector(".edit_button");
  const $backdrop = document.querySelector(".backdrop");
  const $inputs = document.querySelectorAll(".edit_form input");

  //functions
  // $editForm.classList.remove("no_display");
  async function editDrug(e) {
    $form.reset();
    const parent = e.target.closest(".drug_render_item");
    const id = parent.querySelector(".drug_id").textContent;
    $editForm.classList.remove("no_display");
    // Setting the values 0f the form to drug clicked
    const [drug] = productDatabase.filter((drug) => drug._id === id);

    const {
      _id,
      cost_price,
      product_category,
      expiry_date,
      minimum_quantity,
      name,
      quantity,
      pack_size,
      unit_of_issue,
      fg_price,
    } = drug;
    $editForm.classList.remove("no_display");
    $elementId.textContent = _id;
    $drugName.value = name;
    ($productCategory.value = product_category),
      ($costPrice.value = cost_price);
    $fgPrice.value = fg_price;
    $quantity.value = quantity;
    $packSize.value = pack_size;
    $minimumQuantity.value = minimum_quantity;
    $unitOfIssue.value = unit_of_issue;
    $expiryDate.value = new Date(`${expiry_date}`).toISOString().split("T")[0];
    $submitBtn.disabled = true;
  }
  const edited = (e) => {
    e.target.classList.add("edited");
    $submitBtn.disabled = false;
  };
  const categoryAdded = async (e) => {
    $notifyCtn.classList.remove("no_display");
    if (!$category.value) {
      return;
    }

    const response = await altSendReq(
      JSON.stringify({ category: $category.value }),
      categoryAdd,
      $message,
      "Category added",
      "Error adding a new category",
      "Problem with Server, Unable to add"
    );
    if (response?.ok) {
      $category.value = "";
      location.reload();
    }

    setTimeout(() => {
      $message.textContent = "";
      $notifyCtn.classList.add("no_display");
    }, 900);
  };
  const removeCategory = () => {
    $backdrop.classList.remove("show");
    $categoryCtn.classList.add("no_display");
  };
  const categoryForm = (e) => {
    e.preventDefault();

    $backdrop.classList.add("show");
    $categoryCtn.classList.remove("no_display");
  };
  const saveEditedDrug = async (e) => {
    e.preventDefault();
    $notifyCtn.classList.remove("no_display");
    const form = new Map();

    $inputs.forEach((input) => {
      if (input.classList.contains("edited")) {
        form.set(input.name, input.value);
      }
    });
    if ($productCategory.classList.contains("edited")) {
      form.set($productCategory.name, $productCategory.value);
    }
    const response = await sendEditReq(
      token,
      editProductById,
      $elementId.textContent,
      JSON.stringify(Object.fromEntries(form)),
      $message
    );
    if (response?.ok) {
      const movementName = [...form.keys()].reduce((acc, key) => {
        acc += key + " ";
        return acc;
      }, "edited ");
      const product = await response.json();
      const movement = new Map();
      movement.set("date", new Date());
      movement.set("movement", movementName);
      movement.set("product", $elementId.textContent);
      movement.set("balance", product.quantity);
      movement.set("pharmacy_unit", $pharmacyUnit);
      movement.set("location", $location);
      const movementResponse = await sendReq(
        token,
        JSON.stringify(Object.fromEntries(movement)),
        addProductLogs,
        $message,
        "Changes Saved",
        "Logs not added",
        "Server Error"
      );
      if (movementResponse?.ok) {
        form.clear();
        movement.clear();
        productDatabase = null;
        setTimeout(() => {
          location.reload();
        }, 2500);
      }
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 2000);
  };
  function showSearchResults(searchData) {
    $renderCtn.innerHTML = "";
    searchData.map((product) => {
      const quantity = product.quantity;
      const formatDate = Date.parse(`${product.expiry_date}`);
      const options = {
        year: "2-digit",
        month: "numeric",
      };
      // use formatter
      const date = new Intl.DateTimeFormat("en-US", options).format(formatDate);

      const drugItem = ` <div class="drug_render_item">
                    <div class="drug_details">${product.name}</div>
                    <div class="drug_quantity">${quantity}</div>
                    <div class="drug_expiry_date">${date}</div>
                    <div class="drug_id no_display">${product._id}</div>
                  </div> `;

      $renderCtn.insertAdjacentHTML("beforeend", drugItem);
    });
  }
  function searchDrug(e) {
    let filteredProducts = null;
    if (productDatabase?.length) {
      filteredProducts = productDatabase.filter((product) =>
        product.name.includes(e.target.value.toUpperCase())
      );
    }

    if ($search.value === "") {
      filteredProducts = [];
    }
    showSearchResults(filteredProducts);
    const $renderItems = document.querySelectorAll(".drug_render_item");
    $renderItems.forEach((item) => {
      item.addEventListener("click", editDrug);
    });
  }
  const cancelEdit = (e) => {
    e.preventDefault();
    $form.reset();
    $backdrop.classList.remove("show");
    $editForm.classList.add("no_display");
  };
  // add Event Listeners
  $addCategory.addEventListener("click", categoryForm);
  $search.addEventListener("input", searchDrug);

  $cancelBtn.addEventListener("click", cancelEdit);

  $editForm.addEventListener("submit", saveEditedDrug);
  $removeCategory.addEventListener("click", removeCategory);
  $categoryAdded.addEventListener("click", categoryAdded);
  $inputs.forEach((input) => input.addEventListener("change", edited));
};
edit();
