(function () {
  console.log("finalized using maps instead of objects");
  // Query Selectors
  const $toggleButton = document.querySelector(".navbar__toggle-button");
  const $backdrop = document.querySelector(".backdrop");
  const $toggleNavbar = document.querySelector(".toggle__navbar");
  const $toggleNavlinks = document.querySelectorAll(".linking_nav");
  const $copyright = document.querySelector(".copyright");
  const width = window.matchMedia("(min-width:40rem)");

  // Copyright
  $copyright.innerHTML = `Copyright © ${new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
  }).format(new Date())}`;
  // functions
  const removeBackdrop = (width) => {
    if (width.matches) {
      if ($backdrop.classList.contains("show")) {
        $backdrop.classList.remove("show");
      }
    }
  };
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
  width.addEventListener("change", removeBackdrop);
})();
