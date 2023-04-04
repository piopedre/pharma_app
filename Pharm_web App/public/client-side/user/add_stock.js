import { addDrug, ResponseError } from "../utils/utils.js";
// DOM Elements
const $nonConsumables = document.querySelectorAll(".non-compatitible");
const $dosageForm = document.querySelector('[name="drug_type"]');
const $addForm = document.querySelector("#add_new_stock");
const $addBtn = document.querySelector(".add_btn");
const token = JSON.parse(sessionStorage.getItem("token"));
const _location = JSON.parse(sessionStorage.getItem("location"));
const pharmacy_unit = JSON.parse(sessionStorage.getItem("unit"));
const $submitBtn = document.querySelector('[type="submit"]');
const $notifyCtn = document.querySelector(".notification");
const $message = document.querySelector(".notification__message");
const $loader = document.querySelector(".loader_container");
const $cancelBtn = document.querySelector(".cancel_btn");
// functions
const consumablesForm = (e) => {
  if ($dosageForm.value === "Consumable") {
    $nonConsumables.forEach((formEl) => {
      const input = formEl.querySelector("input");
      input.disabled = true;
    });
    return;
  }
  $nonConsumables.forEach((formEl) => {
    const input = formEl.querySelector("input");
    input.disabled = false;
  });
};
const resetForm = (e) => {
  // e.preventDefault();
  $addForm.reset();
  $nonConsumables.forEach((formEl) => {
    const input = formEl.querySelector("input");
    input.disabled = false;
  });
};
const addNewDrug = async (e) => {
  e.preventDefault();
  const form = new FormData($addForm);
  // check if a consumable
  if ($dosageForm.value === "Consumables") {
    form.delete("generic_name");
    form.delete("strength");
  }
  const drugForm = Object.fromEntries(form.entries());
  //  manually add location and pharmacy unit
  const jsonForm = JSON.stringify({
    location: _location,
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
$dosageForm.addEventListener("input", consumablesForm);
$addForm.addEventListener("submit", addNewDrug);
$addForm.addEventListener("reset", resetForm);
