import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { v4 as uuidv4 } from "uuid";
import Orders from "../models/ordersModel.js";

export const addToCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { selectedSize,quantity,name,price}=req.body
// console.log(selectedSize,"&",quantity)
if(!selectedSize){
  res.status(400);
  throw new Error("Please select the size fo item");
}
  const item = await Product.findById(id);
  if (!item) {
    res.status(404);
    throw new Error("There is no item listed you are trying to add");
  }

  const userId = req.user._id;

  const cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    const uuid = uuidv4();
    const cartItem = await Cart.create({
      userId: userId,
      cartItems: {
        id: uuid,
        value: id,
        image:item.image,
        price:item.price-item.discount,
        size:selectedSize,
        quantity:quantity,
        name:name,
      },
    });
    if (cartItem) {
      res.status(201).json({ message: "Your cart created & item has added" });
    } else {
      res.status(500);
      throw new Error("Internal server error, please try again");
    }
  }
  if (cart) {
    let alreadyAdd = false;
    cart.cartItems.forEach((element) => {
      if (element.value === id) {
        alreadyAdd = true;
      }
    });
    console.log(alreadyAdd);
    if (alreadyAdd) {
      res.status(400);
      throw new Error("Item is already added to cart");
    }
    const uuid = uuidv4();
    await cart.cartItems.push({ id: uuid,
      value: id,
      image:item.image,
      price:item.price-item.discount,
      size:selectedSize,
      quantity:quantity,
      name:name,});
    await cart.save();
    res.status(200).json({ message: "Added to cart" });
  }
});

export const getFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const itemsFromCart = await Cart.findOne({ userId: userId });
  if (!itemsFromCart) {
    res.status(404);
    throw new Error("No item in your cart");
  }
  if (itemsFromCart) {
    const arrayOfId = itemsFromCart.cartItems.sort();

    const products = await Product.find({}).sort();
    // await products.filter((item, i) => {
    //   if (arrayOfId.includes(item.id)) {
    //     data.push(item);
    //   }
    // });
    // let result = products.filter(o1 => arrayOfId.some(o2 => o1.id === o2.id));
    let resultArr=[]
    var result = products.filter((item) => {
      return arrayOfId.some((item2) => {
         if(item.id.includes(item2.value)){     // id in products is the value in array of id
          resultArr.push(item2.value)
          return item.id.includes(item2.value)
        } 
      });
    });


    let finalRes= itemsFromCart.cartItems.filter((item)=>{
      return resultArr.some((item2)=>{
        return item.value.includes(item2)
      })
    })

// console.log(finalRes)


    
    res.status(200).json(finalRes);
  } else {
    res.status(500);
    throw new Error("Internal server error");
  }
});


export const getCartItem= asyncHandler(async (req, res) => {
  const { id } = req.params;
console.log(id)
  const cart = await Cart.findOne({
      'cartItems.id': id
    
});
if(!cart){
  res.status(404)
  throw new Error("This item is no longer in your cart")
}
  const result = cart.cartItems.filter((item)=>{
    return item.id===id
  })

  // console.log(result)
  if (!result) {
    res.status(404);
    throw new Error("Not item found");
  }
  if (cart) {
    res.status(200).json(result)
  } else {
    res.status(400);
    throw new Error("Server err, please try again");
  }
});

export const deleteFromCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("id for deletion " +id)
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Not item found to delete");
  }
  if (cart) {
    // const i = await cart.cartItems;
    await Cart.updateOne({userId:req.user._id }, {$pull: {cartItems: {id: id}}})
    res.status(200).json({message:"Remove item from cart successfully"})
  } else {
    res.status(400);
    throw new Error("fail to delete item from cart");
  }
});



