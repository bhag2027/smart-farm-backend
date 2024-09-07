const mongoose=require("mongoose")
const schema=mongoose.Schema(
    {
        name:{type:String,required:true},
        phno:{type:String,required:true},
        address:{type:String,required:true},
        place:{type:String,required:true},
        email:{type:String,required:true},
        password:{type:String,required:true}
    }
)

let usermodel=mongoose.model("Users",schema)
module.exports=usermodel