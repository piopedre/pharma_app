import { addDrug, ResponseError, categoryAdd } from "../utils/utils.js";
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
const $loader = document.querySelector(".loader_container");
const $cancelBtn = document.querySelector(".cancel_btn");
// functions
const resetForm = (e) => {
  // e.preventDefault();
  $addForm.reset();
};
const addCategory = (e) => {
  e.preventDefault();
  $backdrop.classList.add("show");
  $newCategory.classList.add("show");
};
const removeCategory = (e) => {
  console.log(e);
  $backdrop.classList.remove("show");
  $newCategory.classList.remove("show");
};
const categoryAdded = async (e) => {
  $notifyCtn.classList.remove("no_display");
  if (!$category.value) {
    return;
  }

  try {
    const response = await categoryAdd(
      JSON.stringify({ category: $category.value })
    );
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    $category.value = "";
    location.reload();
  } catch (err) {
    const text = await err.response.text();
    console.log(text);
    $message.style.backgroundColor = "#c41a1a";
    switch (err.response.status) {
      case 400:
        $message.textContent = text;
        break;
      case 401:
        location.replace("/pharma_app/login");
        break;
      case 500:
        $message.textContent = "Problem with Server, Unable to add";
        break;
    }
    setTimeout(() => {
      $message.textContent = "";
      $notifyCtn.classList.add("no_display");
    }, 900);
  }
};
const addNewDrug = async (e) => {
  e.preventDefault();
  const form = new FormData($addForm);
  const drugForm = Object.fromEntries(form.entries());
  drugForm.quantity =
    (drugForm.pack_size * drugForm.quantity) / drugForm.unit_of_issue;
  //  manually add location and pharmacy unit
  const jsonForm = JSON.stringify({
    location: $location,
    pharmacy_unit: pharmacy_unit,
    ...drugForm,
  });
  $notifyCtn.classList.remove("no_display");
  try {
    const response = await addDrug(token, jsonForm);
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    $message.style.backgroundColor = "#3ff78f";
    $message.textContent = `Drug Added`;
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.textContent = "";
      $addForm.reset();
    }, 900);
  } catch (err) {
    const text = await err.response.text();
    $message.style.backgroundColor = "#c41a1a";
    switch (err.response.status) {
      case 400:
        $message.textContent = text;
        break;
      case 401:
        location.replace("/pharma_app/login");
        break;
      case 500:
        $message.textContent = "Problem with Server, Unable to add";
        break;
    }
    setTimeout(() => {
      $message.textContent = "";
      $notifyCtn.classList.add("no_display");
    }, 900);
  }
};
// event listeners
$addForm.addEventListener("submit", addNewDrug);
$addForm.addEventListener("reset", resetForm);
$addCategory.addEventListener("click", addCategory);
$categoryAdded.addEventListener("click", categoryAdded);
$removeCategory.addEventListener("click", removeCategory);
