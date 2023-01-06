const userDB = require('../model/User');
const OrderDB = require('../model/order')
const productDB = require('../model/product')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class userConstroller { }


//register user

userConstroller.signUp = async (req, res) => {
    try {
        const checkUser = await userDB.query().findOne({ username: req.payload.username })
        if (checkUser) return res.response('user already exists').code(400)
        else {
            let { password, role } = req.payload
            req.payload.password = await bcrypt.hash(password, 10)
            !role ? req.payload.role = 'user' : req.payload.role;
            const ins = await userDB.query().insert(req.payload)
            return res.response({ message: 'User Added Successfully!', data: ins }).code(200);
        }
    }
    catch (error) {
        return res.response(error).code(500);
    }
}


//login user

userConstroller.login = async (req, res) => {
    try {
        const findUser = await userDB.query().findOne({ username: req.payload.username })
        let passwordCheck = await bcrypt.compare(req.payload.password, findUser.password);
        if (passwordCheck) {
            let logtoken = jwt.sign({ id: findUser.id, role: findUser.role }, process.env.JWT_KEY, { algorithm: 'HS256' })
            return res.response({ message: 'User LoggedIn Successfully!', data: { id: findUser.id, email: findUser.username, phone: findUser.phone, role: findUser.role, token: logtoken } }).code(200);
        }
        else {
            return res.response({ message: 'Password is incorrect' }).code(200);
        }

    }
    catch (error) {
        return res.response(error).code(500);
    }
}


//user list

userConstroller.readAllUser = async (req, res) => {
    try {
        if (req.auth.artifacts.role == 'user') {
            return res.response({ message: "Denied access" }).code(402);
        }
        else {
            const readAll = await userDB.query().select('id', "username", "phone")
            return res.response({ message: 'User List!', data: readAll }).code(200);
        }

    }
    catch (error) {
        return res.response(error).code(500);
    }

}


//list by userId

userConstroller.readUser = async (req, res) => {
    try {
        const readbyId = await userDB.query().findById(req.query.id).select('id', "username", 'phone')
        if (!readbyId) return res.response({ message: `User ${req.query.id} Not available!` }).code(402)
        return res.response({ message: `User ${req.query.id}!`, data: readbyId }).code(200);
    }
    catch (error) {
        return res.response(error).code(500);
    }
}


//update user

userConstroller.updateUser = async (req, res) => {
    try {
        if (req.payload.password) req.payload.password = await bcrypt.hash(req.payload.password, 10)
        const update = await userDB.query().patchAndFetchById(req.query.id, req.payload)
        if (!update) return res.response({ message: `User ${req.query.id} Not available!` }).code(402)
        return res.response({ message: 'User updated!', data: update }).code(200);
    }
    catch (error) {
        return res.response(error).code(500);
    }
}


//delete user

userConstroller.list = async (req, res) => {
    try {
        let del = await userDB.query().delete().where({ id: req.payload.id });
        return res.response({ message: 'User Deleted!', data: del }).code(200);
    }
    catch (error) {
        return res.response(error).code(500);
    }
}


//order APIs 

//create order

userConstroller.createOrder = async (req, res) => {
    try {
        let value = await productDB.query().findOne({ id: req.payload.orderItem })
        req.payload.totalAmount = value?.price
        req.payload.isCancelled = false
        const result = await OrderDB.query().insert(req.payload)
        return res.response({ message: 'order placed Successfully!', data: result }).code(200);

    }
    catch (error) {
        console.log(error);
        return res.response(error).code(500);
    }
}


//order list

userConstroller.listOfOrders = async (req, res) => {
    try {
        if (req.query.id) {
            const userData = await OrderDB.query().where({ customerID: req.query.id }).joinRelated("[User,product]", {
                aliases: {
                    User: "U",
                    product: "P"
                }
            }).select("orders.customerID", "orders.orderItem", "orders.shippingAddress", "orders.orderDate", "orders.totalAmount", "U.id as userId", "U.username", "U.phone", "P.id as productId", "P.productName", "P.brand", "P.model", "P.category", "P.price", "P.color", "P.qty")
            if (!userData[0]) return res.response({ message: 'data not found!' }).code(404)
            return res.response({ message: 'user order data!', data: userData }).code(200);
        }
        else if (!req.query.id) {
            const readAll = await OrderDB.query().joinRelated("[User,product]", {
                aliases: {
                    User: "U",
                    product: "P"
                }
            }).select("orders.customerID", "orders.orderItem", "orders.shippingAddress", "orders.orderDate", "orders.totalAmount", "U.id as userId", "U.username", "U.phone", "P.id as productId", "P.productName", "P.brand", "P.model", "P.category", "P.price", "P.color", "P.qty")
            return res.response({ message: 'order List!', data: readAll }).code(200);
        }

    }
    catch (error) {
        return res.response(error).code(500);
    }

}


//get order by Id

userConstroller.listOrderbyId = async (req, res) => {
    try {
        const readbyId = await OrderDB.query().findById(req.query.id).joinRelated("[User,product]", {
            aliases: {
                User: "U",
                product: "P"
            }
        }).select("orders.customerID", "orders.orderItem", "orders.shippingAddress", "orders.orderDate", "orders.totalAmount", "U.id as userId", "U.username", "U.phone", "P.id as productId", "P.productName", "P.brand", "P.model", "P.category", "P.price", "P.color", "P.qty")
        return res.response({ message: `order ${req.query.id}!`, data: readbyId }).code(200);
    }
    catch (error) {
        return res.response(error).code(500);
    }
}


//order update

userConstroller.updateOrder = async (req, res) => {
    try {
        const update = await OrderDB.query().patchAndFetchById(req.query.id, req.payload);
        return res.response({ message: 'Order updated!', data: update }).code(200);;
    }
    catch (error) {
        return res.response(error).code(500);
    }
}


//del order

userConstroller.delOrder = async (req, res) => {
    try {
        let del = await OrderDB.query().delete().where({ id: req.payload.id })
        return res.response({ message: 'order Deleted!', data: del }).code(200);
    }
    catch (error) {
        return res.response(error).code(500);
    }
}


//search order by Date

userConstroller.OrderDate = async (req, res) => {
    try {
        console.log(req.query.date);
        let dateData = await OrderDB.query().where({ orderDate: req.query.date })
        console.log(dateData);
        return res.response({ message: 'list by date', data: dateData }).code(200);
    }
    catch (error) {
        return res.response(error).code(500);
    }
}


// cancel order

userConstroller.cancelOrder = async (req, res) => {
    try {
        let cancelData = await OrderDB.query().patchAndFetchById(req.payload.id, req.payload)
        return res.response({ message: 'order cancel successfully', data: cancelData }).code(200);
    }
    catch (error) {
        return res.response(error).code(500);
    }
}


//cancelled orders count

userConstroller.cancelOrderCount = async (req, res) => {
    try {
        let cancelData = await OrderDB.query().where({ isCancelled: true })
        return res.response({ message: 'cancelled orders', count: cancelData.length }).code(200);
    }
    catch (error) {
        return res.response(error).code(500);
    }
}

//total order count

userConstroller.OrdersCount = async (req, res) => {
    try {
        let cancelData = await OrderDB.query().where({ isCancelled: false })
        return res.response({ message: 'orders total', count: cancelData.length }).code(200);
    }
    catch (error) {
        return res.response(error).code(500);
    }
}




module.exports = userConstroller