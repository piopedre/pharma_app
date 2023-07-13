import {
  getDatabase,
  getAllProducts,
  sendReq,
  getProductLogsByProduct,
} from "../utils/utils.js";
(async function () {
  // DOM ELEMENTS AND COOKIES
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const $unit = JSON.parse(sessionStorage.getItem("unit"));
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $message = document.querySelector(".notification__message");
  const $notifyCtn = document.querySelector(".notification");
  const $productCtn = document.querySelector(".product_list");
  const $search = document.querySelector("#product_name");

  // VARIABLES
  let productDatabase = [];
  let productLogs = [];
  await getProducts();
  productRender(productDatabase);
  async function getProducts() {
    const response = await getDatabase(
      token,
      getAllProducts,
      $location,
      $unit,
      $message
    );
    if (response?.ok) {
      productDatabase = await response.json();
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 900);
  }
  async function getProductLogs(id) {
    // get the productLogs
    const response = await sendReq(
      token,
      id,
      getProductLogsByProduct,
      $message,
      "",
      "Unable to get Logs",
      "Unable to get Logs"
    );
    productLogs = await response.json();

    if (!productLogs || !productLogs.length) {
      return;
    }
    productLogs.forEach((log) => {
      delete log.createdAt;
      delete log.updatedAt;
      delete log.location;
      delete log.unit;
      delete log._id;
      delete log.product;
    });
  }
  function searchProduct(e) {
    if (!e.target.value || !e.target.value.trim()) {
      return;
    }
    const filteredProducts = productDatabase.filter((product) =>
      product.name.includes(e.target.value.toUpperCase())
    );
    productRender(filteredProducts);
  }
  async function openDetail(e) {
    const options = {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const parent = e.target.closest(".product_main_item");
    const productDetails = parent.querySelector(".product_details");
    const productItemCtn = parent.querySelector(".product_detail_container");
    const productId = parent.querySelector(".product_id").textContent;
    productItemCtn.innerHTML = "";
    // close all other drug details
    const allProductDetail = e.target
      .closest(".product_list")
      .querySelectorAll(".product_details");
    allProductDetail.forEach((detail) => {
      if (
        !detail.classList.contains("no_display") &&
        !(detail === productDetails)
      ) {
        detail.classList.add("no_display");
      }
    });
    // for the current drug detail
    if (!productDetails.classList.contains("no_display")) {
      productDetails.classList.add("no_display");
      return;
    }

    productDetails.classList.remove("no_display");
    // get product Logs

    await getProductLogs(productId);
    // rendering the productLogs in the container
    if (!productLogs || !productLogs.length) {
      return;
    }

    productLogs.map((log) => {
      let pharmacistName = "";
      let logColour = "";
      const dateTime = Date.parse(`${log.date}`);
      const date = Intl.DateTimeFormat("en-GB", options).format(dateTime);

      if (log.signature.lastName) {
        pharmacistName = log.signature.lastName;
      } else {
        pharmacistName = "Removed User";
      }
      if (log.received) {
        logColour = "received";
      } else if (log.issued) {
        logColour = "issued";
      } else {
        logColour = "normal";
      }
      const productLog = `<div class="product_logs product_logs_structure ${logColour}">
         <div class="product_issue_date">${date}</div>
         <div class="product_movement">${log.movement}</div>
        <div class="product_received_amount">${
          log.received || log.issued || log.balance
        }</div>
        <div class="product_balance">${log.balance}</div>
        <div class="pharmacist_name">${pharmacistName}</div>

      </div`;
      productItemCtn.insertAdjacentHTML("beforeend", productLog);
    });
  }
  function productRender(products = []) {
    $productCtn.innerHTML = "";
    if (!products.length) {
      return;
    }
    const nOptions = {
      year: "2-digit",
      month: "numeric",
    };

    products.map(async (product) => {
      const dateTime = Date.parse(`${product.expiryDate}`);
      const date = Intl.DateTimeFormat("en-GB", nOptions).format(dateTime);
      const productItem = `<div class="product_main_item">
    <div class="product_item">
      <div class="product_name">${product.name}</div>
      <div class="product_id no_display">${product._id}</div>
      <div class="product_quantity">${product.quantity}</div>
      <div class="product_expiry">${date}</div>
    </div>
    <div class="product_details no_display">
      <div class="product_logs_headings product_logs_structure">
        <div class="product_issue_date">Date</div>
        <div class="product_movement">Movement</div>
        <div class="product_received_amount">Rec/Issued</div>
        <div class="product_balance">Balance</div>
        <div class="pharmacist_name">Pharm</div>
      </div>
      <div class="product_detail_container">
      
          
    </div>
    </div>
  </div>`;
      $productCtn.insertAdjacentHTML("beforeend", productItem);
    });
    const productItems = document.querySelectorAll(".product_item");
    productItems.forEach((item) => {
      item.addEventListener("click", openDetail);
    });
  }
  $search.addEventListener("input", searchProduct);
})();
