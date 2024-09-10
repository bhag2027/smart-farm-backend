const mongoose=require("mongoose")
const schema=mongoose.Schema(
    {
        
        email:{type:String,required:true},
        password:{type:String,required:true}
    }
)

let adminModel=mongoose.model("admins",schema)
module.exports=adminModel