
import  asyncHandler  from 'express-async-handler';
import Product from '../models/productModel.js';



export const ratingThreePlus=asyncHandler(async(req,res)=>{
    let products = await Product.find({rating: {
        $elemMatch: { rating: { $gt: 1 } }
      }})

      if(products.length===0 || !products){
        res.status(404)
        throw new Error("No product found with rating 3+")
      }
  
      if(products.length>5){
        products=products.slice(-5, products.length)
      }
      res.status(200).json(products)

})