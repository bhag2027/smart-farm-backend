const express=require("express")
const mongoose=require( "mongoose")
const cors=require( "cors")
const bcrypt=require( "bcrypt")
const jwt=require( "jsonwebtoken")
const usermodel=require('./models/users')
let app=express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://bhagya:bhagya20@cluster0.gszky.mongodb.net/smartfarmdb?retryWrites=true&w=majority&appName=Cluster0")
app.post("/signup",async(req,res)=>{
    let input=req.body
    let hashedpassword=bcrypt.hashSync(req.body. password,10)
    req.body.password=hashedpassword
   
    usermodel.find({email:req.body.email}).then(
        (items)=>{
            if(items.length>0){
                res.json({"status":"emailid already exit"})
               }
               else {
        
                let result=new usermodel(input)
                result.save()
                res.json({"status":"success"})
        
               }

        }
    ).catch(
        (error)=>{}
    )
    
})


app.listen(3030,()=>{
    console.log("server started")
})

