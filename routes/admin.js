var express = require("express");
var router = express.Router();
const domain = require("../config/domain");
const axios = require("axios");
const jwtDecode = require("jwt-decode");

/* GET users listing. */
router.get("/", async function (req, res) {
    res.render('admin/index');
});

/* GET users listing. */
router.get("/course", async function (req, res) {
    res.render('admin/tables');
});

/* GET users listing. */
router.get("/student", async function (req, res) {
    res.render('admin/index');
});

/* GET users listing. */
router.get("/teacher", async function (req, res) {
    res.render('admin/index');
});

/* GET users listing. */
router.get("/setting", async function (req, res) {
    res.render('admin/index');
});

module.exports = router;
