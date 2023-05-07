import {
  getAllProducts,
  requiste,
  getDatabase,
  sendReq,
  getLastRequistion,
  ResponseError,
} from "../utils/utils.js";
// DOM ELEMENTS
(async function () {
  const $requistionContainer = document.querySelector(".requistion_body");
  const $emptyRequistion = document.querySelector(".empty_requistion");
  const $searchContainer = document.querySelector(".search__render_tab");
  const $searchRender = document.querySelector(".drug__items");
  const $searchInput = document.querySelector(".requistion_search");
  const $drugItems = document.querySelectorAll(".drug__item");
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const $pharmacyUnit = JSON.parse(sessionStorage.getItem("unit"));
  const $notifyCtn = document.querySelector(".notification");
  const $message = document.querySelector(".notification__message");
  const $holdRequistion = document.querySelector(".hold_requistion");
  const $sendRequistion = document.querySelector(".send_requistion");
  const $qtyRequisted = document.querySelector(".qty_requisted");
  const $qtySold = document.querySelector(".qty_sold");
  const $qtyTotal = document.querySelector(".qty_total");

  ////////////////////////////////////////////////////////
  // variables
  let database = null;
  let mainRequistion = [];
  await getProducts();

  // FUNCTIONS
  const validity = (items) => {
    if (items.length) {
      return items.reduce(
        (acc, product, curIndex) => {
          if (
            product.get("stock_required") <= 0 ||
            product.get("quantity_price") <= 0
          ) {
            acc.error = true;
            acc.index = curIndex;
          }
          return acc;
        },
        { error: null, index: null }
      );
    } else {
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#c41a1a";
      $message.textContent = "Please requiste a drug";
      setTimeout(() => {
        $notifyCtn.classList.add("no_display");
        $message.style.backgroundColor = "transparent";
      }, 900);
      return { error: "empty", index: null };
    }
  };
  const renderRequistion = (requistion = []) => {
    $requistionContainer.innerHTML = "";
    if (!$drugItems.length) {
      $searchContainer.style.display = "none";
    }

    if (!requistion.length) {
      $emptyRequistion.style.display = "block";
      $requistionContainer.innerHTML = $emptyRequistion.outerHTML;
      $holdRequistion.textContent = "Held Requistions";
    } else {
      $holdRequistion.textContent = "Hold Requistion";
      const nf = new Intl.NumberFormat("en-GB");
      const nfTotal = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "NGN",
      });
      requistion.map((product) => {
        if (!product.size) {
          return;
        }
        const requiste = ` <div class="requistion_item">
                 <div class="drug_details">${product.get("name")}</div>
                 <div class="item_quantity">${product.get(
                   "display_quantity"
                 )}</div>
              <input type="number" class="stock_required" value=${product.get(
                "stock_required"
              )} min='1' required>
              <div class="unit_price">${product.get("cost_price")}</div>
              <div class="quantity_price">${nf.format(
                product.get("quantity_price")
              )}</div>
              <div class="drug_id no_display">${product.get("id")}</div>
              <div class="delete_item">❌</div>
              </div>`;
        $requistionContainer.insertAdjacentHTML("beforeend", requiste);
      });
      const values = mainRequistion.reduce(
        (acc, cur, _, arr) => {
          acc.qtySold += cur.get("stock_required");
          acc.noItems = arr.length;
          acc.quantityPrice += cur.get("quantity_price");
          return acc;
        },
        {
          qtySold: 0,
          noItems: 0,
          quantityPrice: 0,
        }
      );
      const { qtySold, noItems, quantityPrice } = values;
      $qtyRequisted.textContent = noItems;
      $qtySold.textContent = qtySold;
      $qtyTotal.textContent = nfTotal.format(quantityPrice);
    }
    const deleteRequistes = document.querySelectorAll(".delete_item");
    deleteRequistes.forEach((item) => {
      item.addEventListener("click", deleteRequiste);
    });
  };
  renderRequistion();
  ////////////////////////////////////////
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
      database = await response.json();
      $notifyCtn.classList.add("no_display");
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 900);
  }

  const sendRequistion = async () => {
    $notifyCtn.classList.remove("no_display");
    const $requistionItems = document.querySelectorAll(".requistion_item");
    const { error, index } = validity(mainRequistion);
    if (error && error !== "empty") {
      $notifyCtn.classList.remove("no_display");
      $message.style.backgroundColor = "#c41a1a";
      $message.textContent = "Fill the quantity";
      $requistionItems[index].scrollIntoView();
      $requistionItems[index].style.border = " 1px solid red";
      setTimeout(() => {
        $notifyCtn.classList.add("no_display");
        $message.style.backgroundColor = "transparent";
        $requistionItems[index].style.border = "none";
      }, 900);
      return;
    } else if (error === "empty") {
      return;
    }
    const requistionData = new Map();

    // get last requistion
    try {
      const requistionResponse = await getLastRequistion(token);
      if (!requistionResponse?.ok) {
        throw new ResponseError("Bad Fetch response", requistionResponse);
      }
      const presentDate = Date.parse(new Date());
      const yearToday = Intl.DateTimeFormat("en-GB", {
        year: "numeric",
      }).format(presentDate);
      const [requistion] = await requistionResponse.json();
      const lastDate = Date.parse(`${requistion.date}`);
      const requistionYear = Intl.DateTimeFormat("en-GB", {
        year: "numeric",
      }).format(lastDate);

      if (+yearToday > +requistionYear) {
        requistionData.set("serial_number", 1);
      } else {
        requistionData.set("serial_number", +requistion.serial_number + 1);
      }
    } catch (err) {
      switch (err?.response?.status) {
        case 404:
          requistionData.set("serial_number", 1);
          break;
        case 500:
          $message.style.backgroundColor = "#c41a1a";
          $message.textContent = "Error, connecting to server";
          break;
      }
    }

    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.textContent = "";
      $message.style.backgroundColor = "transparent";
    }, 3000);

    requistionData.set("pharmacy_unit", "opd-pharmacy");
    requistionData.set("location", "uselu");
    requistionData.set("date", new Date());
    requistionData.set("requistion_process", true);
    const values = mainRequistion.reduce(
      (acc, cur, _, arr) => {
        acc.qtySold += cur.get("stock_required");
        acc.noItems = arr.length;
        acc.quantityPrice += cur.get("quantity_price");
        return acc;
      },
      {
        qtySold: 0,
        noItems: 0,
        quantityPrice: 0,
      }
    );
    const { noItems, quantityPrice } = values;
    requistionData.set("number_of_items_requisted", noItems);
    requistionData.set("cost_of_requistion", quantityPrice);
    mainRequistion = mainRequistion.map((product) =>
      Object.fromEntries(product)
    );
    requistionData.set("requistions", mainRequistion);
    const response = await sendReq(
      token,
      JSON.stringify(Object.fromEntries(requistionData)),
      requiste,
      $message,
      "requistion sent",
      "error sending requistion",
      "server error, unable to connect"
    );
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.textContent = "";
      $message.style.backgroundColor = "transparent";
    }, 3000);
    if (response?.ok) {
      $qtyRequisted.textContent = 0;
      $qtySold.textContent = 0;
      $qtyTotal.textContent = 0;
      renderRequistion();
      requistionData.clear();
      mainRequistion = null;
    }
  };
  const holdRequistion = (e) => {
    if (e.target.textContent === "Held Requistions") {
      console.log("held requistions");
      console.log(mainRequistion);
    } else {
      console.log("hold requistion");
      console.log(mainRequistion);
    }
  };
  const saveRequiredStock = (e) => {
    const nf = new Intl.NumberFormat("en-GB");
    const nfTotal = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NGN",
    });
    const parent = e.target.closest(".requistion_item");
    const drug_id = parent.querySelector(".drug_id").textContent;
    const unitPrice = parent.querySelector(".unit_price").textContent;
    const drugQuantityPrice = parent.querySelector(".quantity_price");
    const sumTotal = Math.ceil(+e.target.value * +unitPrice);
    drugQuantityPrice.textContent = nf.format(sumTotal);

    mainRequistion.forEach((product) => {
      if (product.get("id") === drug_id) {
        product.set("stock_required", +e.target.value);
        product.set("quantity_price", sumTotal);
      }
    });
    const values = mainRequistion.reduce(
      (acc, cur, _, arr) => {
        acc.qtySold += cur.get("stock_required");
        acc.noItems = arr.length;
        acc.quantityPrice += cur.get("quantity_price");
        return acc;
      },
      {
        qtySold: 0,
        noItems: 0,
        quantityPrice: 0,
      }
    );
    const { qtySold, noItems, quantityPrice } = values;
    $qtyRequisted.textContent = noItems;
    $qtySold.textContent = qtySold;
    $qtyTotal.textContent = nfTotal.format(quantityPrice);
  };
  const deleteRequiste = (e) => {
    const nfTotal = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NGN",
    });
    const parent = e.target.closest(".requistion_item");
    const drugId = parent.querySelector(".drug_id").textContent;
    const filteredRequistion = mainRequistion.filter(
      (requiste) => requiste.get("id") !== drugId
    );
    mainRequistion = filteredRequistion;
    if (!mainRequistion.length) {
      $qtyRequisted.textContent = 0;
      $qtySold.textContent = 0;
      $qtyTotal.textContent = nfTotal.format(0);
    }
    renderRequistion(mainRequistion);
  };
  const addToRequistion = (e) => {
    const productItem = e.target.closest("div").closest("span").closest("div");
    const name = productItem.querySelector(".drug__name .element").textContent;
    const displayQuantity = productItem.querySelector(
      ".drug__quantity .element"
    ).textContent;
    const costPrice = productItem.querySelector(".cost_price").textContent;
    const packSize = productItem.querySelector(".pack_size").textContent;
    const productId = productItem.querySelector(".drug__id").textContent;
    const stockRequired = 1;
    const drugRequisted = new Map();
    drugRequisted.set("id", productId);
    drugRequisted.set("name", name);
    drugRequisted.set("display_quantity", displayQuantity);
    drugRequisted.set("cost_price", +costPrice);
    drugRequisted.set("stock_required", stockRequired);
    drugRequisted.set("quantity_price", Math.ceil(+stockRequired * costPrice));
    drugRequisted.set("pack_size", packSize);

    const duplicate = mainRequistion.find(
      (requiste) => requiste.get("id") === drugRequisted.get("id")
    );
    if (duplicate) {
      $message.textContent = "Drug already exists";
      $notifyCtn.classList.remove("no_display");
      $notifyCtn.style.backgroundColor = "#ef0037";

      setTimeout(() => {
        $message.textContent = "";
        $notifyCtn.classList.add("no_display");
      }, 1000);
    } else {
      mainRequistion.push(drugRequisted);
      $searchInput.value = "";
      // drugRequisted.clear();
    }
    renderRequistion(mainRequistion);

    const $requiredStocks = document.querySelectorAll(".stock_required");
    $requiredStocks.forEach((stock) => {
      stock.addEventListener("input", saveRequiredStock);
    });
  };
  const addDrug = (e) => {
    const searchValue = e.target.value.toUpperCase().trim();
    if (!searchValue) {
      $searchContainer.style.display = "none";
      return;
    }
    const drugRender = database.filter((product) => {
      return product.name.includes(searchValue);
    });
    $searchRender.innerHTML = "";
    drugRender.map((product) => {
      const productItem = `<div class="drug__item">
  <div class="drug__name">
    <div class="element">${product.name}</div>
    <span class="detail">${product.name}</span>
  </div>
  <div class="drug__quantity">
    <div class="element">${product.display_quantity}</div>
    <span class="detail">Quantity</span>
  </div>
  <span>
    <div class="add_element">➕</div>
    <span class="detail">Add</span>
  </span>
  
  <span class="cost_price no_display">${
    product.cost_price * product.pack_size
  }</span>
  <span class="pack_size no_display">${product.pack_size}</span>
  <span class="drug__id no_display">${product._id}</span>
</div>`;
      $searchContainer.style.display = "block";
      $searchRender.insertAdjacentHTML("beforeend", productItem);
    });
    const addElements = document.querySelectorAll(".add_element");
    addElements.forEach((addElement) => {
      addElement.addEventListener("click", addToRequistion);
    });
  };

  $searchInput.addEventListener("input", addDrug);
  $sendRequistion.addEventListener("click", sendRequistion);
  $holdRequistion.addEventListener("click", holdRequistion);
})();
