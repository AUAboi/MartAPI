
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';



export const getCategorynSubCategory = asyncHandler(async(req,res)=>{
const {category,subCategory}=req.params
const c = category.toLowerCase()
const sc = subCategory.toLowerCase()
console.log("category is "+c +" &"+" subcategory is "+sc)
const products = await Product.find({ category:c, subCategory:sc });

if(products.length===0 || !products){
    res.status(404)
    throw new Error(`No product found with ${category} & ${subCategory}`)
}
res.status(200).json(products)

})
export const getCategory = asyncHandler(async(req,res)=>{
const {category}=req.params
const c = category.toLowerCase()
console.log("category is "+c)
const products = await Product.find({ category :c});

if(products.length===0 || !products){
    res.status(404)
    throw new Error(`No product found with ${category}`)
}
res.status(200).json(products)

})