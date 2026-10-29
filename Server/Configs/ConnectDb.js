import mongoose from 'mongoose'

const connectctDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(" Database  connected")
    } catch(error){
        console.log("  Database error",error)
    }
}

export default connectctDB