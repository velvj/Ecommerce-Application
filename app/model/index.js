const db = require('../config/db');

module.exports = {
    user: require('./User'),
    product: require('./product'),
    order: require('./order')
}