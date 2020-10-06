const date = require('date-and-time');
const now = new Date();
let result = date.format(now, 'YYYY-MM-DD');

exports.result = result;
//ok