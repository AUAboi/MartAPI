import jwt from "jsonwebtoken"
import crypto  from 'crypto';



export const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRETS,{expiresIn:"1d"})
}

export const hashToken=(token)=>{
    return crypto.createHash("sha256").update(token.toString()).digest("hex")
}