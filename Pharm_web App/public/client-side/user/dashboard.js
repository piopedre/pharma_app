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
  const $salesSlide_3 = document.querySelector("#sales_slide_3");
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
  let monthlySalesDatabase = null;
  await getProducts();
  await getProductSales();
  await getMonthlyProductSales();
  // FUNCTIONS
  const layout = {
    title: "PRODUCT CLASS POPULARITY REPORT",
    font: {
      family: "Raleway, sans-serif",
      size: 10,
    },
  };

  Plotly.newPlot($salesSlide_1, {
    data: [
      {
        ...productAnalysis(),
      },
    ],
    layout,
  });
  // SALES LAYOUT
  // SALES BASED ON MONTH per day
  const salesLayout = {
    title: "SALES REPORT",
    font: { size: 10 },
  };
  Plotly.newPlot($salesSlide_2, {
    data: [
      {
        ...salesAnalysis(),
      },
    ],
    layout: salesLayout,
  });
  // PRODUCT SALES LAYOUT
  const productSalesLayout = {
    title: "PRODUCTS SALES REPORT",
    font: { size: 10 },
  };
  Plotly.newPlot($salesSlide_3, {
    data: [
      {
        ...productSalesAnalysis(),
      },
    ],
    layout: productSalesLayout,
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
  async function getMonthlyProductSales() {
    let endDate = "";
    const startDate = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }`;
    if (new Date().getMonth() + 2 > 12) {
      endDate = `${new Date().setFullYear(new Date().getFullYear + 1)}`;
    } else {
      endDate = `${new Date().getFullYear()}-${new Date().getMonth() + 2}`;
    }

    const response = await getSalesDatabase(
      token,
      getSales,
      $location,
      $unit,
      $message,
      "",
      startDate,
      endDate
    );
    if (response?.ok) {
      monthlySalesDatabase = await response.json();
    }
    setTimeout(() => {
      $notifyCtn.classList.add("no_display");
      $message.style.backgroundColor = "transparent";
    }, 900);
  }

  // Analyzing Products Array
  // DRUG PORPULARIRTY BASED ON USE
  function productAnalysis(color = "#1abcc4") {
    if (productDatabase || productDatabase?.length) {
      const dataAnalysed = productDatabase.reduce((acc, cur) => {
        acc[cur.productCategory]
          ? acc[cur.productCategory]++
          : (acc[cur.productCategory] = 1);
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
      acc[cur.patient]
        ? (acc[cur.patient.name] += cur.amount)
        : (acc[cur.patient.name] = cur.amount);
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
  // Product Sold Analaysis
  function productSalesAnalysis(color = "#0274c0") {
    if (monthlySalesDatabase || monthlySalesDatabase?.length) {
      const dataAnalysed = monthlySalesDatabase
        .flatMap((sale) => {
          return sale.products;
        })
        .reduce((acc, cur) => {
          acc[cur.name]
            ? (acc[cur.name] += cur.quantity)
            : (acc[cur.name] = cur.quantity);
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
