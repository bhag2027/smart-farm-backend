const mongoose=require("mongoose")
const Venderschema=mongoose.Schema(
    {
        v_name:{type:String,required:true},
        v_phno:{type:String,required:true},
        v_address:{type:String,required:true},
        v_place:{type:String,required:true},
        v_email:{type:String,required:true},
        v_password:{type:String,required:true},
        
    }
)

let vendormodel=mongoose.model("Vendor",Venderschema)
module.exports=vendormodel