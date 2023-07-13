import { getProfile, ResponseError } from "../utils/utils.js";
// USER VERIFICATION
(async function () {
  const $profileName = document.querySelector(".user__profile-name");
  const $profileNumber = document.querySelector(".user__profile-number");
  const $featuresLinks = document.querySelectorAll(".features-link");
  const $toggleFeaturesLinks = document.querySelectorAll(
    ".toggle__features-link"
  );
  const $displayName = document.querySelector(".user__display_name");
  const $navLinks = document.querySelectorAll(".nav-link");
  const $displayPicture = document.querySelector(
    ".dashboard__profile_display img"
  );
  const $siteLocation = document.querySelector(".site_location");
  const $siteUnit = document.querySelector(".site_unit");
  const $date = document.querySelector(".date");
  const $toggleLinks = document.querySelectorAll(".toggle__nav-link");

  // functions
  await getStarted();
  async function getStarted() {
    //////////////////////////
    if (!sessionStorage.getItem("token")) {
      location.replace("/pharma_app/login");
      return;
    }
    const token = JSON.parse(sessionStorage.getItem("token"));

    const $location = JSON.parse(
      sessionStorage.getItem("location")
    ).toUpperCase();

    const $unit = JSON.parse(sessionStorage.getItem("unit")).toUpperCase();

    try {
      const response = await getProfile(token);
      if (!response.ok) {
        throw new ResponseError("Bad Fetch Response", response);
      }
      const result = await response.json();
      const { title, firstName, lastName, phoneNumber, _id } = result;
      $profileName.textContent = `${title} ${lastName}`;
      $profileNumber.textContent = phoneNumber;
      $siteLocation.textContent = $location;
      $siteUnit.textContent = `${$unit.toUpperCase()}`;
      const date = Intl.DateTimeFormat("en-GB")
        .format(new Date())
        .replaceAll("/", "-");
      $date.textContent = date;

      if ($displayName) {
        $displayName.textContent = `Hi ${firstName}`;
      }
      const pictureResponse = await fetch(`/admins/${_id}/avatar`);
      if (pictureResponse.ok) {
        $displayPicture.src = `/admins/${_id}/avatar`;
      } else {
        $displayPicture.src = `/images/avatar.png`;
      }
    } catch (err) {
      switch (err?.response?.status) {
        case 400:
          location.replace("/pharma_app/login");
          break;
        case 401:
          location.replace("/pharma_app/login");
          break;
        case 500:
          location.replace("/pharma_app/login");
          break;
      }
    }
  }
  const profileLinks = (e) => {
    const parent = e.target.closest("div");
    const feature = parent.querySelector(".features__items");
    $featuresLinks?.forEach((link) => {
      const mainParent = link.closest("div");
      if (parent !== mainParent) {
        if (
          mainParent
            .querySelector(".features__items")
            .classList.contains("show")
        ) {
          mainParent.querySelector(".features__items").classList.remove("show");
        }
      }
    });
    feature?.classList.toggle("show");
  };
  const toggleLinks = (e) => {
    const parent = e.target.closest("div");
    const feature = parent.querySelector(".features__items");
    $toggleFeaturesLinks?.forEach((link) => {
      const mainParent = link.closest("div");
      if (parent !== mainParent) {
        if (
          mainParent
            .querySelector(".features__items")
            .classList.contains("show")
        ) {
          mainParent.querySelector(".features__items").classList.remove("show");
        }
      }
      return;
    });
    feature?.classList.toggle("show");
  };
  $navLinks?.forEach((link) => link.addEventListener("click", profileLinks));
  $toggleLinks?.forEach((link) => link.addEventListener("click", toggleLinks));
})();
