const { adminController } = require('../controller');
const Joi = require("joi");



const admin = [
    {
        method: 'POST',
        path: '/admin/createProduct',
        options: {
            auth: 'jwt',
            validate: {
                payload: Joi.object({
                    productName: Joi.string().required(),
                    brand: Joi.string().required(),
                    model: Joi.number().required(),
                    category: Joi.string().required(),
                    price: Joi.number().required(),
                    color: Joi.string().required(),
                    qty: Joi.number().required(),
                }),
                failAction: (req, res, source, error) => {
                    console.log("Error: ", source.details[0].message);
                    return res.response({ error: source.details[0].message }).code(500).takeover();
                }
            }
        },
        handler: adminController.createProduct
    },
    {
        method: 'GET',
        path: '/admin/listProducts',
        options: { auth: 'jwt' },
        handler: adminController.listAllProduct
    }, {
        method: 'GET',
        path: '/admin/productById',
        options: { auth: 'jwt' },
        handler: adminController.listProductbyId
    },
    {
        method: 'PUT',
        path: '/admin/updateProduct',
        options: {
            auth: 'jwt',
            validate: {
                payload: Joi.object({
                    productName: Joi.string().optional(),
                    brand: Joi.string().optional(),
                    model: Joi.number().optional(),
                    category: Joi.string().optional(),
                    price: Joi.number().optional(),
                    color: Joi.string().optional(),
                    qty: Joi.number().optional(),
                }),
                failAction: (req, res, source, error) => {
                    console.log("Error: ", source.details[0].message);
                    return res.response({ error: source.details[0].message }).code(500).takeover();
                }
            }
        },
        handler: adminController.updateProduct
    },
    {
        method: 'DELETE',
        path: '/admin/delProduct',
        options: { auth: 'jwt' },
        handler: adminController.delList
    },
    {
        method: 'POST',
        path: '/admin/uploadProduct',
        options: {
            auth: 'jwt',
            payload: {
                maxBytes: 209715200,
                output: 'stream',
                parse: true,
                multipart: true
            }
        },
        handler: adminController.uploadProduct


    },

    {
        method: 'GET',
        path: '/admin/orderlist_download',
        options: { auth: 'jwt' },
        handler: adminController.orderDownload
    }

]

module.exports = admin