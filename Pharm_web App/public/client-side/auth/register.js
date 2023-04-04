import { registerUser, ResponseError } from "../utils/utils.js";
(function () {
  // Query Selectors
  const $password = document.querySelector("#password");
  const $retypePassword = document.querySelector("#retype_password");
  const $error = document.querySelector(".error__label");
  const $form = document.querySelector("#register__form");
  const $signupForm = document.querySelector("#signup__form");
  const registerNotification = document.querySelector(
    ".register__notification"
  );
  const $loader = document.querySelector(".loader_container");
  const $notify = document.querySelector(".notification");
  const $message = document.querySelector(".notification__message");
  const registrationMessage = document.querySelector(".registration__message");
  const $telephone = document.querySelector("#telephone");
  const $tele_error = document.querySelector(".tele_error__label");
  const $submit = document.querySelector("input[type='submit']");
  // functions
  const register = async (e) => {
    e.preventDefault();
    $loader.classList.remove("no_display");

    try {
      const response = await registerUser(
        JSON.stringify(Object.fromEntries(new FormData($form).entries()))
      );

      if (!response.ok) {
        throw new ResponseError("Bad Fetch Response", response);
      }
      registerNotification.style.display = "flex";
      registrationMessage.textContent = `You are successfully registered`;
      $signupForm.style.display = "none";
    } catch (err) {
      $notify.classList.remove("no_display");
      $message.style.backgroundColor = "#c41a1a";
      switch (err.response.status) {
        case 400:
          $message.textContent = "Unable to Register";
          break;
        case 401:
          $message.textContent = "Not authorized to register";
          break;
        case 500:
          $message.textContent = " Problem with Server, Unable to Register";
          break;
      }
    }
    setTimeout(() => {
      $loader.classList.add("no_display");
      $notify.classList.add("no_display");
      $form.reset();
    }, 1000);
  };
  const validatePassword = (e) => {
    e.preventDefault();
    if ($password.value === "" && $retypePassword.value === "") {
      return;
    }
    if ($password.value !== $retypePassword.value) {
      $error.innerHTML = `❌password don't match`;
      $error.style.color = "#ff0c44";
      $submit.disabled = true;
      return;
    } else {
      $error.innerHTML = `✅password match`;
      $error.style.color = "#0efb83";
      $submit.disabled = false;
    }
  };

  const validPhoneNumber = () => {
    if (!$telephone.value.match("^[0-9]*$") || $telephone.value.length !== 11) {
      $tele_error.innerHTML = "Invalid Phone number";
      $tele_error.style.color = "#ff0c44";
      $submit.disabled = true;
      return;
    }
    $tele_error.innerHTML = `Valid Phone Number`;
    $tele_error.style.color = "#0efb83";
    $submit.disabled = false;
  };

  // event listeners
  $password.addEventListener("input", validatePassword);
  $retypePassword.addEventListener("input", validatePassword);
  $form.addEventListener("submit", validatePassword);
  $form.addEventListener("submit", register);
  $telephone.addEventListener("input", validPhoneNumber);
})();
