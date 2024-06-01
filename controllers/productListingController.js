import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

export const productListing = asyncHandler(async (req, res) => {
  const {
    productName,
    category,
    subCategory,
    price,
    discount, //optional
    size, //otional
    productDescription,
    review, //otional
    rating, //otional
    totalStock,
  } = req.body.data;
const {imageUrl}=req.body

console.log(productName,imageUrl)
  // image save after it is save to some where in cloud
  // vendorId
  if (
    !productName ||
    !category ||
    !subCategory ||
    !price ||
    !productDescription ||
    !totalStock ||
    !imageUrl
  ) {
    res.status(400);
    throw new Error("Please fill all the fields with *");
  }

  const vendorId = req.user._id;
  const storeName = req.user.name;

  const product = await Product.create({
    productName,
    category:category.toLowerCase(),
    subCategory:subCategory.toLowerCase(),
    price,
    discount,
    size: size,
    totalStock,
    productDescription,
    image: imageUrl,
    review,
    rating,
    vendorId,
    storeName,
  });

  if (product) {
    res.status(201).json({
      message: "Your product has been added to list and is published now",
    });
  } else {
    res.status(500);
    throw new Error("Server error, try it once more");
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { id } = req.params;

  const product = await Product.findById(id);

  if (product) {
    const {
      productName,
      category, //not updating this
      subCategory, //not updating this
      price,
      discount,
      size, //otional
      productDescription,
      image,
      review, //otional we will update this on review page while getting the review from users
      rating, //otional we will update this on review page while getting the review from users
      totalStock,
    } = product;
console.log(size)
    // const sizeArray = size.length>1 && size.split(",");
// const sizeArrayReq=req.body.size.length>1 && req.body.size.split(",")
    product.productName = req.body.data.productName || productName;
    // product.category = req.body.category || category;
    // product.subCategory = req.body.subCategory || subCategory;
    product.price = req.body.data.price || price;
    product.discount = req.body.data.discount || discount;
    product.size = req.body.data.size || size;
    product.productDescription =
      req.body.data.productDescription || productDescription;
    product.totalStock = req.body.data.totalStock || totalStock;
    product.image = req.body.imageUrl || image;

    const updateProduct = await product.save();
    const updatedProduct = [
      {
        _id: updateProduct._id,
        productName: updateProduct.productName,
        price: updateProduct.price,
        discount: updateProduct.discount,
        size: updateProduct.size,
        productDescription: updateProduct.productDescription,
        totalStock: updateProduct.totalStock,
        category: category, //not updating this
        subCategory: subCategory,
        message: "Your listing has been updated",
      },
    ];
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("No product found with these details");
  }
});

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ vendorId: req.user._id });
  res.status(200).json(products);
});

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.find({ _id: id });
  res.status(200).json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(400);
    throw new Error("No product found");
  }
  if (product) {
    await product.deleteOne();
  }
  res.status(200).json({
    message: "Product has been deleted",
  });
});

export const insertReview = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;
  const { id } = req.params;
console.log(req.body)
  const item = await Product.findById(id);

  if (!item) {
    res.status(404);
    throw new Error("Cannot find the product for review");
  }

const exists = item.rating.some(item => item.userId.equals(req.user._id));

if (exists) {
  res.status(400)
  throw new Error("Already subbmitted a review")
}
  await item.rating.push({
    userId: req.user._id,
    rating:rating,
    review: review,
    userName:req.user.name,
    img:req.user.photo
  });
  const updatedItem = await item.save()

if(updatedItem){
  res.status(201).json({message:"Thank you for your review, it will reflect to website soon"})
}else{
  res.status(500)
  throw new Error("Internal server err, please submit again")
}
});


export const  deleteReview=asyncHandler(async(req,res)=>{
  const {id}= req.params
  const result = await Product.updateOne(
    { _id: id },
    { $pull: { rating: { userId: req.user._id } } }
  );

  if (result.nModified === 0) {
    res.status(404)
    throw new Error("No rating found for your product")
  } else {
    res.status(200).json({message:"Review deleted, it will remove from website soon"})
  }
})
