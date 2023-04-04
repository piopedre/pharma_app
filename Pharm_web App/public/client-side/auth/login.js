import { ResponseError, loginUser } from "../utils/utils.js";

const $form = document.querySelector(".signin");
const $message = document.querySelector(".notification__message");
const $loader = document.querySelector(".loader_container");

sessionStorage.setItem("id", JSON.stringify(""));
sessionStorage.setItem("token", JSON.stringify(""));
sessionStorage.setItem("location", JSON.stringify(""));
sessionStorage.setItem("unit", JSON.stringify(""));
const verifyUser = async (e) => {
  e.preventDefault();
  // loader is added here
  $loader.classList.remove("no_display");
  try {
    const response = await loginUser(
      JSON.stringify(Object.fromEntries(new FormData($form)))
    );
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    const result = await response.json();
    sessionStorage.setItem(
      "location",
      JSON.stringify(Object.fromEntries(new FormData($form)).location)
    );
    sessionStorage.setItem(
      "unit",
      JSON.stringify(Object.fromEntries(new FormData($form)).pharmacy_unit)
    );
    sessionStorage.setItem("token", JSON.stringify(result.token));
    setTimeout(() => {
      $loader.classList.add("no_display");
      location.replace("/pharma_app/dashboard");
    }, 900);
  } catch (err) {
    $message.style.color = "#c41a1a";
    setTimeout(() => {
      $loader.classList.add("no_display");
    }, 900);
    console.log(err);
    switch (err?.response?.status) {
      case 400:
        $message.textContent = "Unable to Login";
        $form.reset();
        break;
      case 500:
        $message.textContent = " Problem with Server, Unable to Login";
        $form.reset();
        break;
    }
  }
};

$form.addEventListener("submit", verifyUser);
// const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
// const seperatedNumbers = numbers.reduce(
//   (acc, cur) => {
//     if (cur % 2 === 0) {
//       acc.even += cur;
//     } else {
//       acc.odd += cur;
//     }
//     return acc;
//   },

//   { odd: 0, even: 0 }
// );
// console.log(seperatedNumbers);
