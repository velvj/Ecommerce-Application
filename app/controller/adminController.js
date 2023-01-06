const csvjson = require('csvjson')
const fs = require('fs')
const path = require('path')
const productDB = require('../model/product')
const OrderDB = require('../model/order')


class adminController { }

//admin access of product

adminController.createProduct = async (req, res) => {
    try {
        if (req.auth.artifacts.role == 'user') {
            return res.response({ message: "Denied access" }).code(200);
        } else {
            const result = await productDB.query().insert(req.payload)
            return res.response({ message: 'product Added Successfully', data: result }).code(200);
        }
    }
    catch (error) {
        return res.response(error).code(500);
    }
}

adminController.listAllProduct = async (req, res) => {
    try {
        if (req.auth.artifacts.role == 'user') {
            return res.response({ message: "Denied access" }).code(200);
        }
        else {
            const readAll = await productDB.query();
            return res.response({ message: 'products List!', data: readAll }).code(200);
        }
    }
    catch (error) {
        console.log("error", error);
        return res.response(error).code(500);
    }

}

adminController.listProductbyId = async (req, res) => {
    try {
        if (req.auth.artifacts.role == 'user') {
            return res.response({ message: "Denied access" }).code(200);
        }
        const readbyId = await productDB.query().findById(req.query.id);
        return res.response({ message: `product ${req.query.id}!`, data: readbyId }).code(200);
    }
    catch (error) {
        return res.response(error).code(500);
    }
}


adminController.updateProduct = async (req, res) => {
    try {
        if (req.auth.artifacts.role == 'user') {
            return res.response({ message: "Denied access" }).code(200);
        }
        const update = await productDB.query().patchAndFetchById(req.query.id, req.payload);
        return res.response({ message: 'product updated!', data: update }).code(200);;
    }
    catch (error) {
        return res.response(error).code(500);
    }
}
adminController.delList = async (req, res) => {
    try {
        if (req.auth.artifacts.role == 'user') {
            return res.response({ message: "Denied access" }).code(200);
        }
        let del = await productDB.query().delete();
        return res.response({ message: 'product Deleted!', data: del }).code(200);
    }
    catch (error) {
        return res.response(error).code(500);
    }
}



//product Upload

adminController.uploadProduct = async (req, res) => {
    try {
        if (req.auth.artifacts.role == 'user') {
            return res.response({ message: "Denied access" }).code(200);
        }
        const data = req.payload;
        if (data.file) {
            // let name = await data.file.hapi.filename;
            // console.log("FIlename: " + name);
            if (typeof require !== 'undefined')
                XLSX = require('xlsx');

            let workbook = XLSX.read(data.file?._data, {
                type: 'buffer',
            })
            const sheetName = workbook.SheetNames;
            let xlData = await XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            for (let i = 0; i < xlData.length; i++) {
                const userCheck = await productDB.query().findOne({ model: xlData[i].model })
                if (!(userCheck == undefined)) {
                    await productDB.query().update(xlData[i]).where({ model: xlData[i].model })
                }
                else if (!xlData[i].id) {
                    await productDB.query().insertGraph(xlData[i])
                }
            }
            return res.response({ message: "sucessfully upload" }).code(200)

        }
    } catch (err) {
        console.log('Err----------------------' + err);
        return res.response(err.message, err).code(400)
    }
}

//order download

adminController.orderDownload = async (req, res) => {
    try {
        if (req.auth.artifacts.role == 'user') {
            return res.response({ message: "Denied access" }).code(200);
        }
        let listOrder = await OrderDB.query()
        let csvData = csvjson.toCSV(listOrder, {
            headers: 'key'
        });
        let down = __dirname + '/orderList.csv'
        fs.writeFile(down, csvData, (err) => {
            if (err) {
                console.log(err);
                throw new Error(err)
            }
            return res.response({ message: "successfully created" }).code(200)
        })
        return res.file(down)

    }
    catch (error) {
        return res.response(error).code(500);
    }

}

module.exports = adminController