
import  asyncHandler from 'express-async-handler';
import ContactUs from '../models/contactUsModel.js';
import SellerReport from '../models/reportSellerModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';



export const contactUs=asyncHandler(async(req,res)=>{
    const {name,email,subject,message}=req.body
    console.log(name)
    console.log(email)
    console.log(subject)
    console.log(message)
    if(!name || !email || !subject || !message ){
        res.status(400)
        throw new Error("Please fill all the fields")
    }
    const userId = req.user._id
    const image = req.user.photo
    const savedMessage = await ContactUs.create({name,email,image,subject,message,userId})


    if(savedMessage){
        res.status(201).json({message:"Your message have been sent to our team"})
    }else{
        res.status(500)
        throw new Error("Internal server, please try again")
    }

})
export const getMessages=asyncHandler(async(req,res)=>{
    const messages = await ContactUs.find({})

if(!messages){
    res.status(404)
    throw new Error("No message in inbox")
}

res.status(200).json(messages)
})


export const deleteMessage=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const message = await ContactUs.findById(id)

if(message){
    await message.deleteOne()
    res.status(200).json({message:"Message deleted success"})
}else{
res.status(404)
throw new Error("Cannot found the message with this id")
}

})




export const sellerReport=asyncHandler(async(req,res)=>{
    const {vendorId,name,email,subject,message}=req.body

    if(!vendorId || !name || !email || !subject || !message ){
        res.status(400)
        throw new Error("Please fill all the fields")
    }

    const vendor = await User.findOne({_id:vendorId})

    if(!vendor){
        res.status(404)
        throw new Error("No vendor found with this id")
    }
    const userId = req.user._id
    const vendorName = vendor.name
    const photo = req.user.photo


    const report = await SellerReport.findOne({userId:userId,
        vendorId:vendorId
    })
    if(report){
res.status(400)
throw new Error("Report already submitted")
    }

    const savedMessage = await SellerReport.create({userId,vendorId,name,email,subject,message,vendorName,photo})


    if(savedMessage){
        res.status(201).json({message:"Your report have been sent to our team,we will contact you soon"})
    }else{
        res.status(500)
        throw new Error("Internal server, please try again")
    }

})



export const reports=asyncHandler(async(req,res)=>{
const reports = await SellerReport.find({})

if(!reports){
    res.status(404)
    throw new Error("No reports found for the sellers")
}

res.status(200).json(reports)

})
export const reportReviewed=asyncHandler(async(req,res)=>{
    const {isReviewed}=req.body
    const {id}=req.params

    const report = await SellerReport.findById({_id:id})
    if(!report){
        res.status(404)
        throw new Error("No report found to mark as reviwed")
    }
    report.isReviewed=isReviewed
    const updatedReport = await report.save()
    console.log(updatedReport)
    if(updatedReport){
res.status(200).json({message:`Report status for "${report.vendorName}" changed`})
    }
    else{
        res.status(500)
        throw new Error("Server error, please try again")
    }
})