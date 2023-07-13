import {
  getProfile,
  ResponseError,
  updateAvatar,
  updateUser,
  sendReq,
} from "../utils/utils.js";
// Edit Profile
function profileWrapper() {
  // Query Selectors
  const $img = document.querySelector(".profile_image");
  const $imgsrc = document.querySelector(".profile_image_src");
  const $title = document.querySelector(".user__title");
  const $firstName = document.querySelector(".first_name_input");
  const $lastName = document.querySelector(".last_name_input");
  const $email = document.querySelector(".email_input");
  const $username = document.querySelector(".username_input");
  const $phoneNumber = document.querySelector(".phone_number_input");
  const $formProfileImage = document.querySelector(".profile_image");
  const $notifyCtn = document.querySelector(".notification");
  const $message = document.querySelector(".notification__message");
  const $inputs = document.querySelectorAll("input");
  const $editBtn = document.querySelector("#edit__save");
  // const $loader = document.querySelector(".loader_container");

  window.addEventListener("DOMContentLoaded", async () => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    try {
      const response = await getProfile(token);
      if (!response.ok) {
        throw new ResponseError("Bad Fetch Response", response);
      }
      const result = await response.json();
      const { title, firstName, lastName, phoneNumber, email, username, _id } =
        result;
      $title.value = title;
      $firstName.value = firstName;
      $lastName.value = lastName;
      $email.value = email;
      $username.value = username;
      $phoneNumber.value = phoneNumber;
      const pictureResponse = await fetch(`/admins/${_id}/avatar`);
      if (pictureResponse.ok) {
        $formProfileImage.src = `/admins/${_id}/avatar`;
      }
    } catch (err) {
      switch (err.response.status) {
        case 400:
          $formProfileImage.src = `/images/avatar.png`;
          break;
        case 401:
          location.replace("/pharma_app/login");
          break;
        case 500:
          $formProfileImage.src = `/images/avatar.png`;
          break;
      }
    }
  });

  // functions
  const changedInfo = (e) => {
    e.target.classList.add("changed");
  };
  const editAdmin = async (e) => {
    e.preventDefault();
    $notifyCtn.classList.remove("no_display");

    const token = JSON.parse(sessionStorage.getItem("token"));
    const avatarForm = new FormData();
    const otherForm = new Map();

    // checking select input for changed
    if ($title.classList.contains("changed")) {
      otherForm.set($title.name, $title.value);
    }

    $inputs.forEach((input) => {
      if (input.classList.contains("changed")) {
        // checking inputs for changed id
        if (input.name === "avatar") {
          avatarForm.append("avatar", input.files[0]);
        } else {
          otherForm.set(input.name, input.value);
        }
      }
    });

    if (!otherForm.size && !Array.from(avatarForm.keys()).length) {
      // if forms are empty
      $message.textContent = "Nothing to Save";
      $message.style.backgroundColor = "#c41a1a";
      setTimeout(() => {
        $message.style.backgroundColor = "transparent";
        $message.textContent = "";
        $notifyCtn.classList.add("no_display");
      }, 900);
      return;
    }

    if (avatarForm.has("avatar")) {
      // sending Request
      await sendReq(
        token,
        avatarForm,
        updateAvatar,
        $message,
        "New Image Saved",
        "Unable to update User",
        "Problem with Server, Unable to update"
      );
      avatarForm.delete("avatar");
    }
    if (otherForm.size) {
      // sending Request
      const response = await sendReq(
        token,
        JSON.stringify(Object.fromEntries(otherForm)),
        updateUser,
        $message,
        "Changes Saved",
        "Unable to update User",
        "Problem with Server, Unable to update"
      );
      if (response?.ok) {
        otherForm.clear();
      }
    }

    setTimeout(() => {
      $inputs.forEach((input) => input.classList.remove("changed"));
      $title.classList.remove("changed");
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
      $message.textContent = "";
      profileWrapper();
    }, 2000);
  };

  const saveImage = () => {
    const file = $imgsrc.files[0];
    const img = URL.createObjectURL(file);

    // before setting the link
    $img.src = img;
  };

  // Event Listeners
  $imgsrc.addEventListener("input", saveImage);
  $inputs.forEach((input) => input.addEventListener("change", changedInfo));
  $title.addEventListener("change", changedInfo);
  $editBtn.addEventListener("click", editAdmin);
}
profileWrapper();
