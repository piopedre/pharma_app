import {
  getDatabase,
  getAllProducts,
  sendReq,
  addPatient,
  getAllPatients,
  getPatientDatabase,
  addSale,
  addProductLogs,
  editProductQuantityById,
  sendEditReq,
} from "../utils/utils.js";
(async function () {
  // Variables
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const $unit = JSON.parse(sessionStorage.getItem("unit"));
  const $backdrop = document.querySelector(".backdrop");
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $message = document.querySelector(".notification__message");
  const $notifyCtn = document.querySelector(".notification");
  const $emptyList = document.querySelector(".empty_list");
  const $productRenderCtn = document.querySelector(".product_list");
  const $search = document.querySelector(".search__input");
  const $searchRender = document.querySelector(".search_render_tab");
  const $searchRenderCtn = document.querySelector(".render_list");
  const $saleBtn = document.querySelector(".send_sales");
  const $holdBtn = document.querySelector(".hold_sales");
  const $noProductsSoldT = document.querySelector(".number_products_sold");
  const $qtyProductsSold = document.querySelector(".qty_products_sold");
  const $totalSold = document.querySelector(".products_total_amount");
  // Patient Profile Variables and elements

  const $patientCtn = document.querySelector(".patient_profile");
  const $addPatientCtn = document.querySelector(".add_patient_ctn");
  const $ctnButton = document.querySelector(".add_patient");
  const $removeCtnButton = document.querySelector(".remove_ctn");
  const $openPatientProfile = document.querySelector(".patient_container");
  const $removePatientProfile = document.querySelector(
    ".remove_patient_profile"
  );
  const $patientForm = document.querySelector("#main_ctn");
  const $patientSearch = document.querySelector(".patient_search");
  const $patientRenderCtn = document.querySelector(".patient_list");
  // Patient display
  const $mainPatientRenderCtn = document.querySelector(
    ".render_patient_searched"
  );
  const $patientDisplayCtn = document.querySelector(".patient_display");
  const $patientDisplayName = document.querySelector(".patient_display_name");
  const $patientDisplayFileNumber = document.querySelector(
    ".patient_display_contact"
  );
  const $removeDisplayBtn = document.querySelector(".display_cancel_btn");
  // Pricing
  const $pricingSystem = document.querySelectorAll(".pricing_unit input");
  // Confirm Purchase
  const $confirmPurchaseBtn = document.querySelector(".save_purchase");
  const $saleCtn = document.querySelector(".sale_ctn");
  const $removeSaleCtn = document.querySelector(".remove_sale_tab");
  const $patientDetail = document.querySelector(".patient_detail_title");
  // Hold Sales
  const $holdCtn = document.querySelector(".hold_container");
  const $removeHeldCtnBtn = document.querySelector(".remove_list");

  // Main Variables
  let productDatabase = null;
  let patientDatabase = null;
  let pricing = "";

  let productList = [];
  await getProducts();
  await getPatients();
  renderProduct();
  productTab();
  setPriceUnit();

  // $backdrop.classList.add("show");
  // functions
  function setPriceUnit() {
    $pricingSystem.forEach((unit) => {
      if (unit?.checked) {
        pricing = unit.value;
        return;
      }
    });
    renderProduct(productList);
  }

  function validateSale(list) {
    if (!list.length) {
      return {
        valid: false,
        quantity: false,
      };
    }

    return list.reduce(
      (acc, cur) => {
        if (
          !cur.get("quantity") ||
          !+cur.get("onHandQuantity") ||
          cur.get("quantity") > +cur.get("onHandQuantity")
        ) {
          acc.quantity = false;
        }
        return acc;
      },
      {
        valid: true,
        quantity: true,
      }
    );
  }
  // validate ONHAND QUANTITY
  function validateQuantity(products) {
    products.forEach((productItem) => {
      productDatabase.forEach((product) => {
        if (productItem.id === product._id) {
          productItem.onHandQuantity = product.quantity;
        }
      });
    });
  }
  // to hold sale
  async function holdSale(e) {
    if (e.target.innerHTML === "Held Sale") {
      if (!localStorage.getItem("productList")) {
        $notifyCtn.classList.remove("no_display");
        $message.style.backgroundColor = "#c41a1a";
        $message.textContent = "No Sale is Held";
        setTimeout(() => {
          $notifyCtn.classList.add("no_display");
          $message.style.backgroundColor = "transparent";
        }, 900);
        return;
      } else {
        const heldSales = JSON.parse(localStorage.getItem("productList"));
        // then decide on which to render
        // bring the hold Sales container
        $holdCtn.classList.remove("no_display");
        // render the held Sales
        renderHeldSales(heldSales);
      }
    } else {
      const heldProducts = [];
      const products = productList.map((product) => {
        return Object.fromEntries(product);
      });
      const data = Object.create(null);
      data.amount = +$totalSold.textContent.replace("NGN", "").replace(",", "");
      if (!$patientDisplayName.textContent.trim()) {
        data.patient = {
          name: "UNREGISTERED",
          fileNumber: "",
        };
      } else {
        data.patient = {
          name: $patientDisplayName.textContent,
          fileNumber: $patientDisplayFileNumber.textContent,
        };
      }

      data.location = $location;
      data.unit = $unit;
      data.products = products;
      if (!localStorage.getItem("productList")) {
        heldProducts.push(data);
        localStorage.setItem("productList", JSON.stringify(heldProducts));
        // please the elements in the array
      } else {
        const heldProducts = JSON.parse(localStorage.getItem("productList"));
        heldProducts.push(data);
        localStorage.setItem("productList", JSON.stringify(heldProducts));
      }
      productList.length = 0;
      await getProducts();
      e.target.innerHTML = "Held Sale";
      renderProduct(productList);
      productTab(productList);
      validateQuantity(productList);
      removeDisplay();
    }
  }
  // Rendering products in prescription
  function renderProduct(products = []) {
    const nf = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NGN",
    });

    $productRenderCtn.innerHTML = "";
    if (!products.length) {
      $holdBtn.innerHTML = "Held Sale";
      $productRenderCtn.innerHTML = $emptyList.outerHTML;
      return;
    }
    $search.value = "";
    $holdBtn.innerHTML = "Hold Sale";
    productTab(productList);

    products.map((product, i) => {
      let price = "";
      let amount = "";
      if (pricing === "NNPC") {
        price = product.get("nnpcPrice");
      } else if (pricing === "NHIA") {
        price = product.get("nhiaPrice");
      } else {
        price = product.get("sellingPrice");
      }
      amount = (price * product.get("quantity")).toFixed(2);
      const productItem = `
          <div class="product_item">
              <div class="product_structure">
                <div class="product_name">${product.get("name")}</div>
                <input type="number" id="quantity${i}" value="${product.get(
        "quantity"
      )}"  class="product_quantity" min="1">
                <div class="unit_quantity_price">${price}</div>
                <div class="quantity_price">${amount}</div>
                <span class="no_display product_id">${product.get("id")}</span>
              </div>
                <div class="product_details">
                  <div class="onhand_quantity product_detail_structure">
                    <div class="quantity_title">On Hand Qty : </div>
                    <div class="on_hand_qty">${product.get(
                      "onHandQuantity"
                    )}</div>
                  </div>
                  <div class="expiry product_detail_structure">
                    <div class="expiry_title">Expiry Date : </div>
                    <div class="expiry_date">${product.get("expiry")}</div>
                  </div>
                  <button class="remove_product">delete</button>
                </div>

                
          </div>`;
      $productRenderCtn.insertAdjacentHTML("beforeend", productItem);
    });

    // for delete
    const deleteProducts = document.querySelectorAll(".remove_product");
    /////////////////////////////////////////////////////////
    deleteProducts.forEach((product) =>
      product.addEventListener("click", deleteProduct)
    );
    // for inputs
    const productQuantities = document.querySelectorAll(".product_quantity");
    ///////////////////////////////////
    productQuantities.forEach((quantity) => {
      quantity.addEventListener("input", setProductPrice);
    });
  }
  function productTab(list) {
    const nf = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NGN",
    });
    if (!list || !list.length) {
      $noProductsSoldT.textContent = 0;
      $qtyProductsSold.textContent = 0;
      $totalSold.textContent = nf.format(0);
      return;
    }

    const { noProductsSold, productsSold, total } = list.reduce(
      (acc, cur, _, arr) => {
        let price = "";
        acc.noProductsSold = arr.length;
        acc.productsSold += cur.get("quantity");
        if (pricing === "NNPC") {
          price = cur.get("nnpcPrice");
        } else if (pricing === "NHIA") {
          price = cur.get("nhiaPrice");
        } else {
          price = cur.get("sellingPrice");
        }
        acc.total += +(cur.get("quantity") * price).toFixed(2);
        return acc;
      },
      {
        noProductsSold: 0,
        productsSold: 0,
        total: 0,
      }
    );

    $noProductsSoldT.textContent = noProductsSold;
    $qtyProductsSold.textContent = productsSold;
    $totalSold.textContent = nf.format(total);
  }
  // Remove Sale Ctn
  function removeSaleCtn(e) {
    e.preventDefault();
    $saleCtn.classList.add("no_display");
  }
  function removeHeldSaleCtn() {
    $holdCtn.classList.add("no_display");
  }
  // Confirm Sale
  async function confirmSale() {
    // e.preventDefault();
    const receiptNumber = document.querySelector("#sale_receipt");
    if (!receiptNumber.value || receiptNumber.value.length !== 6) {
      return;
    }

    // removing sale container
    $saleCtn.classList.add("no_display");
    // notification container
    $notifyCtn.classList.remove("no_display");
    // converting Map Object to  Object
    const products = productList.reduce((acc, cur) => {
      const data = Object.create(null);
      data.name = cur.get("name");
      data.id = cur.get("id");
      let price = "";
      if (pricing === "NNPC") {
        price = cur.get("nnpcPrice");
      } else if (pricing === "NHIA") {
        price = cur.get("nhiaPrice");
      } else {
        price = cur.get("sellingPrice");
      }
      data.amount = +(cur.get("quantity") * price).toFixed(2);
      data.quantity = cur.get("quantity");
      data.onHandQuantity = cur.get("onHandQuantity");
      acc.push(data);

      return acc;
    }, []);
    // Preparing Data to be Saved
    const data = Object.create(null);
    data.date = new Date();
    data.receiptNumber = receiptNumber.value;
    data.amount = +$totalSold.textContent.replace("NGN", "").replace(",", "");
    // check if patient is available
    if ($patientDisplayCtn.classList.contains("no_display")) {
      data.patient = {
        name: "UNREGISTERED",
        fileNumber: "",
      };
    } else {
      data.patient = {
        name: $patientDisplayName.textContent,
        fileNumber: $patientDisplayFileNumber.textContent,
      };
    }
    data.location = $location;
    data.unit = $unit;
    data.products = products;
    data.pricing = pricing;

    // save to database
    const response = await sendReq(
      token,
      JSON.stringify(data),
      addSale,
      $message,
      "Purchase Successful",
      "Problem Adding Sale"
    );
    if (response?.ok) {
      renderProduct();
      productTab();
      receiptNumber.value = "";
      $patientDisplayCtn.classList.add("no_display");
      products.forEach(async (product) => {
        const editStock = Object.create(null);
        editStock.quantity = product.quantity;
        // For Product
        const editStockResponse = await sendEditReq(
          token,
          editProductQuantityById,
          product.id,
          JSON.stringify(editStock),
          $message
        );

        const newProduct = await editStockResponse.json();

        // For Product Logs
        const movement = new Map();
        movement.set("date", new Date());
        movement.set("movement", data.patient.name);
        movement.set("issued", product.quantity);
        movement.set("balance", newProduct.quantity);
        movement.set("product", product.id);
        movement.set("location", $location);
        movement.set("unit", $unit);
        const movementResponse = await sendReq(
          token,
          JSON.stringify(Object.fromEntries(movement)),
          addProductLogs,
          $message,
          "Purchase Successfully",
          "Problem Adding Log"
        );
        if (movementResponse?.ok && editStockResponse?.ok) {
          movement.clear();
        }
      });
      await getProducts();
      productList.length = 0;
      // adjust stock quantity and products log
      // from front-end no back end sheninagans
    }

    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 900);
  }
  // Making A Product Sale
  function makeSale() {
    const { valid, quantity } = validateSale(productList);
    if (!valid && !quantity) {
      // error message
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#c41a1a";
      $message.textContent = "No Product to be Sold";
      setTimeout(() => {
        $notifyCtn.classList.add("no_display");
        $message.style.backgroundColor = "transparent";
      }, 900);
      return;
    }
    if (valid && !quantity) {
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#c41a1a";
      $message.textContent = "Please add Quantity";
      setTimeout(() => {
        $notifyCtn.classList.add("no_display");
        $message.style.backgroundColor = "transparent";
      }, 900);
      return;
    }
    $saleCtn.classList.remove("no_display");
    if ($patientDisplayCtn.classList.contains("no_display")) {
      $patientDetail.textContent = "Unregistered";
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#c41a1a";
      $message.textContent = "Unregistered";
    } else {
      $patientDetail.textContent = $patientDisplayName.textContent;
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 900);
  }
  // Deleting A Product from Prescription
  function deleteProduct(e) {
    const selectedProduct = e.target
      .closest(".product_item")
      .querySelector(".product_id").textContent;
    productList.splice(
      productList.findIndex((product) => product.get("id") === selectedProduct),
      1
    );
    // revert to
    renderProduct(productList);
    // dynamic adjust sales board
    productTab(productList);
  }

  //
  function setProductPrice(e) {
    const nf = new Intl.NumberFormat("en-GB");
    const productId = e.target
      .closest(".product_structure")
      .querySelector(".product_id").textContent;

    const quanityEstimatedPrice = e.target
      .closest(".product_structure")
      .querySelector(".quantity_price");
    const quanityPrice = e.target
      .closest(".product_structure")
      .querySelector(".unit_quantity_price");

    quanityEstimatedPrice.textContent = nf.format(
      +e.target.value * +quanityPrice.textContent
    );

    productList.forEach((product) => {
      if (product.get("id") === productId) {
        product.set("quantity", +e.target.value);
      }
    });
    productTab(productList);
  }
  // render Held Sales
  function renderHeldSales(sales) {
    const salesCtn = document.querySelector(".main_list");
    salesCtn.innerHTML = "";
    if (!sales || !sales.length) {
      return;
    }
    sales.map((sale) => {
      const saleItem = `<div class="held_sale">
                  <div class="sale_name_info">${sale.patient.name}</div>
                  <div class="sale_amount_info">₦${sale.amount}</div>
                </div>`;
      salesCtn.insertAdjacentHTML("beforeend", saleItem);
    });
    const saleElements = document.querySelectorAll(".held_sale");
    saleElements.forEach((element) =>
      element.addEventListener("click", renderHeldSaleInProductList)
    );
  }
  function renderHeldSaleInProductList(e) {
    const heldSales = JSON.parse(localStorage.getItem("productList"));
    const selectedSale = e.target.closest(".held_sale");
    const salesName = selectedSale
      .querySelector(".sale_name_info")
      .textContent.toUpperCase();
    const salesAmount = +selectedSale
      .querySelector(".sale_amount_info")
      .textContent.replace("₦", "");
    const mainSale = heldSales.find(
      (sale) =>
        sale.patient === salesName &&
        sale.amount === salesAmount &&
        sale.location === $location &&
        sale.unit === $unit
    );

    const newHeldSales = heldSales.filter(
      (sale) =>
        !(sale.patient === salesName) &&
        !(sale.amount === salesAmount) &&
        sale.location === $location &&
        sale.unit === $unit
    );
    // add it to prescription
    if (!mainSale) {
      return;
    }
    validateQuantity(mainSale.products);
    productList = mainSale.products.map((product) => {
      const productItem = new Map();
      Object.keys(product).forEach((key) => {
        productItem.set(key, product[key]);
      });
      return productItem;
    });
    if (mainSale.patient !== "UNREGISTERED") {
      $patientDisplayCtn.classList.remove("no_display");
      $patientDisplayName.textContent = mainSale.patient;
      $patientDisplayFileNumber.textContent = mainSale;
    }

    renderProduct(productList);
    productTab(productList);
    removeHeldSaleCtn();
    localStorage.setItem("productList", JSON.stringify(newHeldSales));
  }
  // Rendering searched Products in Sales Tab.
  function productRender(e) {
    $searchRender.classList.add("no_display");
    const productItem = new Map();
    const parent = e.target.closest(".product_searched");
    const productName = parent.querySelector(
      ".searched_product_name"
    ).textContent;
    const productPrice = parent.querySelector(
      ".searched_product_price"
    ).textContent;
    const productNhiaPrice = parent.querySelector(
      ".searched_product_nhia_price"
    ).textContent;
    const productNnpcPrice = parent.querySelector(
      ".searched_product_nnpc_price"
    ).textContent;
    const productQty = parent.querySelector(
      ".searched_product_quantity"
    ).textContent;
    const productExpiry = parent.querySelector(
      ".searched_product_expiry"
    ).textContent;
    const productId = parent.querySelector(".searched_product_id").textContent;
    const quantity = 1;
    productItem.set("name", productName);
    productItem.set("sellingPrice", +productPrice);
    productItem.set("nnpcPrice", +productNnpcPrice);
    productItem.set("nhiaPrice", +productNhiaPrice);
    productItem.set("onHandQuantity", +productQty);
    productItem.set("quantity", quantity);

    productItem.set("expiry", productExpiry);
    productItem.set("id", productId);
    const duplicate = productList.find(
      (product) => product.get("id") === productItem.get("id")
    );
    if (duplicate) {
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#c41a1a";
      $message.textContent = "This product already exists";
      setTimeout(() => {
        $notifyCtn.classList.add("no_display");
        $message.style.backgroundColor = "transparent";
      }, 900);
      return;
    }
    productList.push(productItem);
    renderProduct(productList);
    // it was here
  }
  // Searching Patients Function.
  function searchPatient(e) {
    let patients = [];
    if (!e.target.value) {
      searchPatientRender(patients);
      return;
    }
    patients = patientDatabase.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(e.target.value) ||
        patient.file_number.toLowerCase().includes(e.target.value)
      );
    });

    searchPatientRender(patients);
  }
  // Searched Products function
  function searchProduct(e) {
    let filteredProducts = [];
    if (!e.target.value) {
      $searchRender.classList.add("no_display");
      return filteredProducts;
    }
    $searchRender.classList.remove("no_display");
    filteredProducts = productDatabase.filter((product) => {
      return product.name.toLowerCase().includes(e.target.value);
    });
    searchRender(filteredProducts);

    const productsSearched = document.querySelectorAll(".product_searched");
    productsSearched.forEach((product) =>
      product.addEventListener("click", productRender)
    );
  }

  //  core functions
  /////////////////////
  // Remove Patient Data from prescription
  const removeDisplay = (e) => {
    $patientDisplayCtn.classList.add("no_display");
    $patientDisplayName.textContent = "";
    $patientDisplayFileNumber.textContent = "";
  };
  // function for Patient Functionality.
  function addPatientToPrescription(e) {
    const parent = e.target.closest(".searched_patient");
    const patientName = parent.querySelector(".searched_patient_name");
    const patientFileNumber = parent.querySelector(
      ".searched_patient_file_number"
    );
    // display the patient on the prescription.
    $mainPatientRenderCtn.classList.remove("show");
    $patientRenderCtn.innerHTML = "";
    $patientDisplayCtn.classList.remove("no_display");
    $patientDisplayName.textContent = patientName.textContent;
    $patientDisplayFileNumber.textContent = patientFileNumber.textContent;

    // resetting the prescription ish.
    $patientSearch.value = "";
    $patientCtn.classList.add("no_display");
    $backdrop.classList.remove("show");
    $addPatientCtn.classList.remove("show");
  }
  // Add Patient to Database.
  async function addNewPatient(e) {
    e.preventDefault();
    $notifyCtn.classList.remove("no_display");
    // adding Patient
    const response = await sendReq(
      token,
      JSON.stringify(Object.fromEntries(new FormData(e.target).entries())),
      addPatient,
      $message,
      "Patient Added",
      "Failed to Add Patient",
      "Server Error"
    );
    if (response?.ok) {
      e.target.reset();
      await getPatients();
      $addPatientCtn.classList.remove("show");
    }
    setTimeout(() => {
      $message.textContent = "";
      $notifyCtn.classList.add("no_display");
    }, 900);
  }
  // Patient Container functionality
  function removePatientProfile(e) {
    $patientCtn.classList.add("no_display");
    $backdrop.classList.remove("show");
    $patientSearch.value = "";
    $mainPatientRenderCtn.classList.remove("show");
    $patientForm.reset();
  }
  function openPatientProfile() {
    $patientCtn.classList.remove("no_display");
    $addPatientCtn.classList.remove("show");
  }
  function openAddCtn() {
    $addPatientCtn.classList.add("show");
  }
  function removeCtn() {
    $addPatientCtn.classList.remove("show");
    $patientForm.reset();
  }
  // get all Products
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
  async function getPatients() {
    const response = await getPatientDatabase(token, getAllPatients, $message);
    if (response?.ok) {
      patientDatabase = await response.json();
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 900);
  }
  // Rendering Patient Searched
  function searchPatientRender(patients = []) {
    $patientRenderCtn.innerHTML = "";
    if (!patients.length) {
      $mainPatientRenderCtn.classList.remove("show");
      return;
    }

    $mainPatientRenderCtn.classList.add("show");
    removeCtn();

    patients.map((patient) => {
      const searchedPatient = `
       <div class="searched_patient">
                  <div class="searched_patient_name">${patient.name}</div>
                  <div class="searched_patient_file_number">${patient.fileNumber}</div>
       </div>
      `;
      $patientRenderCtn.insertAdjacentHTML("beforeend", searchedPatient);
    });
    const searchedPatients = document.querySelectorAll(".searched_patient");
    searchedPatients.forEach((searchedPatient) =>
      searchedPatient.addEventListener("click", addPatientToPrescription)
    );
  }
  // Render Products searched
  function searchRender(products = []) {
    $searchRenderCtn.innerHTML = "";
    if (!products.length) {
      return;
    }

    products.map((product) => {
      const options = {
        year: "2-digit",
        month: "numeric",
      };
      let price = "";
      if (pricing === "NNPC") {
        price = product["nnpcPrice"];
      } else if (pricing === "NHIA") {
        price = product["nhiaPrice"];
      } else {
        price = product["sellingPrice"];
      }
      const expiryDate = Intl.DateTimeFormat("en-GB", options)
        .format(Date.parse(`${product.expiryDate}`))
        .replace("-", "/");
      const searchedProduct = `
      <div class="product_searched render_structure">
        <div class="searched_product_name">${product.name}</div>
        <div class="searched_product_price">${price}</div>
        <div class="searched_product_quantity">${product.quantity}</div>
        <div class="searched_product_expiry">${expiryDate}</div>
        <div class=" no_display searched_product_nnpc_price">${product.nnpcPrice}</div>
        <div class=" no_display searched_product_nhia_price">${product.nhiaPrice}</div>
        <div class=" no_display searched_product_id">${product._id}</div>
     </div>`;
      $searchRenderCtn.insertAdjacentHTML("beforeend", searchedProduct);
    });
  }
  $holdBtn.addEventListener("click", holdSale);
  $search.addEventListener("input", searchProduct);
  $saleBtn.addEventListener("click", makeSale);
  $ctnButton.addEventListener("click", openAddCtn);
  $removeCtnButton.addEventListener("click", removeCtn);
  $openPatientProfile.addEventListener("click", openPatientProfile);
  $removePatientProfile.addEventListener("click", removePatientProfile);
  $patientForm.addEventListener("submit", addNewPatient);
  $patientSearch.addEventListener("input", searchPatient);
  $removeDisplayBtn.addEventListener("click", removeDisplay);
  $pricingSystem.forEach((unit) => {
    unit.addEventListener("input", setPriceUnit);
  });
  $confirmPurchaseBtn.addEventListener("click", confirmSale);
  $removeSaleCtn.addEventListener("click", removeSaleCtn);
  $removeHeldCtnBtn.addEventListener("click", removeHeldSaleCtn);
})();
