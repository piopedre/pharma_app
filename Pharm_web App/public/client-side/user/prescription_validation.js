import { getDatabase, getAllProducts } from "../utils/utils.js";
(async function () {
  // Variables
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const $unit = JSON.parse(sessionStorage.getItem("unit"));
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $message = document.querySelector(".notification__message");
  const $notifyCtn = document.querySelector(".notification");
  const $emptyList = document.querySelector(".empty_list");
  const $productRenderCtn = document.querySelector(".product_list");
  const $search = document.querySelector(".search__input");
  const $searchRender = document.querySelector(".search_render_tab");
  const $searchRenderCtn = document.querySelector(".render_list");
  let productDatabase = null;
  const productList = [];
  await getProducts();
  renderProduct();
  // functions
  function productTab(list) {
    const noProductsSoldT = document.querySelector(".number_products_sold");
    const qtyProductsSold = document.querySelector(".qty_products_sold");
    const totalSold = document.querySelector(".products_total_amount");
    const nf = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NGN",
    });
    if (!list.length) {
      noProductsSoldT.textContent = 0;
      qtyProductsSold.textContent = 0;
      totalSold.textContent = nf.format(0);
      return;
    }

    const { noProductsSold, productsSold, total } = list.reduce(
      (acc, cur, _, arr) => {
        acc.noProductsSold = arr.length;
        acc.productsSold += cur.get("soldQty");
        acc.total += cur.get("priceSoldQty");
        return acc;
      },
      {
        noProductsSold: 0,
        productsSold: 0,
        total: 0,
      }
    );

    noProductsSoldT.textContent = noProductsSold;
    qtyProductsSold.textContent = productsSold;
    totalSold.textContent = nf.format(total);
  }
  function deleteProduct(e) {
    const selectedProduct = e.target
      .closest(".product_item")
      .querySelector(".product_id").textContent;
    productList.splice(
      productList.findIndex((product) => product.get("id") === selectedProduct),
      1
    );

    renderProduct(productList);
    productTab(productList);
  }
  function setProductPrice(e) {
    const nf = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NGN",
    });
    const productId = e.target
      .closest(".product_structure")
      .querySelector(".product_id").textContent;

    const quanityEstimatePrice = e.target
      .closest(".product_structure")
      .querySelector(".quantity_price");
    const quanityPrice = e.target
      .closest(".product_structure")
      .querySelector(".unit_quantity_price");

    quanityEstimatePrice.textContent = nf.format(
      +e.target.value * +quanityPrice.textContent
    );
    productList.forEach((product) => {
      if (product.get("id") === productId) {
        product.set("soldQty", +e.target.value);
        product.set(
          "priceSoldQty",
          +e.target.value * +quanityPrice.textContent
        );
      }
      return;
    });
    productTab(productList);
  }
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
    const productQty = parent.querySelector(
      ".searched_product_quantity"
    ).textContent;
    const productExpiry = parent.querySelector(
      ".searched_product_expiry"
    ).textContent;
    const productId = parent.querySelector(".searched_product_id").textContent;
    productItem.set("name", productName);
    productItem.set("costPrice", productPrice);
    productItem.set("quantity", productQty);
    productItem.set("expiry", productExpiry);
    productItem.set("id", productId);
    productItem.set("qtySold", 0);
    productItem.set("priceSoldQty", 0);
    productList.push(productItem);
    renderProduct(productList);
    // for inputs
    const productQuantities = document.querySelectorAll(".product_quantity");
    //////////////////////////////////////////////////////////
    productQuantities.forEach((quantity) => {
      quantity.addEventListener("input", setProductPrice);
    });
    // for delete
    const deleteProducts = document.querySelectorAll(".remove_product");
    /////////////////////////////////////////////////////////
    deleteProducts.forEach((product) =>
      product.addEventListener("click", deleteProduct)
    );
  }
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
      $notifyCtn.classList.add("no_display");
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 900);
  }
  function renderProduct(products = []) {
    $productRenderCtn.innerHTML = "";
    if (!products.length) {
      $productRenderCtn.innerHTML = $emptyList.outerHTML;
      return;
    }
    $search.value = "";
    products.map((product) => {
      const productItem = `
          <div class="product_item">
              <div class="product_structure">
                <div class="product_name">${product.get("name")}</div>
                <input type="number" value="0" class="product_quantity" min="1">
                <div class="unit_quantity_price">${product.get(
                  "costPrice"
                )}</div>
                <div class="quantity_price">0</div>
                <span class="no_display product_id">${product.get("id")}</span>
              </div>
                <div class="product_details">
                  <div class="onhand_quantity product_detail_structure">
                    <div class="quantity_title">On Hand Qty : </div>
                    <div class="on_hand_qty">${product.get("quantity")}</div>
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
  }
  function searchRender(products = []) {
    if (!products.length) {
      return;
    }
    products.map((product) => {
      $searchRenderCtn.innerHTML = "";
      const options = {
        year: "2-digit",
        month: "numeric",
      };
      const expiryDate = Intl.DateTimeFormat("en-GB", options)
        .format(Date.parse(`${product.expiry_date}`))
        .replace("-", "/");
      const searchedProduct = `
      <div class="product_searched render_structure">
        <div class="searched_product_name">${product.name}</div>
        <div class="searched_product_price">${product.selling_price}</div>
        <div class="searched_product_quantity">${product.quantity}</div>
        <div class="searched_product_expiry">${expiryDate}</div>
        <div class=" no_display searched_product_id">${product._id}</div>
     </div>;`;
      $searchRenderCtn.insertAdjacentHTML("beforeend", searchedProduct);
    });
  }

  $search.addEventListener("input", searchProduct);
})();
