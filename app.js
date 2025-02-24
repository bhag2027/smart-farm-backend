const express=require("express")
const mongoose=require( "mongoose")
const cors=require( "cors")
const bcrypt=require( "bcrypt")
const jwt=require( "jsonwebtoken")
const usermodel=require('./models/users')

const adminModel = require("./models/adminmodel")
const vendormodel=require("./models/vendor")
const productmodel = require("./models/Products")
const BookingModel=require("./models/bookmodel")
const authenticateUser = require('./middleware/authenticateUser');
const ProductModel = require("./models/Products")
const adminpost = require('./routes/adminpost');
const bodyParser = require('body-parser');
const upload = require('./middleware/upload'); 
const multer = require('multer');
const postModel = require("./models/post")
// const postsRoutes = require('./routes/postsRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); 
// // const dotenv = require('dotenv');
const vendorRoutes= require('./routes/vendor');
// const vendorReturnsRoutes = require('./routes/vendorReturns');
const userPostRoutes = require('./routes/userPostRoutes');
const vendorPostRoutes = require('./routes/vendorPostRoutes');
const authRoutes = require('./routes/auth');
// const returnRoutes = require('./routes/return');
const returnmodel = require("./models/return")
const ResaleModel = require("./models/resale")
// const resaleRoutes = require('./routes/resales');
let app=express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://bhagya:bhagya20@cluster0.gszky.mongodb.net/smartfarmdb?retryWrites=true&w=majority&appName=Cluster0")



//createpost 
// Middleware to parse JSON requests

// Middleware for parsing body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // Serve static files from 'uploads' folder
app.use('/uploads', express.static('uploads'));

// // Use the admin post routes for handling POST requests to '/admin/posts'
app.use('/admin/posts', adminpost);
app.use('/posts', userPostRoutes); 
app.use('/vendor/posts', vendorPostRoutes);

// app.use('/api', returnRoutes);

app.use('/api', authRoutes);
// app.use(resaleRoutes);
// //viewpost
// // Use post routes
// // Use the postRoutes
// app.use('/admin', postsRoutes);




// // Use vendor routes

// const vendorRoutes = require('./routes/vendor');
// app.use('/api/vendor', vendorRoutes);
app.use('/api', vendorRoutes);

// app.use('/api', vendorReturnsRoutes); 
// Use the routes for posts
// app.use(postRoutes);


//////////
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Default admin credentials (Move these to environment variables for better security)
  const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  try {
      // Check if the input matches the default admin credentials
      if (email === defaultAdminEmail && password === defaultAdminPassword) {
          // Admin login successful
          const token = jwt.sign({ email, role: 'admin' }, "farmapp", { expiresIn: "1d" });
          return res.json({ status: "success", token, role: 'admin', message: "Admin logged in successfully" });
      }

      // Check if the user is an admin in the database
      const admin = await adminModel.findOne({ email });
      if (admin) {
          // Compare the password with the stored hash
          const passwordMatch = bcrypt.compareSync(password, admin.password);
          if (!passwordMatch) {
              return res.json({ status: "error", message: "Incorrect password" });
          }
          const token = jwt.sign({ email: admin.email, _id: admin._id, role: 'admin' }, "farmapp", { expiresIn: "1d" });
          return res.json({ status: "success", token, role: 'admin', userId: admin._id, username: admin.name });
      }

      // const vendor = await vendormodel.findOne({ email }); // Corrected to v_email
      // if (vendor) {
      //     const passwordMatch = bcrypt.compareSync(password, vendor.password); // Corrected to v_password
      //     if (!passwordMatch) {
      //         return res.json({ status: "error", message: "Incorrect password" });
      //     }
      //     const token = jwt.sign({ email: vendor.email, _id: vendor._id, role: 'vendor' }, "farmapp", { expiresIn: "1d" });
      //     return res.json({ status: "success", token, role: 'vendor', userId: vendor._id, username: vendor.v_name });
      // }


      // Check if the user exists in the user table
      const user = await usermodel.findOne({ email });
      if (!user) {
          return res.json({ status: "error", message: "Invalid email id" });
      }

      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
          return res.json({ status: "error", message: "Incorrect password" });
      }

      const token = jwt.sign({ email: user.email, _id: user._id, role: 'user' }, "farmapp", { expiresIn: "1d" });
      return res.json({ status: "success", token, role: 'user', userId: user._id, username: user.name });
      
  } catch (error) {
      console.error("Login error:", error);
      return res.json({ status: "error", message: "An error occurred", error: error.message });
  }
});



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

// app.post("/adminlogin", (req, res) => {
//     let input = req.body;

//     // Default admin credentials
//     const adminEmail = 'admin@gmail.com';
//     const adminPassword = 'admin123';

//     // Check if the input matches admin credentials
//     if (input.email === adminEmail && input.password === adminPassword) {
//         // Admin login successful
//         jwt.sign({ email: input.email }, "farmapp", { expiresIn: "1d" }, (error, token) => {
//             if (error) {
//                 res.json({ "status": "Token credentials failed" });
//             } else {
//                 res.json({ "status": "success", "token": token, "message": "Admin logged in successfully" });
//             }
//         });
//     } else {
//         // Check if the user exists in the database
//         adminModel.find({ name: input.name }).then((response) => {
//             if (response.length > 0) {
//                 const validator = bcrypt.compareSync(input.password, response[0].password);
//                 if (validator) {
//                     // User login successful
//                     jwt.sign({ email: input.email}, "farmapp", { expiresIn: "1d" }, (error, token) => {
//                         if (error) {
//                             res.json({ "status": "Token credentials failed" });
//                         } else {
//                             res.json({ "status": "success", "token": token });
//                         }
//                     });
//                 } else {
//                     res.json({ "status": "Wrong password" });
//                 }
//             } else {
//                 res.json({ "status": "Username doesn't exist" });
//             }
//         }).catch((err) => {
//             res.json({ "status": "Error occurred", "error": err.message });
//         });
//     }
// });


// Search Users
app.post('/search/user', async (req, res) => {
  try {
    const { name } = req.body;
    const users = await usermodel.find({ name: { $regex: name, $options: 'i' } }); // Case-insensitive search
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: 'Error searching users' });
  }
});

// Search Vendors
app.post('/search/vendor', async (req, res) => {
  try {
    const { v_name } = req.body; // Extract v_name from the request body
    const vendors = await vendormodel.find({ v_name: { $regex: v_name, $options: 'i' } }); // Use v_name for the search
    res.json(vendors);
  } catch (error) {
    console.error("Error searching vendors:", error);
    res.status(500).json({ message: 'Error searching vendors' });
  }
});

// Delete User
app.post('/delete/user', async (req, res) => {
  try {
    const { _id } = req.body;
    await usermodel.findByIdAndDelete(_id);
    res.json({ status: "success", message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ status: "error", message: 'Error deleting user' });
  }
});

// Delete Vendor
app.post('/delete/vendor', async (req, res) => {
  try {
    const { _id } = req.body;
    await vendormodel.findByIdAndDelete(_id);
    res.json({ status: "success", message: "Vendor deleted" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({ status: "error", message: 'Error deleting vendor' });
  }
});

//view users

app.post("/view",(req,res)=>{
    usermodel.find().then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    ).finally()
})
 //view vendors

app.post("/viewvendor",(req,res)=>{
    vendormodel.find().then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    ).finally()
})

//users



  
//vendors

// Vendor sign-in route
app.post('/vendorsignin', async (req, res) => {
  const { v_email, v_password } = req.body;

  try {
    // Find vendor by email
    const vendor = await vendormodel.findOne({ v_email });

    // Check if vendor exists
    if (!vendor) {
      return res.status(400).json({ status: "failed", message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(v_password, vendor.v_password);
    if (!isPasswordValid) {
      return res.status(400).json({ status: "failed", message: "Invalid credentials" });
    }

    // If successful, generate a JWT token
    const token = jwt.sign({ vendorId: vendor._id }, "secret_key", { expiresIn: '1d' });

    // Respond with the token and vendor name
    return res.json({
      status: "success",
      token: token,
      vendorId: vendor._id, // Use vendorId instead of userid
      v_name: vendor.v_name // Return vendor's name
    });
  } catch (error) {
    console.error('Error during vendor sign-in:', error);
    return res.status(500).json({ status: "failed", message: "Server error. Please try again later." });
  }
});





// Vendor sign-up route
app.post("/vendorsignup", async (req, res) => {
    const { v_email, v_password } = req.body;
  
    try {
      // Check if email already exists
      const existingVendor = await vendormodel.findOne({ v_email });
  
      if (existingVendor) {
        return res.status(400).json({ status: "failed", message: "Email already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(v_password, 10);
  
      // Create a new vendor with the hashed password
      const newVendor = new vendormodel({
        ...req.body, // Spread the rest of the input fields
        v_password: hashedPassword // Store the hashed password
      });
  
      // Save the vendor to the database
      await newVendor.save();
  
      return res.status(201).json({ status: "success", message: "Vendor registered successfully" });
    } catch (error) {
      console.error("Error during vendor registration:", error);
      return res.status(500).json({ status: "failed", message: "Server error. Please try again later." });
    }
  });
  
  app.post('/add-product', upload.single('image'), async (req, res) => {
    const { name, price, stock, description, v_name, vendorId } = req.body;
    const imagePath = req.file ? req.file.path : null; // Get the image path from multer
  
    // Log the received data to check
    console.log('Received data:', req.body);
    console.log('Image Path:', imagePath);
  
    // Validate input data
    if (!name || !price || !stock || !description || !v_name || !vendorId) {
      return res.status(400).json({ success: false, message: 'Please provide all fields, including vendor ID.' });
    }
  
    // Create a new product document with the received data
    const newProduct = new ProductModel({
      name,
      price,
      stock,
      description,
      v_name,
      vendorId,
      image: imagePath, // Save the image path
    });
  
    try {
      // Save the product to the database
      await newProduct.save();
  
      // Return success response with the saved product
      res.status(201).json({
        success: true,
        message: 'Product added successfully!',
        product: newProduct,
      });
    } catch (err) {
      console.error('Error adding product:', err);
  
      // Return an error response
      res.status(500).json({
        success: false,
        message: 'Error adding product, please try again later.',
        error: err.message,
      });
    }
  });

  // app.post('/add-product', async (req, res) => {
  //   const { name, price, stock, description, v_name, vendorId } = req.body;
  
  //   // Log the received data to check
  //   console.log('Received data:', req.body);
  
  //   // Validate input data
  //   if (!name || !price || !stock || !description || !v_name || !vendorId) {
  //     return res.status(400).json({ success: false, message: 'Please provide all fields, including vendor ID.' });
  //   }
  
  //   // Create a new product document with the received data
  //   const newProduct = new ProductModel({
  //     name,
  //     price,
  //     stock,
  //     description,
  //     v_name,   // Vendor's name
  //     vendorId  // Store vendorId in the product
  //   });
  
  //   try {
  //     // Save the product to the database
  //     await newProduct.save();
  
  //     // Return success response with the saved product
  //     res.status(201).json({
  //       success: true,
  //       message: 'Product added successfully!',
  //       product: newProduct
  //     });
  //   } catch (err) {
  //     console.error('Error adding product:', err);
  
  //     // Return an error response
  //     res.status(500).json({
  //       success: false,
  //       message: 'Error adding product, please try again later.',
  //       error: err.message
  //     });
  //   }
  // });
  
  
  // Route to fetch all products vendors view
  // Assuming you're using Express.js
  // view products by vendor page
  // app.get('/viewproducts', async (req, res) => {
  //   try {
  //     const products = await ProductModel.find().populate('vendorId', 'v_name'); // Populate vendor name
  //     console.log('Fetched products:', products); // Check what is being fetched
  //     res.status(200).json({ products });
  //   } catch (err) {
  //     console.error('Error fetching products:', err);
  //     res.status(500).json({ message: 'Error fetching products' });
  //   }
  // });
  
 // GET /viewproducts?vendorId=yourVendorId

 app.get('/viewproducts', async (req, res) => {
  const { vendorId } = req.query; // Get vendorId from query parameters

  try {
      if (!vendorId) {
          return res.status(400).json({ message: 'Vendor ID is required' });
      }

      // Fetch products for the specific vendor
      const products = await ProductModel.find({ vendorId }).populate('vendorId', 'v_name'); // Populate vendor name

      if (products.length === 0) {
          return res.status(404).json({ message: 'No products found for this vendor' });
      }

      console.log('Fetched products:', products); // Check what is being fetched
      res.status(200).json({ success: true, products });
  } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ message: 'Error fetching products' });
  }
});


// Delete Product Route
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Error deleting product' });
  }
});
//edit 
// app.put('/products/:id', async (req, res) => {
//   const { name, price, stock, description } = req.body; // Extract data from the request body

//   try {
//     // Find the existing product by ID
//     const product = await ProductModel.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Update the product fields
//     product.name = name || product.name; // Only update if new value is provided
//     product.price = price || product.price;
//     product.description = description || product.description;

//     // Add new stock to the existing stock
//     if (stock !== undefined) {
//       product.stock += parseInt(stock, 10); // Make sure to convert stock to an integer
//     }

//     // Save the updated product
//     await product.save();

//     res.status(200).json({ message: 'Product updated successfully', product });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// Update your edit route to handle file uploads
app.put('/products/:id', upload.single('image'), async (req, res) => {
  const { name, price, stock, description } = req.body; // Extract data from the request body

  try {
    // Find the existing product by ID
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product fields
    product.name = name || product.name; // Only update if new value is provided
    product.price = price || product.price;
    product.description = description || product.description;

    // Add new stock to the existing stock
    if (stock !== undefined) {
      const newStock = parseInt(stock, 10);
      product.stock += isNaN(newStock) ? 0 : newStock; // Ensure stock is valid before adding
    }

    // Handle image update
    if (req.file) {
      product.image = req.file.path; // Update the image path
    }

    // Save the updated product
    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

  
// Get all products
// app.get('/products', async (req, res) => {
//   try {
//       const products = await ProductModel.find().populate('vendorId', 'v_name');
//       if (products.length === 0) {
//           return res.status(404).json({ success: false, message: 'No products found' });
//       }
//       res.json({ success: true, products });
//   } catch (error) {
//       console.error('Error fetching products:', error);
//       res.status(500).json({ success: false, message: 'Server error' });
//   }
// });
app.get('/products', async (req, res) => {
  try {
    const products = await ProductModel.find().populate('vendorId', 'v_name');
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'No products found' });
    }

    res.json({
      success: true,
      products: products.map(product => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        image: product.image, // Ensure to include the image
        vendorName: product.vendorId ? product.vendorId.v_name : 'N/A' // Get vendor name
      }))
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Get product by ID
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
      const product = await ProductModel.findById(productId).populate('vendorId', 'v_name');
      if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.json({ success: true, product });
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Book a product

app.post('/book-product', async (req, res) => {
  const { productId, quantity, userId, bookingDate } = req.body;

  // Validate incoming data
  if (!productId || !quantity || !userId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  if (quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than zero' });
  }

  try {
      const product = await ProductModel.findById(productId).populate('vendorId');
      if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Check if enough stock is available
      if (product.stock < quantity) {
          return res.status(400).json({ success: false, message: 'Not enough stock available' });
      }

      // Reduce the stock
      product.stock -= quantity;
      await product.save();

      // Create a new booking
      const newBooking = new BookingModel({
          user: userId,
          product: productId,
          vendor: product.vendorId, // Use the vendorId from the product
          quantity,
          bookingDate: bookingDate ? new Date(bookingDate) : new Date() // Default to now if bookingDate is not provided
      });
      await newBooking.save(); // Save the new booking to the database

      return res.json({ success: true, message: 'Product booked successfully', updatedProduct: product });
  } catch (error) {
      console.error('Error booking product:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
  }
});



// Return request route
app.post('/submit-return', async (req, res) => {
  const { bookingId, returnReason, userId } = req.body;

  try {
      const booking = await BookingModel.findById(bookingId).populate('product vendor');

      if (!booking) {
          return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      if (booking.status !== 'accepted') {
          return res.status(400).json({ success: false, message: 'Only accepted bookings can be returned' });
      }

      const newReturn = new returnmodel({
          product_id: booking.product,
          user_id: userId,
          return_reason: returnReason,
          vendor_id: booking.vendor,
      });

      await newReturn.save();
      booking.status = 'returned'; // Update the booking status
      await booking.save();

      res.status(201).json({ success: true, message: 'Return request submitted successfully' });
  } catch (error) {
      console.error('Error submitting return:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//return products view by vendors


app.get('/returns/:vendorId', async (req, res) => {
  const { vendorId } = req.params;

  console.log(`Fetching returns for vendorId: ${vendorId}`);
  try {
      const returns = await returnmodel.find({ vendor_id: vendorId }) // Ensure you filter by vendorId
          .populate('product_id', 'name') // Populate product name
          .populate('user_id', 'name phno')
        // Populate user name and phone
          .exec();

      if (!returns || returns.length === 0) {
          return res.status(404).json({ success: false, message: 'No returns found' });
      }

      res.json(returns);
  } catch (error) {
      console.error('Error fetching returns:', error);
      res.status(500).json({ success: false, message: 'Error fetching returns' });
  }
});



// Search booked products for an user


app.get('/api/bookings/search', async (req, res) => {
  const { userId, name } = req.query;

  console.log('Received userId:', userId);
  console.log('Received name:', name);

  try {
      const bookings = await BookingModel.find({ user: userId })
          .populate({
              path: 'product',
              match: { name: { $regex: name, $options: 'i' } }
          })
          .populate({
              path: 'vendor',
              select: 'v_name' // Specify the fields to include (v_name in this case)
          });

      const filteredBookings = bookings.filter(booking => booking.product);

      // Prepare the response with the vendor name included
      const response = filteredBookings.map(booking => ({
          _id: booking._id,
          product: booking.product,
          quantity: booking.quantity,
          bookingDate: booking.bookingDate,
          vendorName: booking.vendor ? booking.vendor.v_name : 'N/A' // Add vendor name
      }));

      console.log('Filtered bookings:', response);
      res.status(200).json(response);
  } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).send('Server Error');
  }
});





// POST route to handle resale form submissions
app.post('/submit-resale', async (req, res) => {
  const { bookingId, userId, deadChicksCount, totalWeight, pickupDate } = req.body;

  try {
      // Find the booking by its ID and populate the related product and vendor details
      const booking = await BookingModel.findById(bookingId).populate('product vendor');

      if (!booking) {
          return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      // Save resale details
      const resale = new ResaleModel({
          user: userId,
          product: booking.product._id,
          vendor: booking.vendor._id,
          deadChicksCount,
          totalWeight,
          pickupDate
      });

      await resale.save();
      // booking.status = 'resold'; // Update booking status
      await booking.save();

      res.status(201).json({ success: true, message: 'Resale request submitted successfully' });
  } catch (error) {
      console.error('Error submitting resale:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Get resale requests for a specific vendor
app.get('/api/resales/vendor/:vendorId', async (req, res) => {
  const { vendorId } = req.params;

  try {
      const resales = await ResaleModel.find({ vendor: vendorId })
          .populate('user', 'name address phno') // Include name, address, and phone
          .populate('product', 'name'); // Populate product details

      res.status(200).json(resales);
  } catch (error) {
      console.error('Error fetching resales:', error);
      res.status(500).json({ message: 'Failed to fetch resale requests' });
  }

});


// app.get('/api/bookings/search', authenticateUser, async (req, res) => {
//   const { name } = req.query; // Get the product name from query parameters
//   const userId = req.user._id; // User ID from the authenticated user

//   try {
//       // Fetch bookings made by the current user and match the product name
//       const bookings = await BookingModel.find({ user: userId })
//           .populate({
//               path: 'product',
//               match: { name: { $regex: name, $options: 'i' } }, // Match product name case-insensitively
//               select: 'name', // Only return product name
//           })
//           .populate('vendor', 'v_name'); // Populate the vendor's name

//       // Filter out bookings that do not have matching products
//       const filteredBookings = bookings.filter(booking => booking.product !== null);

//       if (filteredBookings.length > 0) {
//           res.json(filteredBookings); // Send filtered bookings to the client
//       } else {
//           res.status(404).json({ message: 'No bookings found for this product' });
//       }
//   } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });




//   const { userId, productId, vendorId, quantity } = req.body; // Ensure correct data is sent from the client

//   try {
//       const newBooking = new BookingModel({
//           user: userId, // Correct user ID
//           product: productId,
//           vendor: vendorId,
//           quantity,
//           bookingDate: new Date() // Set booking date to now
//       });

//       await newBooking.save(); // Save booking
//       res.status(201).json({ success: true, booking: newBooking });
//   } catch (error) {
//       console.error('Error creating booking:', error);
//       res.status(500).json({ success: false, message: 'Error creating booking' });
//   }
// });

// Get booked products for a specific vendor
// app.get('/vendor/:vendorId/bookings', async (req, res) => {
//   try {
//       const bookings = await BookingModel.find({ vendor: req.params.vendorId })
//           .populate('product', 'name') // Populate product name
//           .populate('Users', 'name address phno'); // Only get user name, address, and phone number

//       res.json({ status: 'success', bookings });
//   } catch (error) {
//       res.status(500).json({ status: 'error', message: error.message });
//   }
// });
  


// Backend route to fetch user-specific bookings

// Route to fetch user bookings
// Route to fetch user bookings



// Example of a protected route to view bookings
// GET route to view user bookings
// Use booking routes
app.use('/', bookingRoutes);
app.listen(3030,()=>{
    console.log("server started")
})

