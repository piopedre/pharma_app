import {
  addProduct,
  addProductLogs,
  categoryAdd,
  sendReq,
  altSendReq,
} from "../utils/utils.js";
(function () {
  // DOM Elements
  const $backdrop = document.querySelector(".backdrop");
  const $addForm = document.querySelector("#add_new_stock");
  const $addCategory = document.querySelector(".add_category");
  const $category = document.querySelector(".category");
  const $newCategory = document.querySelector(".new_category");
  const $categoryAdded = document.querySelector(".category_added");
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const pharmacy_unit = JSON.parse(sessionStorage.getItem("unit"));
  const $notifyCtn = document.querySelector(".notification");
  const $message = document.querySelector(".notification__message");
  const $removeCategory = document.querySelector(".remove_category");
  // functions
  const resetForm = (e) => {
    $addForm.reset();
  };
  const addCategory = (e) => {
    e.preventDefault();
    $backdrop.classList.add("show");
    $newCategory.classList.add("show");
  };
  const removeCategory = (e) => {
    $backdrop.classList.remove("show");
    $newCategory.classList.remove("show");
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
    }

    setTimeout(() => {
      $message.textContent = "";
      $notifyCtn.classList.add("no_display");
      location.reload();
    }, 900);
  };
  const addNewDrug = async (e) => {
    e.preventDefault();
    const form = new FormData($addForm);

    form.set(
      "quantity",
      (+form.get("packSize") * +form.get("quantity")) / +form.get("unitOfIssue")
    );
    form.set("location", $location);
    form.set("unit", pharmacy_unit);
    $notifyCtn.classList.remove("no_display");
    const response = await sendReq(
      token,
      JSON.stringify(Object.fromEntries(form.entries())),
      addProduct,
      $message,
      `Product Added`,
      "Problem adding  product occured",
      "Problem with Server, Unable to add product"
    );
    if (response?.ok) {
      const product = await response.json();
      $addForm.reset();
      const movement = new Map();
      movement.set("date", new Date());
      movement.set("movement", "Physical Stock");
      movement.set("received", form.get("quantity"));
      movement.set("balance", form.get("quantity"));
      movement.set("product", product._id);
      movement.set("unit", pharmacy_unit);
      movement.set("location", $location);
      const movementResponse = await sendReq(
        token,
        JSON.stringify(Object.fromEntries(movement)),
        addProductLogs,
        $message,
        "Product Added",
        "Logs not added",
        "Server Error"
      );

      if (movementResponse?.ok) {
        movement.clear();

        [...form.keys()].forEach((key) => form.delete(key));
      }
    }

    setTimeout(() => {
      $message.textContent = "";
      $notifyCtn.classList.add("no_display");
    }, 900);
  };
  // event listeners
  $addForm.addEventListener("submit", addNewDrug);
  $addForm.addEventListener("reset", resetForm);
  $addCategory.addEventListener("click", addCategory);
  $categoryAdded.addEventListener("click", categoryAdded);
  $removeCategory.addEventListener("click", removeCategory);
})();
