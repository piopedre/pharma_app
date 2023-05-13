(function () {
  console.log("finalized using maps instead of objects");
  // Query Selectors
  const $toggleButton = document.querySelector(".navbar__toggle-button");
  const $backdrop = document.querySelector(".backdrop");
  const $toggleNavbar = document.querySelector(".toggle__navbar");
  const $toggleNavlinks = document.querySelectorAll(".linking_nav");
  const $copyright = document.querySelector(".copyright");
  // Copyright
  $copyright.innerHTML = `Copyright © ${new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
  }).format(new Date())}`;
  // Functions
  const toggle = () => {
    $toggleButton?.setAttribute(
      "aria-pressed",
      $toggleButton?.matches('[aria-pressed="false"]') ? true : false
    );
  };

  const addtoggleNavbar = () => {
    $toggleNavbar?.classList.add("show");
    $backdrop?.classList.add("show");
  };
  const toggleNavbar = () => {
    $toggleNavbar?.classList.toggle("show");
    $backdrop?.classList.toggle("show");
  };
  const removetoggleNavbar = () => {
    $toggleNavbar?.classList.remove("show");
    $backdrop?.classList.remove("show");
    if ($toggleButton.getAttribute("aria-pressed")) {
      $toggleButton.setAttribute("aria-pressed", false);
    }
  };
  // add eventListeners
  $toggleButton?.addEventListener("click", toggle);
  $toggleButton?.addEventListener("click", toggleNavbar);

  $toggleNavlinks.forEach((link) => {
    link.addEventListener("click", removetoggleNavbar);
  });
})();
// test code
// (async function () {
//   const response = await fetch(
//     `/productlogsbyproduct/6457bc3bcd607488c3da52b9`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDI5ODI2OGZhMzkzZDY1NGE2YzMwNjIiLCJpYXQiOjE2ODM0Nzg2NTUsImV4cCI6MTY4MzQ4MjI1NX0.B-Oxewwoavbhf4mi6I6aMh6AGV45F30mGX1770TeZ8s`,
//         "Content-type": "application/json",
//       },
//     }
//   );
//   const productlog = await response.json();
//   console.log(productlog.error);
// })();
