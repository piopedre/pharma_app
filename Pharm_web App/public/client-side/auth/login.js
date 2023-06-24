import { ResponseError, loginUser } from "../utils/utils.js";

(function () {
  const $form = document.querySelector(".signin");
  const $message = document.querySelector(".notification__message");
  const $loader = document.querySelector(".loader_container");

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
      $loader.classList.add("no_display");
      switch (err?.response?.status) {
        case 400:
          $message.style.color = "#c41a1a";
          $message.textContent = "Unable to Login";
          $form.reset();
          break;
        case 500:
          $message.style.color = "#c41a1a";
          $message.textContent = " Problem with Server, Unable to Login";
          $form.reset();
          break;
      }
      setTimeout(() => {
        $message.style.display = "none";
      }, 2000);
    }
  };

  $form.addEventListener("submit", verifyUser);
})();
