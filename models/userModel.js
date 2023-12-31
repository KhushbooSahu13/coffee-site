const mongoose= require("mongoose")
const plm= require("passport-local-mongoose")

const userModel = new mongoose.Schema(
    {
      
        username: String,
        password: String,
        email: String,
       
        
        coffees: [{ type: mongoose.Schema.Types.ObjectId, ref: "coffee" }],
    },
    { timestamps: true }
);
userModel.plugin(plm)
module.exports = mongoose.model("user",userModel)