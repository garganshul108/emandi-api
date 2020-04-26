const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");
const authAdmin = require("../middleware/authAdmin");
const decodeToken = require("../middleware/decodeToken");

router.post("/", (res, req) => {});

module.exports = router;
