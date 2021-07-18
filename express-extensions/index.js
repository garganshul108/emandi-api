const express = require('express');

module.exports = function setExtenstions (app) {
    app.use(require("morgan")("tiny"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(require("helmet")());
    app.use(require("compression")());
}