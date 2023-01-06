let user = require('./user');
let admin= require('./admin');
let exportRoute=[].concat(user, admin);
module.exports =  exportRoute;