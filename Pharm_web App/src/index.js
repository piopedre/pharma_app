const express = require("express");
const path = require("path");
const hbs = require("hbs");
require("./db/mongodb");
const app = express();
const port = process.env.PORT;
const adminRouter = require("./routers/admin");
const clientServer = require("../public/app");
const productServer = require("./routers/product");
const requistionServer = require("./routers/requistion");
const productCategoryServer = require("./routers/productCategory");
const productLogServer = require("./routers/productLog");
// define paths
const publicDir = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(adminRouter);
app.use(clientServer);
app.use(productServer);
app.use(requistionServer);
app.use(productCategoryServer);
app.use(productLogServer);
app.use(express.static(publicDir));

app.listen(port, () => {
  console.log("Server is live");
});
