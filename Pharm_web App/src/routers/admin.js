const express = require("express");
const router = new express.Router();
const Admin = require("../models/admin");
const authenication = require("../authenication/authenication");
const multer = require("multer");
const sharp = require("sharp");

router.post("/admins/registration", async (req, res) => {
  try {
    if (req.body.otp !== process.env.ADMINOTP_PASSCODE) {
      return res.status(401).send("Only Members Allowed");
    }
    delete req.body.otp;
    const admin = new Admin({ ...req.body });
    await admin.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get("/admins/me", authenication, async (req, res) => {
  res.send(req.admin);
});
// todo
// remove the error message
router.post("/admins/login", async (req, res) => {
  try {
    const admin = await Admin.findAdmin(req.body);
    const token = await admin.generateToken();
    const id = admin._id;
    res.status(200).send({ token, id });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.patch("/admins/update_user", authenication, async (req, res) => {
  const allowedUpdates = [
    "email",
    "title",
    "first_name",
    "last_name",
    "phone_number",
    "username",
  ];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Update an invalid element" });
  }
  try {
    updates.forEach((update) => (req.admin[update] = req.body[update]));
    await req.admin.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// router.get("/admins/:id", authenication, async (req, res) => {
//   const id = req.params.id;
//   try {
//     const admin = await Admin.findOne({ _id: id });
//     if (!admin) {
//       return res.status(404).send();
//     }
//     res.status(200).send(admin.toJSON());
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// });
// multer file upload
const upload = multer({
  linmits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("files must be jpg or jpeg or png"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/admins/avatar",
  authenication,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 100, height: 200 })
      .png()
      .toBuffer();
    // const admin = await Admin.findOne({ _id: req.params.id });
    req.admin.avatar = buffer;
    await req.admin.save();
    res.status(200).send();
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
  }
);

router.get("/admins/:id/avatar", async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });
    if (!admin || !admin.avatar) {
      throw new Error("image not found");
    }
    res.set("Content-Type", "image/png");
    res.send(admin.avatar);
  } catch (error) {
    res.status(404).send();
  }
});
// to get all drug sales
router.get("/admin/drugsales", authenication, async (req, res) => {});

router.post("/admin/logout", authenication, async (req, res) => {
  try {
    req.admin.tokens = [];
    await req.admin.save();
    res.status(200).send("Admin is logged out");
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
