import { getAllDrugs, requiste } from "../utils/utils.js";
// DOM ELEMENTS
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
let drugs = [];
let mainRequistion = [];
// FUNCTIONS
const validity = (items) => {
  if (items.length) {
    return items.reduce(
      (acc, drug, curIndex) => {
        if (drug.stock_required <= 0 || drug.quantity_price <= 0) {
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
    requistion.map((drug) => {
      const requiste = ` <div class="requistion_item">
                 <div class="drug_details">${drug.details}</div>
                 <div class="item_quantity">${drug.quantity}</div>
              <input type="number" class="stock_required" value=${
                drug.stock_required
              } min='1' required>
              <div class="unit_price">${drug.cost_price}</div>
              <div class="quantity_price">${nf.format(
                drug.quantity_price
              )}</div>
              <div class="drug_id no_display">${drug.id}</div>
              <div class="delete_item">❌</div>
              </div>`;
      $requistionContainer.insertAdjacentHTML("beforeend", requiste);
    });
    const values = mainRequistion.reduce(
      (acc, cur, _, arr) => {
        acc.qtySold += cur.stock_required;
        acc.noItems = arr.length;
        acc.quantityPrice += cur.quantity_price;
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
////////////////////////////
try {
  const response = await getAllDrugs(token, $location, $pharmacyUnit);
  if (!response.ok) {
    throw new ResponseError("Bad Fetch Response", response);
  }
  const result = await response.json();
  drugs = result;
} catch (err) {
  $notifyCtn.classList.remove("no_display");
  switch (err?.response?.status) {
    case 400:
      $message.textContent = "Error, Fetching Database";
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
      $message.textContent = "Database is Empty";
      break;
    case 500:
      $message.textContent = "server, error connecting to database";
      break;
  }
}
setTimeout(() => {
  $notifyCtn.classList.add("no_display");
  $message.style.backgroundColor = "transparent";
}, 900);
const sendRequistion = async () => {
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
  console.log("sent");
  const requistionData = new Map();
  requistionData.set("pharmacy_unit", "opd-pharmacy");
  requistionData.set("location", "uselu");
  requistionData.set("date", new Date());
  requistionData.set("store", "uselu-store");
  requistionData.set("requistion_pharmacist", "Uvy Caroline");
  requistionData.set("store_pharmacist", "Machine Kelly");
  requistionData.set("requistion_process", true);
  requistionData.set("requistions", mainRequistion);
  console.log(requistionData);
  const jsonData = JSON.stringify(Object.fromEntries(requistionData));
  try {
    const response = await requiste(token, jsonData);
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
  } catch (err) {
    $notifyCtn.classList.remove("no_display");
    $message.style.backgroundColor = "#c41a1a";
    switch (err?.response?.status) {
      case 400:
        $message.textContent = "Error, Sending Requistion";
        break;
      case 401:
        location.replace("/pharma_app/login");
        break;
      case 404:
        $message.textContent = "Database is Empty";
        break;
      case 500:
        $message.textContent = "server, error connecting to database";
        break;
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.textContent = "";
      $message.style.backgroundColor = "transparent";
    }, 3000);
  }
  /////////////////////////////////
  // const data = JSON.stringify({
  //   pharmacy_unit: "opd-pharmacy",
  //   location: "uselu",
  //   date: new Date().toISOString().split("T")[0],
  //   store: "uselu-store",
  //   requistion_pharmacist: "Uvy Caroline",
  //   store_pharmacist: "Machine Kelly",
  //   requistion_process: true,
  //   requistions: requistion,
  // });

  // const response = await requiste(token, data);
  // if (response.status === 201) {
  //   $message.textContent = "Sent to the Store";
  //   $notifyCtn.style.backgroundColor = "#039f3a";
  //   $notifyCtn.classList.remove("remove");
  //   mainRequistion = [];
  //   $searchInput.value = "";

  //   setTimeout(() => {
  //     $notifyCtn.classList.add("remove");
  //   }, 7000);
  // } else if (response.status === 400) {
  //   const text = await response.text();
  //   console.log(text);
  // }
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
  const sumTotal = +e.target.value * +unitPrice;
  drugQuantityPrice.textContent = nf.format(sumTotal);

  mainRequistion.forEach((drug) => {
    if (drug.id === drug_id) {
      drug.stock_required = +e.target.value;
      drug.quantity_price = sumTotal;
    }
  });
  const values = mainRequistion.reduce(
    (acc, cur, _, arr) => {
      acc.qtySold += cur.stock_required;
      acc.noItems = arr.length;
      acc.quantityPrice += cur.quantity_price;
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
    (requiste) => requiste.id !== drugId
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
  const drugItem = e.target.closest("div").closest("span").closest("div");
  const drugDetails = drugItem.querySelector(
    ".drug__name .element"
  ).textContent;
  const drugQuantity = drugItem.querySelector(
    ".drug__quantity .element"
  ).textContent;
  const costPrice = drugItem.querySelector(".cost_price").textContent;
  const drugId = drugItem.querySelector(".drug__id").textContent;
  const stockRequired = 1;

  const drugRequisted = {
    id: drugId,
    details: drugDetails,
    quantity: +drugQuantity,
    cost_price: costPrice,
    stock_required: stockRequired,
    quantity_price: stockRequired * costPrice,
  };
  const duplicate = mainRequistion.find(
    (requiste) => requiste.id === drugRequisted.id
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
  const drugRender = drugs.filter((drug) => {
    return drug.name.includes(searchValue);
  });
  $searchRender.innerHTML = "";
  drugRender.map((drug) => {
    let itemDetail;
    if (drug.drug_type === "CONSUMABLE") {
      itemDetail = `${drug.name}`;
    } else {
      itemDetail = `${drug.drug_type.slice(0, 3)} ${drug.name} ${
        drug.strength
      }`;
    }

    const drugItem = `<div class="drug__item">
  <div class="drug__name">
    <div class="element">${itemDetail}</div>
    <span class="detail">${itemDetail}</span>
  </div>
  <div class="drug__quantity">
    <div class="element">${drug.quantity}</div>
    <span class="detail">Quantity</span>
  </div>
  <span>
    <div class="add_element">➕</div>
    <span class="detail">add</span>
  </span>
  
  <span class="cost_price no_display">${drug.cost_price}</span>
  <span class="drug__id no_display">${drug._id}</span>
</div>`;
    $searchContainer.style.display = "block";
    $searchRender.insertAdjacentHTML("beforeend", drugItem);
  });
  const addElements = document.querySelectorAll(".add_element");
  addElements.forEach((addElement) => {
    addElement.addEventListener("click", addToRequistion);
  });
};

$searchInput.addEventListener("input", addDrug);
$sendRequistion.addEventListener("click", sendRequistion);
$holdRequistion.addEventListener("click", holdRequistion);
