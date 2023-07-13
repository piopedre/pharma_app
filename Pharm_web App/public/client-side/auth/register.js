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
  const $teleError = document.querySelector(".tele_error__label");
  const $submit = document.querySelector("input[type='submit']");
  // functions
  const register = async (e) => {
    e.preventDefault();
    const passwordRegex =
      /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/g;

    const registerForm = new FormData($form);
    if (!passwordRegex.test(registerForm.get("password"))) {
      $notify.classList.remove("no_display");
      $message.style.backgroundColor = "#c41a1a";
      $message.textContent = `password must contain at least 8 characters long,
         min 1 Uppercase 1 Lowercase 1 Number 1 special character and only contains symbols from the alphabet,
          numbers and chosen special characters (@#$%^&+!=)`;
      setTimeout(() => {
        $notify.classList.add("no_display");
        $form.reset();
      }, 3000);
      return;
    }
    $loader.classList.remove("no_display");
    [...registerForm.keys()].forEach((key) => [registerForm.delete(key)]);
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
      $teleError.innerHTML = "Invalid Phone number";
      $teleError.style.color = "#ff0c44";
      $submit.disabled = true;
      return;
    }
    $teleError.innerHTML = `Valid Phone Number`;
    $teleError.style.color = "#0efb83";
    $submit.disabled = false;
  };

  // event listeners
  $password.addEventListener("input", validatePassword);
  $retypePassword.addEventListener("input", validatePassword);
  $form.addEventListener("submit", validatePassword);
  $form.addEventListener("submit", register);
  $telephone.addEventListener("input", validPhoneNumber);
})();
