import { editDrugById, getAllDrugs, ResponseError } from "../utils/utils.js";
const editCtn = async () => {
  const $renderCtn = document.querySelector(".drug_render_list");

  // DOM LISTENERS
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $search = document.querySelector("#edited__drug");
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const $pharmacyUnit = JSON.parse(sessionStorage.getItem("unit"));
  const $notifyCtn = document.querySelector(".notification");
  const $message = document.querySelector(".notification__message");
  let drugDatabase;

  // connect to database
  async function getDrugs() {
    try {
      const response = await getAllDrugs(token, $location, $pharmacyUnit);
      if (!response.ok) {
        throw new ResponseError("Bad Fetch Response", response);
      }
      const result = await response.json();
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#3ff78f";
      $message.textContent = "Connected to Database";
      drugDatabase = result;
    } catch (err) {
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#c41a1a";
      switch (err?.response?.status) {
        case 400:
          $message.textContent = "Error, Fetching Database";
          break;
        case 401:
          location.replace("/pharma_app/login");
          break;
        case 404:
          $message.textContent = "Database is Empty";
          break;
        case 500:
          $message.textContent = "server, error connecting to database";
          break;
      }
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 900);
  }
  await getDrugs();
  function searchDrug() {
    let filteredDrugs = [];
    if (drugDatabase?.length) {
      drugDatabase.forEach((drug) => {
        if (drug.name.includes($search.value.toUpperCase())) {
          filteredDrugs.push(drug);
        }
      });
    }

    if ($search.value === "") {
      filteredDrugs = [];
    }
    showSearchResults(filteredDrugs);
    const $renderItems = document.querySelectorAll(".drug_render_item");
    $renderItems.forEach((item) => {
      item.addEventListener("click", editDrug);
    });
  }

  function showSearchResults(searchData) {
    $renderCtn.innerHTML = "";
    let name;
    searchData.map((drug) => {
      if (drug.drug_type === "CONSUMABLE") {
        name = `${drug.name}`;
      } else {
        name = `${drug.drug_type.slice(0, 3)} ${drug.name} ${drug.strength}`;
      }
      const quantity = drug.quantity;
      const formatDate = Date.parse(`${drug.expiry_date}`);
      const options = {
        year: "2-digit",
        month: "numeric",
      };
      // use formatter
      const date = new Intl.DateTimeFormat("en-US", options).format(formatDate);

      const drugItem = ` <div class="drug_render_item">
                    <div class="drug_details">${name}</div>
                    <div class="drug_quantity">${quantity}</div>
                    <div class="drug_expiry_date">${date}</div>
                    <div class="drug_id no_display">${drug._id}</div>
                  </div> `;

      $renderCtn.insertAdjacentHTML("beforeend", drugItem);
    });
  }

  // Form elements
  const $editForm = document.querySelector(".edit__form");
  const $form = document.querySelector(".edit__form form");
  const $drugName = document.querySelector("#name");
  const $drugStrength = document.querySelector("#drug__strength");
  const $costPrice = document.querySelector("#cost__price");
  const $sellingPrice = document.querySelector("#selling__price");
  const $quantity = document.querySelector("#quantity");
  const $manufacturerName = document.querySelector("#manufacturer");
  const $expiryDate = document.querySelector("#drug_expiry_date");
  const $editDrugType = document.querySelector("#edited_drug_type");
  const $elementId = document.querySelector(".element_id");
  const $cancelBtn = document.querySelector(".cancel_button");
  const $submitBtn = document.querySelector(".edit_button");
  const $backdrop = document.querySelector(".backdrop");

  //functions
  //$editForm.classList.remove("no_display");
  async function editDrug(e) {
    $form.reset();
    const parent = e.target.closest(".drug_render_item");
    const id = parent.querySelector(".drug_id").textContent;

    /////////////////////////////////////////////
    $backdrop.classList.add("show");
    $editForm.classList.remove("remove");
    // Setting the values 0f the form to drug clicked
    const [drug] = drugDatabase.filter((drug) => drug._id === id);

    const {
      _id,
      cost_price,
      drug_type,
      expiry_date,
      manufacturer_name,
      name,
      quantity,
      strength,
    } = drug;
    $editForm.classList.remove("no_display");
    $elementId.textContent = _id;
    $drugName.value = name;
    ($drugStrength.value = strength), ($costPrice.value = cost_price);
    $quantity.value = quantity;
    $manufacturerName.value = manufacturer_name[0].toUpperCase();
    $editDrugType.value = drug_type;
    $expiryDate.value = new Date(`${expiry_date}`).toISOString().split("T")[0];
    $submitBtn.disabled = true;
  }
  const showSellingPrice = () => {
    $sellingPrice.value = Math.ceil(+$costPrice.value * 1.2);
  };
  const edited = (e) => {
    e.target.classList.add("edited");
    $submitBtn.disabled = false;
  };
  const saveEditedDrug = async (e) => {
    e.preventDefault();
    const edit = new FormData($form);
    let form = Object.fromEntries(edit.entries());

    if (!$editDrugType.classList.contains("edited")) {
      delete form.drug_type;
    }
    if (!$costPrice.classList.contains("edited")) {
      delete form.cost_price;
    }
    if (!$expiryDate.classList.contains("edited")) {
      delete form.expiry_date;
    }
    if (!$quantity.classList.contains("edited")) {
      delete form.quantity;
    }
    form = JSON.stringify(form);

    try {
      const response = await editDrugById(token, $elementId.textContent, form);
      if (!response.ok) {
        throw new ResponseError("Bad Fetch Response", response);
      }
      const result = await response.json();
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#3ff78f";
      $message.textContent = "Changes Saved";

      const {
        name,
        strength,
        quantity,
        manufacturer_name,
        drug_type,
        expiry_date,
        cost_price,
        selling_price,
      } = result;
      $form.reset();
      $drugName.value = name;
      ($drugStrength.value = strength), ($costPrice.value = cost_price);
      $quantity.value = quantity;
      $manufacturerName.value = manufacturer_name[0].toUpperCase();
      $editDrugType.value = drug_type;
      $sellingPrice.value = selling_price;
      $expiryDate.value = new Date(`${expiry_date}`)
        .toISOString()
        .split("T")[0];

      setTimeout(async () => {
        $editForm.classList.add("no_display");
        $backdrop.classList.remove("show");
        $renderCtn.innerHTML = "";
        await editCtn();
      }, 1000);
    } catch (err) {
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#c41a1a";
      switch (err?.response?.status) {
        case 400:
          $message.textContent = "Error, \n Fetching Database";
          break;
        case 401:
          // $notifyCtn.classList.remove("no_display");
          // $message.style.backgroundColor = "#c41a1a";
          // $message.textContent = "Your session has expired";
          // setTimeout(() => {
          //   $notifyCtn.classList.add("no_display");
          //   $message.textContent = "";
          //   $message.style.backgroundColor = "transparent";
          // }, 3000);
          location.replace("/pharma_app/login");
          break;
        case 404:
          $message.textContent = "Drug does not exist";
          break;
        case 500:
          $message.textContent = "Problem, \n connecting to database";
          break;
      }
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 2000);
  };
  const cancelEdit = (e) => {
    e.preventDefault();
    $form.reset();
    $backdrop.classList.remove("show");
    $editForm.classList.add("no_display");
  };
  // add Event Listeners
  $search.addEventListener("input", searchDrug);
  $editDrugType.addEventListener("change", edited);
  $expiryDate.addEventListener("change", edited);
  $cancelBtn.addEventListener("click", cancelEdit);
  $quantity.addEventListener("change", edited);
  $costPrice.addEventListener("change", showSellingPrice);
  $costPrice.addEventListener("change", edited);
  $editForm.addEventListener("submit", saveEditedDrug);
};
editCtn();
