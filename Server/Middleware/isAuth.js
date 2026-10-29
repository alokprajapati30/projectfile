
import jwt from "jsonwebtoken"


export const isAuth =async (req, res, next)=>{
    try{
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({message: "user does not exist"})
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)  
        if(!verifyToken){
            return res.status(401).json({message: "user does not exist"})
        }
        req.userId = verifyToken.userId
        next()
    }catch(error){
        return res.status(401).json({message: "isAuth error."})

    }
}