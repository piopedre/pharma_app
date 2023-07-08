import {
  getAllProducts,
  getDatabase,
  getSales,
  getSalesDatabase,
} from "../utils/utils.js";
(async function () {
  // DOM ELEMENTS
  const $salesDashboard = document.querySelector("#sales_dashboard");
  const $salesSlide_1 = document.querySelector("#sales_slide_1");
  const $salesSlide_2 = document.querySelector("#sales_slide_2");
  // carousel buttons
  const $forwardBtn = document.querySelector(".forward_btn");
  const $backwardBtn = document.querySelector(".backward_btn");
  // Carousel Slides
  const slides = document.querySelectorAll(".slide_structure");
  // cookies
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const $unit = JSON.parse(sessionStorage.getItem("unit"));
  // message
  const $message = document.querySelector(".notification__message");
  const $notifyCtn = document.querySelector(".notification");
  // Variables
  let productDatabase = null;
  let salesDatabase = null;
  await getProducts();
  await getProductSales();
  // FUNCTIONS
  const layout = {
    title: "PRODUCT POPULARITY BASED ON CLASS",
    font: { size: 10 },

    bargap: 0.05,
  };
  const data = productAnalysis();
  const sales = salesAnalysis();
  Plotly.react($salesSlide_1, {
    data: [
      {
        ...data,
      },
    ],
    layout,
  });
  const salesLayout = {
    title: "SALES BASED ON PATIENTS",
    font: { size: 10 },

    bargap: 0.05,
  };
  Plotly.react($salesSlide_2, {
    data: [
      {
        ...sales,
      },
    ],
    salesLayout,
  });

  // Get Products for analysis
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
  // Get Products Sales
  async function getProductSales() {
    const response = await getSalesDatabase(
      token,
      getSales,
      $location,
      $unit,
      $message
    );
    if (response?.ok) {
      salesDatabase = await response.json();
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 900);
  }
  // Analyzing Products Array
  // DRUG PORPULARIRTY BASED ON USE
  function productAnalysis(color = "#0274c0") {
    if (productDatabase || productDatabase.length) {
      const dataAnalysed = productDatabase.reduce((acc, cur) => {
        acc[cur.product_category]
          ? acc[cur.product_category]++
          : (acc[cur.product_category] = 1);
        return acc;
      }, {});
      const data = Object.entries(dataAnalysed).reduce(
        (acc, [key, value], i) => {
          acc.x.push(key);
          acc.y.push(value);
          return acc;
        },
        { x: [], y: [] }
      );
      data.type = "bar";
      data.marker = {
        color,
      };
      return data;
    }
    return;
  }
  // DAILY SALES
  function salesAnalysis(color = "#0274c0") {
    if (!salesDatabase || !salesDatabase.length) {
      return;
    }
    const dataAnalysed = salesDatabase.reduce((acc, cur) => {
      acc[cur.patient] ? acc[curpatient]++ : (acc[cur.patient] = cur.amount);
      return acc;
    }, {});
    const data = Object.entries(dataAnalysed).reduce(
      (acc, [key, value], i) => {
        acc.x.push(key);
        acc.y.push(value);
        return acc;
      },
      { x: [], y: [] }
    );
    data.type = "bar";
    data.marker = {
      color,
    };
    return data;
  }
  salesAnalysis();
  // CAROUSEL FUNCTIONALITY
  // current slide
  let curSlide = 0;
  // max slide
  let maxSlide = slides.length - 1;

  const forwardScroll = () => {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
    });
  };
  const backwardScroll = () => {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }

    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
    });
  };
  $forwardBtn.addEventListener("click", forwardScroll);
  $backwardBtn.addEventListener("click", backwardScroll);
})();
