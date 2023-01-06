const { userConstroller } = require('../controller');
const Joi = require("joi");

const user = [
    {
        method: 'POST',
        path: '/register',
        options: {
            validate: {
                payload: Joi.object({
                    username: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required(),
                    phone: Joi.string().regex(/^[0-9]*$/).length(10).required(),
                    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
                    role: Joi.string().optional()
                }),
                failAction: (req, res, source, error) => {
                    console.log("Error: ", source.details[0].message);
                    return res.response({ error: source.details[0].message }).code(500).takeover();
                }
            }
        },
        handler: userConstroller.signUp
    },
    {
        method: 'POST',
        path: '/loginuser',
        options: {
            validate: {
                payload: Joi.object({
                    username: Joi.string().required(),
                    password: Joi.string().required()
                }),
                failAction: (req, res, source, error) => {
                    console.log("Error: ", source.details[0].message);
                    return res.response({ error: source.details[0].message }).code(500).takeover();
                }
            },
        },
        handler: userConstroller.login
    }, {
        method: 'GET',
        path: '/admin/list_User',
        options: { auth: 'jwt' },
        handler: userConstroller.readAllUser
    },
    {
        method: 'GET',
        path: '/admin/user_ById',
        options: { auth: 'jwt' },
        handler: userConstroller.readUser
    },
    {
        method: 'PUT',
        path: '/update_User',
        handler: userConstroller.updateUser
    },

    //order routes
    {
        method: 'POST',
        path: '/order_Create',
        handler: userConstroller.createOrder
    },
    {
        method: 'GET',
        path: '/listOrder',
        handler: userConstroller.listOfOrders
    },
    {
        method: 'GET',
        path: '/listOrderById',
        handler: userConstroller.listOrderbyId
    },
    {
        method: 'GET',
        path: '/update_Order',
        handler: userConstroller.updateOrder
    },
    {
        method: 'DELETE',
        path: '/delete_Order',
        handler: userConstroller.delOrder
    },
    {
        method: 'GET',
        path: '/date_Order',
        handler: userConstroller.OrderDate
    },
    {
        method: 'PUT',
        path: '/cancel_Order',
        handler: userConstroller.cancelOrder
    },
    {
        method: 'GET',
        path: '/cancel_Order_Count',
        options: { auth: 'jwt' },
        handler: userConstroller.cancelOrderCount
    },
    {
        method: 'GET',
        path: '/orders_Count',
        options: { auth: 'jwt' },
        handler: userConstroller.OrdersCount
    }
]

module.exports = user