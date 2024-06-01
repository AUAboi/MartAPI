
import  asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';


export const get50Discount=asyncHandler(async(req,res)=>{
    const products = await Product.find({
        $expr: {
            $lte: ["$discount", { $multiply: ["$price", 0.5] }]
        }
      });
if(products.length===0 || !products){
    res.status(404)
    throw new Error("No item found with 50% discount")
}
res.status(200).json(products)

})
export const get30Discount=asyncHandler(async(req,res)=>{
    const products = await Product.find({
        $expr: {
            $lte: ["$discount", { $multiply: ["$price", 0.3] }]
        }
      });
if(products.length===0 || !products){
    res.status(404)
    throw new Error("No item found with 50% discount")
}
res.status(200).json(products)

})
