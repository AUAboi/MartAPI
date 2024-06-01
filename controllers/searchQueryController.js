import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

export const query = asyncHandler(async (req, res) => {
  const { text } = req.params;
const search = text.toLowerCase()
  if (!text) {
    res.status(400);
    throw new Error("Enter your query to search");
  }

  const result = await Product.find({});
  if (!result) {
    res.status(404);
    throw new Error("No item to search for");
  }
  if (result) {
    const queryResult = await result.filter((item) => {
      return (
        item.productName.toLowerCase().includes(search) ||
        item.storeName.toLowerCase().includes(search) ||
        item.productDescription.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search) ||
        item.subCategory.toLowerCase().includes(search)

      );
    });
    res.status(200).json(queryResult);
  } else {
    res.status(500);
    throw new Error("something went wrong, please try again");
  }
});





export const mayYouLike = asyncHandler(async(req,res)=>{
  
})