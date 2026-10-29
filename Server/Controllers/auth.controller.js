import { genToken } from "../Configs/token.js"
import User from "../Models/user.model.js"


export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body
        if (!name || !email) {
            return res.status(400).json({ Message: "name or email are required" })
        }

        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({ name, email })
        }

        const token = await genToken(user._id)
            res.cookie("token", token, {
                httpOnly: true,
                secure:false,
                sameSite: "none", //"strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
 return res.status(200).json(user)

    } catch (error) { 
        return res.status(500).json({ Message: `Google auth failed ${error}`})
    }
}


export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure:false,
            sameSite: "strict"
        })
        return res.status(200).json({ Message: "LogOut Successful" })
    } catch (error) {
        return res.status(500).json({ Message: `LogOut Failed"${error}`})
    }
}