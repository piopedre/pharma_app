import {
  getAllProducts,
  deleteProductById,
  getDatabase,
} from "../utils/utils.js";
const mainFunction = async () => {
  // QUERY SELECTORS
  const $drugRender = document.querySelector(".main__items");
  const $notifyCtn = document.querySelector(".notification");
  const $message = document.querySelector(".notification__message");
  // Parameters for Request
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(
    sessionStorage.getItem("location")
  ).toUpperCase();
  const $pharmacyUnit = JSON.parse(
    sessionStorage.getItem("unit")
  ).toUpperCase();
  // VARIABLES
  let database = null;
  await getProducts();
  dataRender();
  ///////////////////////////////////
  const $delBtn = document.querySelector(".yes_button");
  const $search = document.querySelector("#search");
  const $modalWindow = document.querySelector(".modal__window");

  const $removeBtn = document.querySelector(".no_button");
  const $backdrop = document.querySelector(".backdrop");
  async function getProducts() {
    $notifyCtn.classList.remove("no_display");
    const response = await getDatabase(
      token,
      getAllProducts,
      $location,
      $pharmacyUnit,
      $message
    );

    if (response?.ok) {
      $notifyCtn.classList.add(".no_display");
      database = await response.json();
    }

    setTimeout(async () => {
      $notifyCtn.classList.add("no_display");
      $message.textContent = "";
      $message.style.backgroundColor = "transparent";
    }, 900);
  }
  async function delDrug(id) {
    try {
      const response = await deleteProductById(token, id);
      if (!response.ok) {
        throw new ResponseError("Bad Fetch Response", response);
      }
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#3ff78f";
      $message.textContent = "Deleted";
      database = null;
    } catch (err) {
      $notifyCtn.classList.remove("no_display");

      switch (err?.response?.status) {
        case 400:
          $message.style.backgroundColor = "#c41a1a";
          $message.textContent = "Error, Fetching Drug";
          break;
        case 401:
          location.replace("/pharma_app/login");
          break;
        case 404:
          $message.style.backgroundColor = "#c41a1a";
          $message.textContent = "Drug not found";
          break;
        case 500:
          $message.style.backgroundColor = "#c41a1a";
          $message.textContent = "error connecting to server";
          break;
      }
    }
    setTimeout(async () => {
      $notifyCtn.classList.add("no_display");
      $message.textContent = "";
      $message.style.backgroundColor = "transparent";
    }, 900);
  }

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

  const removeModal = () => {
    $modalWindow.style.display = "none";
    $backdrop.style.display = "none";
  };
  function dataRender(data = []) {
    $drugRender.innerHTML = "";
    if (!data || !data.length) {
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
    data.map((product) => {
      const formatDate = Date.parse(`${product.expiryDate}`);
      const productExpiry = new Intl.DateTimeFormat("en-US", options).format(
        formatDate
      );

      const mainItem = `<div class="main__item">
     
      <div class="item_name">
        <div class="item_brand-name">${product.name}</div>
        <div class="item_details">${product.name}</div>
      </div>
      <div class="item_quantity">${product.quantity}</div>
      <div class="item_price">${product.sellingPrice}</div>
      <div class="item_expiry_date">${productExpiry}</div>
      <div class="item_id remove">${product._id}</div>
      <i class="delete_item">❌
      <span class="item_details">delete</span>
      </i>
    
    </div>`;
      $drugRender.insertAdjacentHTML("afterbegin", mainItem);
    });
  }
  const searchData = () => {
    let filteredDrugs = null;
    if (database?.length) {
      filteredDrugs = database.filter((product) =>
        product.name.includes($search.value?.toUpperCase())
      );
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

  // add Event Listeners
  $search.addEventListener("input", searchData);
  $removeBtn.addEventListener("click", removeModal);
};
await mainFunction();
