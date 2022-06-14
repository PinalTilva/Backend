const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://Funds11:150430119115pM@Funds11.vvtll.mongodb.net/Funds?retryWrites=true&w=majority").then(() => {
    console.log('connected');
}).catch(() => {
    console.log('Not connected');
})