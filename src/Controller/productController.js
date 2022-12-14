const services = require("../Service/productService")
const Product = require("../Model/Brand")
const { isExist } = require("../Service/commonService")

/* ------------ Get Products ------------ */
exports.getProducts = async (req, res) => {

    const { field, sort, limit = 5, page = 1 } = req.query
    const filter = { ...req.query }
    let query = {}

    const queryOptions = ["sort", "field", "page", "limit"]
    queryOptions.forEach(field => delete filter[field])

    if (field) {
        query["field"] = field.split(',').join(" ")
    }

    if (sort) {
        query["sort"] = sort.split(',').join(" ")
    }

    if (limit) {
        query["limit"] = limit
    }

    if (page) {
        query["skip"] = (page - 1) * Number(limit)
    }

    let queryString = JSON.stringify(filter)
    queryString = JSON.parse(queryString.replace(/\b(gt|gte|lt|lte|e|ne)\b/g, match => `$${match}`)) // For [$gte, $gt, $lte, $lt, $e, $ne] operators

    try {
        const products = await services.getProductsService(queryString, query)
        res.status(201).json({ status: "Successful", message: "Product data got successfully", data: products })
    } catch (error) {
        res.status(500).json({ status: "Fail", error: error.message })
    }
}

/* ------------ Get Product ------------ */
exports.getProduct = async (req, res) => {

    const { id } = req.params

    const existence = isExist(id, Product)
    if (!existence) {
        return res.status(402).json({ status: "Fail", message: "Product data didn't exist!" })
    }

    try {
        const product = await services.getProductService(id)
        res.status(201).json({ status: "Successful", message: "Product data got successfully", data: product })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Fail", error: error.message })
    }
}

/* ------------ Post Product ------------ */
exports.postProduct = async (req, res) => {

    try {
        const product = await services.postProductService(req.body)
        res.status(201).json({ status: "Successful", message: "Product data store to DB successfully", data: product })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Fail", error: error.message })
    }

}

/* ------------ Update Product ------------ */
exports.updateProduct = async (req, res) => {

    const { id } = req.params
    const existence = isExist(id, Product)
    if (!existence) {
        return res.status(402).json({ status: "Fail", message: "Product data didn't exist!" })
    }

    try {
        const product = await services.updateProductService(id, req.body)
        if (!product) {
            res.status(403).json({ status: "Fail", message: "Product data couldn't update!" })
        }

        res.status(201).json({ status: "Successful", message: "Product data updated successfully" })

    } catch (error) {
        res.status(500).json({ status: "Fail", error: error.message })
    }

}

/* ------------ Bulk Update Products ------------ */
exports.bulkUpdateProducts = async (req, res) => {

    const { products } = req.body

    try {
        const product = await services.updateProductsService(products)
        res.status(201).json({ status: "Successful", message: "Multiple Products data updated successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Fail", error: error.message })
    }

}

/* ------------ Delete Product ------------ */
exports.deleteProduct = async (req, res) => {

    const { id } = req.params
    const existence = isExist(id, Product, Product)
    if (!existence) {
        return res.status(402).json({ status: "Fail", message: "Product data didn't exist!" })
    }

    try {
        const product = await services.deleteProductService(id)

        if (!product) {
            res.status(403).json({ status: "Fail", message: "Product data couldn't delete." })
        }
        res.status(201).json({ status: "Successful", message: "Product data deleted successfully" })

    } catch (error) {
        res.status(500).json({ status: "Fail", error: error.message })
    }

}

/* ------------ Bulk Delete Products ------------ */
exports.bulkDeleteProducts = async (req, res) => {

    const { ids } = req.body

    try {
        const result = await services.deleteProductsService(ids)

        if (!result.deletedCount) {
            return res.status(403).json({ status: "Fail", message: "Products data didn't exist!" })
        }

        res.status(201).json({ status: "Successful", message: "Multiple Products data deleted successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Fail", error: error.message })
    }

}

exports.imageUpload = (req, res) => {
    res.send(req.file)
}