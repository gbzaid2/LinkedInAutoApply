// Used to update airtable on job i applied to

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keypdLR94b8TBO3rP'
});
var base = Airtable.base('apph5lfwSYwXPauyS');

const pushToAirtable = async function(application){
    base('Job Leads').create(application, (err, record) => {});
}


exports.pushToAirtable = pushToAirtable;