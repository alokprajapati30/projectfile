import { razorpay } from "../Configs/razorpay.js"
import Billing from "../Models/billing.model.js"
import crypto from "crypto"
import User from "../Models/user.model.js"

export const createOrder = async (req, res) => {
    try {
        const { plan } = req.body
        const userId = req.userId

        if (plan !== "pro") {
            return res.status(400).json({
                success: false,
                message: "Invalid billing plan",
            })
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(503).json({
                success: false,
                message: "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the server.",
            })
        }

        const amount = 699
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        await Billing.create({
            userId,
            amount,
            plan,
            orderId: order.id

        })

        return res.json({
            success: true,
            order,
            keyId: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.error("Razorpay order creation failed:", error);

        return res.status(502).json({
            success: false,
            message: "Razorpay could not create the order. Check the server credentials and try again.",
        });
    }
}


export const verifyBilling = async (req, res) => {
    try {
        const { razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature } = req.body

        const userId = req.userId

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(503).json({
                success: false,
                message: "Razorpay is not configured. Set RAZORPAY_KEY_SECRET on the server.",
            })
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification data is incomplete",
            });
        }

        const sign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex")
        const expected = Buffer.from(sign, "hex")
        const received = Buffer.from(razorpay_signature, "hex")

        if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            })
        }

        const billing = await Billing.findOne({
            orderId: razorpay_order_id,
            userId,
        })

        if (!billing) {
            return res.status(404).json({
                success: false,
                message: "Billing order was not found",
            })
        }

        await Billing.findByIdAndUpdate(billing._id, {
            paymentId: razorpay_payment_id,
            status: "paid"
        })

        const user = await User.findByIdAndUpdate(userId, {
            plan: "pro",

            proExpiresAt:
                new Date(
                    Date.now() +
                    90 * 24 * 60 * 60 * 1000
                ),
        }, { new: true })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User was not found",
            })
        }

        return res.json({
            success: true,
            user
        })
    } catch (error) {

        console.error("Razorpay payment verification failed:", error);

        return res.status(500).json({
            success: false,
            message:
                "Payment verification failed",
        });

    }
}