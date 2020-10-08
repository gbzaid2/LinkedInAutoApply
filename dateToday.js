const date = require('date-and-time');
const now = new Date();
let result = date.format(now, 'YYYY-MM-DD');

module.exports = result;