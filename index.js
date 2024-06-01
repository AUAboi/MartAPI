// "test": "echo \"Error: no test specified\" && exit 1"
// "start": "node backend/index.js"
import { } from "dotenv/config";
import { Server } from "socket.io";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js"; //add js at the end of path if using es6
import errorHandler from "./middleware/errorMiddleware.js"; //use at the end of the api's
import productRoute from "./routes/productRoute.js";
import contact from "./routes/contactUsRoute.js";
import searchQuery from "./routes/searchQueryRoute.js";
import cart from "./routes/cartRoute.js";
import getAllProducts from "./routes/getProductsForUser.js";
import order from "./routes/orderRoute.js";
import rating3 from "./routes/rating3plus.js";
import discount from "./routes/discountRoute.js";
const app = express();

import http from "http";
import category from "./routes/categoryFinding.js";
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ["https://eazymart-five.vercel.app","http://localhost:3000"],
//     path: ["GET", "POST", "PATCH", "DELETE"],
//   },
// });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  //avoid any conflict when make req from frontend to backend
  // "http://localhost:3000", 
  cors({
    origin: [process.env.FRONTEND_URL,
      "http://localhost:3000"],
    path: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Routes for user authentication
app.use("/api/users", userRoute); //it will hit /api/users/:nextRoute

// Routes for product listing
app.use("/api/vendor", productRoute); //it will hit /api/vendor/:nextRoute

// Routes for contact us
app.use("/api", contact); //it will hit /api/:nextRoute

// Routes for search query
app.use("/api", searchQuery); //it will hit /api/:nextRoute

// Routes for cart
app.use("/api/user", cart); //it will hit /api/user/:nextRoute

// Routes for get all products
app.use("/api/user", getAllProducts); //it will hit /api/user/:nextRoute

// Routes for order
app.use("/api/user/order", order); //it will hit /api/user/order/:nextRoute

// Routes for rating 3+
app.use("/api", rating3); //it will hit /api/:nextRoute

// Routes for 50% & 30% discount
app.use("/api", discount); //it will hit /api/:nextRoute

// Routes finding the category
app.use("/api", category); //it will hit /api/:nextRoute

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Running the app" })
});

// const users = [];
// io.on("connection", (socket) => {
// try {
//     // console.log(`user is connected with id: ${socket.id}`);

//   // Handle user registration
//   socket.on('register', (userId) => {
//     users[userId] = {sockerId:socket.id,busy:null};
//     // socket.userId = userId; // save username on the socket object
//     // console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
//     // console.log("object",users)
// });
//   // Handle private messages
//   socket.on('sendMessage', async({ myId,userId, message ,role}) => {

// const sender = myId
// const receiver = userId
// const msg = message
// if(role && role==="vendor"){
//   users[receiver].busy=receiver
//   let receiverObject = users[receiver];
//   if(receiverObject.busy===receiver){
//          io.to(users[receiver].sockerId).emit("messageReceive",{
//     sender,msg
//   }) 
//   }
// }else{
//   io.to(users[receiver].sockerId).emit("messageReceive",{
//     sender,msg
//   })
//   console.log("byuser")
// }
//     // // const 
//     // const recipientId = users[recipientUserId];
//     // console.log(recipientId)
//     // if (recipientId) {
//     //     io.to(recipientId).emit('private_message', {
//     //         message,
//     //         sender: socket.userId,
//     //     });
//     // } else {
//     //     socket.emit('error_message', 'Recipient not found');
//     // }
// }); socket.on('disconnect', () => {
//   // Remove the user from the users object
//   if (socket.username) {
//       delete users[socket.username];
//       console.log(`User disconnected: ${socket.username}`);
//   }
// });
// } catch (error) {
//   res.status(500).json({message:"Error sending message"})
// }
// });

// Error middleware
app.use(errorHandler);
// port number
const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Db is connected & App is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
