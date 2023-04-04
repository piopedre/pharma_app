const express = require("express");
const path = require("path");
const hbs = require("hbs");
require("./db/mongodb");
const app = express();
const port = process.env.PORT;
const adminRouter = require("./routers/admin");
const clientServer = require("../public/app");
const drugServer = require("./routers/drug");
const requistionServer = require("./routers/requistion");
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
app.use(drugServer);
app.use(requistionServer);
app.use(express.static(publicDir));

app.listen(port, () => {
  console.log("Server is live");
});
