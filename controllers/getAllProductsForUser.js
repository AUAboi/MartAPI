
import  asyncHandler  from 'express-async-handler';
import Product from '../models/productModel.js';



export const getAllProductsForUser=asyncHandler(async(req,res)=>{
    const products = await Product.find({})

    if(!products){
        res.status(404)
        throw new Error("No product found")
    }

    res.status(200).json(products)
})