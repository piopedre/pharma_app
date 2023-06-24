const mongoose = require("mongoose");

const db = mongoose.connect(
  process.env.MONGODB_URL
  //   autoIndex: false,
);

// remove index. lets see
