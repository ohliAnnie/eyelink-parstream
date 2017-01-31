// models/Node.js

var QueryProvider = require('./dao/' + global.config.fetchData.database + '/'+ config.fetchData.method + '-db').QueryProvider;
var queryProvider = new QueryProvider();

var contactSchema = mongoose.Schema({
 name:{type:String, required:true, unique:true},
 email:{type:String},
 phone:{type:String}
});

var Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;