const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const authenication = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded_id = jwt.verify(token, process.env.ADMINKEY);
    const admin = await Admin.findOne({
      _id: decoded_id._id,
      "tokens.token": token,
    });
    if (!admin) {
      throw new Error();
    }
    req.token = token;
    req.admin = admin;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = authenication;
