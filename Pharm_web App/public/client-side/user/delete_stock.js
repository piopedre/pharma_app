import { getAllDrugs, deleteDrugById } from "../utils/utils.js";
const mainFunction = async () => {
  //////////////////////////////////////////
  // QUERY SELECTORS
  const $drugRender = document.querySelector(".main__items");
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(
    sessionStorage.getItem("location")
  ).toUpperCase();
  const $pharmacyUnit = JSON.parse(
    sessionStorage.getItem("unit")
  ).toUpperCase();
  const $notifyCtn = document.querySelector(".notification");
  const $message = document.querySelector(".notification__message");
  let database;
  await getDrugs();
  dataRender();
  ///////////////////////////////////
  const $delBtn = document.querySelector(".yes_button");
  const $search = document.querySelector("#search");
  const $filterBtn = document.querySelector(".toggle__filters");
  const $hoverDescription = document.querySelector(".hover__description");
  const $filterContainer = document.querySelector(".main__filters");
  const $modalWindow = document.querySelector(".modal__window");

  const $removeBtn = document.querySelector(".no_button");
  const $backdrop = document.querySelector(".backdrop");
  async function getDrugs() {
    try {
      const response = await getAllDrugs(token, $location, $pharmacyUnit);
      if (!response.ok) {
        throw new ResponseError("Bad Fetch Response", response);
      }
      const result = await response.json();
      $notifyCtn.classList.remove("no_display");
      database = result;
    } catch (err) {
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#c41a1a";
      switch (err?.response?.status) {
        case 400:
          $message.textContent = "Error, Fetching Database";
          break;
        case 401:
          location.replace("/pharma_app/login");
          break;
        case 404:
          $message.textContent = "Database is empty";
          break;
        case 500:
          $message.textContent = " error, connecting to server";
          break;
      }
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.textContent = "";
      $message.style.backgroundColor = "transparent";
    }, 900);
  }
  async function delDrug(id) {
    try {
      const response = await deleteDrugById(token, id);
      if (!response.ok) {
        throw new ResponseError("Bad Fetch Response", response);
      }
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#3ff78f";
      $message.textContent = "Deleted";
    } catch (err) {
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#c41a1a";
      switch (err?.response?.status) {
        case 400:
          $message.textContent = "Error, Fetching Drug";
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
        case 404:
          $message.textContent = "Drug not found";
          break;
        case 500:
          $message.textContent = " error connecting to server";
          break;
      }
    }
    setTimeout(async () => {
      $notifyCtn.classList.add("no_display");
      $message.textContent = "";
      $message.style.backgroundColor = "transparent";
    }, 900);
  }
  function dataRender(data = []) {
    $drugRender.innerHTML = "";
    if (!data.length) {
      const empty = `<div class="empty__drug__item">
                                <p> + Add a New Drug </p>
                            </div> `;
      $drugRender.insertAdjacentHTML("afterbegin", empty);
      return;
    }
    const options = {
      year: "2-digit",
      month: "short",
    };
    // use formatter
    data.map((item) => {
      let itemDetail;
      const formatDate = Date.parse(`${item.expiry_date}`);
      const itemExpiry = new Intl.DateTimeFormat("en-US", options).format(
        formatDate
      );
      if (item.drug_type === "CONSUMABLE") {
        itemDetail = `${item.name}`;
      } else {
        itemDetail = `${item.drug_type.slice(0, 3)}. ${item.name} ${
          item.strength
        }`;
      }

      const mainItem = `<div class="main__item">
     
      <div class="item_name">
        <div class="item_brand-name">${itemDetail}</div>
        <div class="item_details">${itemDetail}</div>
      </div>
      <div class="item_quantity">${item.quantity}</div>
      <div class="item_price">${item.cost_price}</div>
      <div class="item_expiry_date">${itemExpiry}</div>
      <div class="item_id remove">${item._id}</div>
      <i class="delete_item">❌
      <span class="item_details">del</span>
      </i>
    
    </div>`;
      $drugRender.insertAdjacentHTML("afterbegin", mainItem);
    });
  }

  const searchData = () => {
    let filteredDrugs = [];
    if (database?.length) {
      database.forEach((drug) => {
        if (drug.name.includes($search.value?.toUpperCase())) {
          filteredDrugs.push(drug);
        }
      });
    }
    if ($search.value === "") {
      filteredDrugs = [];
    }
    dataRender(filteredDrugs);

    const $deleteItems = document.querySelectorAll(".delete_item");
    $deleteItems.forEach((item) => {
      item.addEventListener("click", deleteSequence);
    });
  };

  const deleteSequence = async (e) => {
    const parent = e.target.closest("div");
    const id = parent.querySelector(".item_id").textContent;
    $modalWindow.style.display = "block";
    $delBtn.addEventListener("click", async (e) => {
      await delDrug(id);
      removeModal();
      mainFunction();
    });
  };

  const toggleFilters = () => {
    if ($filterBtn.innerText === "Show Filters") {
      $filterBtn.textContent = "Hide Filters";
      $hoverDescription.textContent = "Hide Filters";
      $filterBtn.classList.remove("show_filter");
      $filterBtn.classList.add("hide_filter");
      $filterContainer.classList.toggle("remove");
    } else {
      $filterBtn.innerText = "Show Filters";
      $hoverDescription.textContent = "Show Filters";
      $filterBtn.classList.remove("hide_filter");
      $filterBtn.classList.add("show_filter");
      $filterContainer.classList.toggle("remove");
    }
  };
  const removeModal = () => {
    $modalWindow.style.display = "none";
    $backdrop.style.display = "none";
  };

  // add Event Listeners
  $search.addEventListener("input", searchData);

  $removeBtn.addEventListener("click", removeModal);
  $filterBtn.addEventListener("click", toggleFilters);
};
await mainFunction();
