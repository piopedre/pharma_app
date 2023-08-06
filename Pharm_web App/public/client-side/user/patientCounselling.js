import {
  getSales,
  getSalesDatabase,
  sendEditReq,
  editSalesById,
} from "../utils/utils.js";
(async function () {
  // QUERY SELECTORS
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const $unit = JSON.parse(sessionStorage.getItem("unit"));
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $notifyCtn = document.querySelector(".notification");
  const $message = document.querySelector(".notification__message");
  const $prescriptionCtn = document.querySelector(".prescriptions");
  const $salesSearch = document.querySelector("#sales_search");
  // VARIABLES
  let salesDatabase = null;
  await getProductsSales();
  renderSales(salesDatabase);
  // FUNCTIONS
  async function getProductsSales() {
    // GET SALES ON A MONTHLY BASIS
    const now = new Date();
    let next = "";
    if (now.getMonth() === 11) {
      next = new Date(now.getFullYear() + 1, 0, 1);
    } else {
      next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    const response = await getSalesDatabase(
      token,
      getSales,
      $location,
      $unit,
      $message,
      "",
      `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
      `${next.getFullYear()}-${next.getMonth() + 1}`
    );
    if (response?.ok) {
      salesDatabase = await response.json();
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 900);
  }
  function searchSales(e) {
    if (!e.target.value || !salesDatabase || !salesDatabase.length) {
      return;
    }
    const sales = salesDatabase.filter(
      (sale) =>
        sale.patient["name"].includes(e.target.value.toUpperCase()) ||
        sale.receiptNumber.includes(e.target.value.toUpperCase())
    );
    renderSales(sales);
  }
  async function savedStatus(e) {
    // add Counsellor to sales
    $notifyCtn.classList.remove("no_display");
    const salesId = e.target
      .closest(".prescription")
      .querySelector(".patient_detail .sale_id").textContent;
    const status = e.target.closest(".status").querySelector(".status_select");
    if (status.value === "COUNSELLED") {
      const data = Object.create(null);
      data.counsellor = status.value;
      const response = await sendEditReq(
        token,
        editSalesById,
        salesId,
        JSON.stringify(data),
        $message
      );
      if (response?.ok) {
        delete data.counsellor;
      }
      setTimeout(() => {
        $notifyCtn.classList.add("no_display");
        $message.style.backgroundColor = "transparent";
        location.reload();
      }, 900);
    }
  }

  function statusChanged(e) {
    const statusBtn = e.target.closest(".status").querySelector(".save_status");
    statusBtn.disabled = false;
  }
  function openContent(e) {
    const saleCtn = e.target.closest(".prescriptions");
    const selectedPrescription = e.target.closest(".prescription");
    const detail = selectedPrescription.querySelector(".prescription_content");
    const salesId = selectedPrescription.querySelector(
      ".patient_detail .sale_id"
    ).textContent;
    const status = selectedPrescription.querySelector(".status_select");
    const productCtn = detail.querySelector(".products_detail");
    const prescriptions = saleCtn.querySelectorAll(".prescription");
    // check if all other prescriptions is open
    prescriptions.forEach((prescription) => {
      if (!prescription.classList.contains("no_display")) {
        if (prescription === selectedPrescription) {
          return;
        }
        prescription
          .querySelector(".prescription_content")
          .classList.add("no_display");
      }
    });
    if (detail.classList.contains("no_display")) {
      detail.classList.remove("no_display");
    } else {
      if (status === e.target) {
        return;
      }
      detail.classList.add("no_display");
    }

    const selectedSale = salesDatabase.find((sale) => {
      return sale._id === salesId;
    });

    productCtn.innerHTML = "";
    selectedSale.products.map((product) => {
      if (!product) {
        return;
      }

      const productItem = ` <div class="product">
                            <div class="name">${product.name}</div>
                            <div class="quantity">${product.quantity}</div>
                        </div>`;
      productCtn.insertAdjacentHTML("beforeend", productItem);
    });
  }
  // Rendering Sales
  function renderSales(sales) {
    if (!sales || !sales.length) {
      return;
    }
    // clear the container
    $prescriptionCtn.innerHTML = "";
    sales.map((sale) => {
      let iscounselled = "";
      let isnotCounselled = "";
      if (sale.counsellor) {
        iscounselled = "selected";
      } else {
        isnotCounselled = "selected";
      }
      const salesItem = `
                <div class="prescription">
                    <div class="patient_detail">
                        <div class="patient_name">${sale.patient.name}</div>
                        <div class="patient_receipt_number">${sale.receiptNumber}</div>
                        <div class="sale_id no_display">${sale._id}</div>
                    </div>
                    <div class="prescription_content no_display">
                     <div class="product_headings">
                        <div class="product_name_heading">NAME</div>
                        <div class="product_qty_heading">QTY</div>
                      </div>
                    <div class="products_detail ">
                        
                        
                    </div>
                    <div class="counselling_ctn">
                      <h5 class="counselling_title">Interaction List</h5>
                      <div class="potential_interaction">
                        <div class="interaction">Risperidone has tendency to cause drowsiness</div>
                    </div>
                    <div class="status">
                      <div class="status_ctn">
                       <select name="status"  class="status_select">
                        <option ${isnotCounselled} value="NOT_COUNSELLED">Not Counselled</option>
                        <option ${iscounselled} value="COUNSELLED">Counselled</option>
                       </select>
                      </div>
                     
                       <button class="save_status">Save Changes</button>
                    </div>
                    </div>
                    </div>
                    
                </div>`;
      $prescriptionCtn.insertAdjacentHTML("beforeend", salesItem);
    });
    const prescriptions = document.querySelectorAll(".prescription");
    prescriptions.forEach((prescription) => {
      prescription.addEventListener("click", openContent);
    });
    const $saveStatuses = document.querySelectorAll(".save_status");
    $saveStatuses.forEach((saveStatus) => {
      saveStatus.addEventListener("click", savedStatus);
      saveStatus.disabled = true;
    });
    const statuses = document.querySelectorAll(".status_select");
    statuses.forEach((statusEl) => {
      statusEl.addEventListener("input", statusChanged);
    });
  }
  $salesSearch.addEventListener("input", searchSales);
})();
