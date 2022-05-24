const nedb = require('nedb');
const users = new nedb({ filename: 'db/users.db', autoload: true })
const products = new nedb({ filename: 'db/products.db', autoload: true });
const adventures = new nedb({ filename: 'db/adventures.db', autoload: true });
module.exports.users = users
module.exports.products = products
module.exports.adventures=adventures