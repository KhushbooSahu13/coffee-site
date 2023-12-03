const mongoose = require("mongoose");

const coffeeModel = new mongoose.Schema(

    {
       
        coffeename: String,
        amount: Number,
        contact :Number,
        city: String,
        category: String,
        address:String,
        pincode: Number,
        
        paymentmode: {
            type: String,
            enum: ["cash", "online", "cheque"],
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("coffee", coffeeModel);