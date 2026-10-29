import { genToken } from "../Configs/token.js"
import User from "../Models/user.model.js"

const getAuthCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production"
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    }
}

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
            ...getAuthCookieOptions(),
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return res.status(200).json(user)

    } catch (error) {
        console.error("Google auth failed:", error)
        return res.status(500).json({ message: "Google authentication failed" })
    }
}


export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", getAuthCookieOptions())
        return res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        console.error("Logout failed:", error)
        return res.status(500).json({ message: "Logout failed" })
    }
}