const express=require("express")
const mongoose=require( "mongoose")
const cors=require( "cors")
const bcrypt=require( "bcrypt")
const jwt=require( "jsonwebtoken")
const usermodel=require('./models/users')

const adminModel = require("./models/adminmodel")
let app=express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://bhagya:bhagya20@cluster0.gszky.mongodb.net/smartfarmdb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signin",async(req,res)=>{
    let input=req.body
    let result=usermodel.find({ email:req.body.email}).then(
        (items)=>{
            if (items.length>0) {
                const passwordvalidator=bcrypt.compareSync(req.body.password,items[0].password)
                if (passwordvalidator) {
                    jwt.sign({email:req.body.email},"farmapp",{expiresIn:"1d"},
                    (error,token)=>{
                   if (error) {
                    res.json({"status":"error","error":error})
                   } 
                   else {
                    res.json({"status":"success","token":token,"userid":items[0]._id})
                   }
                    })
                } else {
                    res.json({"status":"invalid password"})
                    
                }
            } else {
                res.json({"status":"invalid email"})
                
            }
        }
    ).catch()
})



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

app.post("/adminlogin", (req, res) => {
    let input = req.body;

    // Default admin credentials
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    // Check if the input matches admin credentials
    if (input.email === adminEmail && input.password === adminPassword) {
        // Admin login successful
        jwt.sign({ email: input.email }, "farmapp", { expiresIn: "1d" }, (error, token) => {
            if (error) {
                res.json({ "status": "Token credentials failed" });
            } else {
                res.json({ "status": "success", "token": token, "message": "Admin logged in successfully" });
            }
        });
    } else {
        // Check if the user exists in the database
        adminModel.find({ name: input.name }).then((response) => {
            if (response.length > 0) {
                const validator = bcrypt.compareSync(input.password, response[0].password);
                if (validator) {
                    // User login successful
                    jwt.sign({ email: input.email}, "farmapp", { expiresIn: "1d" }, (error, token) => {
                        if (error) {
                            res.json({ "status": "Token credentials failed" });
                        } else {
                            res.json({ "status": "success", "token": token });
                        }
                    });
                } else {
                    res.json({ "status": "Wrong password" });
                }
            } else {
                res.json({ "status": "Username doesn't exist" });
            }
        }).catch((err) => {
            res.json({ "status": "Error occurred", "error": err.message });
        });
    }
});


//view users
app.post("/view",(req,res)=>{
    let token =req.headers["token"]
    jwt.verify(token,"farmapp",(error,decoded)=>{
        if(error)
            {
                res.json({"status":"unauthorised access"})
            }
            else{
                if(decoded){
                   usermodel.find().then(
                    (response)=>{
                        res.json(response)
                    }
                ).catch().finally()

            }
        }
    })
    
})

app.listen(3030,()=>{
    console.log("server started")
})

