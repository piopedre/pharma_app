import {
  getProfile,
  ResponseError,
  updateAvatar,
  updateUser,
} from "../utils/utils.js";
// Edit Profile

// Query Selectors
const $img = document.querySelector(".profile_image");
const $imgsrc = document.querySelector(".profile_image_src");
const $title = document.querySelector(".user__title");
const $firstName = document.querySelector(".first_name_input");
const $lastName = document.querySelector(".last_name_input");
const $email = document.querySelector(".email_input");
const $username = document.querySelector(".username_input");
const $phone_number = document.querySelector(".phone_number_input");
const $formProfileImage = document.querySelector(".profile_image");
const $notifyCtn = document.querySelector(".notification");
const $message = document.querySelector(".notification__message");
const $inputs = document.querySelectorAll("input");
const $editBtn = document.querySelector("#edit__save");
const $loader = document.querySelector(".loader_container");

window.addEventListener("DOMContentLoaded", async () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  try {
    const response = await getProfile(token);
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    const result = await response.json();
    const { title, first_name, last_name, phone_number, email, username, _id } =
      result;
    $title.value = title;
    $firstName.value = first_name;
    $lastName.value = last_name;
    $email.value = email;
    $username.value = username;
    $phone_number.value = phone_number;
    const pictureResponse = await fetch(`/admins/${_id}/avatar`);
    if (pictureResponse.ok) {
      $formProfileImage.src = `/admins/${_id}/avatar`;
    } else {
      $formProfileImage.src = `/images/avatar.png`;
    }
  } catch (err) {
    switch (err.response.status) {
      case 400:
        location.replace("/pharma_app/login");
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
        location.replace("/pharma_app/login");
        break;
    }
  }
});

// functions
const changedInfo = (e) => {
  e.target.setAttribute("id", "changed");
};
const editAdmin = async (e) => {
  e.preventDefault();

  const token = JSON.parse(sessionStorage.getItem("token"));
  const avatarForm = new FormData();
  const otherForm = {};
  const alteredInputs = [];
  $inputs.forEach((input) => {
    if (input.hasAttribute("id", "changed")) {
      alteredInputs.push(input);
    }
  });
  if ($title.hasAttribute("id", "changed")) {
    alteredInputs.push($title);
    otherForm[$title.name] = $title.value;
  }
  if (!alteredInputs.length) {
    $message.textContent = "Nothing to Save";
    $message.style.backgroundColor = "#c41a1a";
    setTimeout(() => {
      $message.style.backgroundColor = "transparent";
      $message.textContent = "";
    }, 2000);
    return;
  }
  $loader.classList.remove("no_display");
  $inputs.forEach((input) => {
    if (input.hasAttribute("id", "changed")) {
      if (input.name === "avatar") {
        avatarForm.append("avatar", input.files[0]);
      } else {
        otherForm[input.name] = input.value;
      }
    }
  });

  if (avatarForm.has("avatar")) {
    try {
      const response = await updateAvatar(token, avatarForm);
      if (!response.ok) {
        throw new ResponseError("Bad Fetch Response", response);
      }
      $message.style.backgroundColor = "#2bf712";
      $message.textContent = "New Image Saved";
    } catch (err) {
      $message.style.backgroundColor = "#c41a1a";
      switch (err.response.status) {
        case 400:
          $message.textContent = "Unable to update User";
          break;
        case 401:
          location.replace("/pharma_app/admin/login");
          break;
        case 500:
          $message.textContent = " Problem with Server, Unable to update";
          break;
      }
    }
  }
  if (Object.keys(otherForm).length) {
    const data = JSON.stringify(otherForm);
    try {
      const response = await updateUser(token, data);
      if (!response.ok) {
        throw new ResponseError("Bad Fetch Response", response);
      }
      setTimeout(() => {
        $message.style.backgroundColor = "#2bf712";
        $message.textContent = "Changes Saved";
      }, 2000);
    } catch (err) {
      $message.style.backgroundColor = "#c41a1a";
      switch (err.response.status) {
        case 400:
          $message.textContent = "Unable to update User";
          break;
        case 401:
          location.replace("/pharma_app/admin/login");
          break;
        case 500:
          $message.textContent = " Problem with Server, Unable to update";
          break;
      }
    }
  }

  setTimeout(() => {
    $loader.classList.add("no_display");
    $message.style.backgroundColor = "transparent";
    $message.textContent = "";
    location.reload();
  }, 4000);
  // adjusting data of client data
};

const saveImage = () => {
  const file = $imgsrc.files[0];
  const img = URL.createObjectURL(file);

  // before setting the link
  $img.src = img;
};

// Event Listeners
// $form.addEventListener("submit", saveAdmin);
$imgsrc.addEventListener("input", saveImage);
$inputs.forEach((input) => input.addEventListener("change", changedInfo));
$title.addEventListener("change", changedInfo);
$editBtn.addEventListener("click", editAdmin);
