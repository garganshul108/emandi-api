const router = require("express").Router();
const multer = require("multer");
const config = require("config");
const md5 = require("md5");
const path = require("path");

router.post(
  "/image",
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `./public/uploads/images`);
      },
      filename: (req, file, cb) => {
        const fext = path.extname(file.originalname);
        console.log(file);
        let fname1 = md5(`${Date.now()}${file.originalname}${file.mimetype}`);
        let fname2 = md5(`${Date.now()}${file.fieldname}${file.encoding}`);
        fname = `${fname1}${fname2}${fext}`;
        cb(null, fname);
      },
    }),
    fileFilter: function (req, file, callback) {
      const ext = path.extname(file.originalname);
      if (
        ext !== ".png" &&
        ext !== ".jpg" &&
        ext !== ".gif" &&
        ext !== ".jpeg"
      ) {
        return callback(null, false);
      }
      callback(null, true);
    },
  }).single("imageToBeUploaded"),
  (req, res) => {
    try {
      let url = `${config.get("api-url")}/images/${req.file.filename}`;
      console.log("REQ FILES\n", req.files, "\n", url);
      let details = { ...req.file };
      for (let key of ["destination", "path"]) delete details[key];

      return res.status(201).send([
        {
          url: url,
          file: { ...details },
        },
      ]);
    } catch (err) {
      return res.status(400).send([
        {
          message: "Image type not supported",
        },
      ]);
    }
  }
);
router.get("/", (req, res) => {
  return res.status(201).send([{ message: "Get /upload hit" }]);
});

module.exports = router;
