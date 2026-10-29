import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import connectctDB from './Configs/ConnectDb.js';
import authRouter from './Routes/auth.route.js';
import cookieParser from 'cookie-parser';
import userRouter from './Routes/user.route.js';
import assistantRouter from './Routes/assistant.route.js';
import billingRouter from "./Routes/billing.route.js";



dotenv.config();
const app = express()
//db coonection
connectctDB()

const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use(cookieParser())

// app.use(cors({
//    origin: "http://localhost:5173",
//    credentials: true
// }))

const privateCors = cors({
   origin:["http://localhost:5173"], credentials:true

});

const publicCors = cors({
   origin:"*",
});



app.get("/", (req, res) => {
   res.json('hellow js')
})

app.use("/api/auth",privateCors, authRouter)

app.use("/api/user",privateCors ,userRouter)

app.use("/api/assistant",publicCors,assistantRouter)

app.use("/api/billing", privateCors, billingRouter)

app.listen(PORT, () => {
   console.log(`server is starting  port ${PORT}`)
})