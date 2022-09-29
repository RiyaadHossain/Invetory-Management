const express = require('express');
const router = express.Router()
const controller = require("../Controller/productController")

router.route("/")
    .get(controller.getProducts)
    .post(controller.postProduct)

router.route("/:id")
    .get(controller.getProduct)
    .patch(controller.updateProduct)
    .delete(controller.deleteProduct)

module.exports = router