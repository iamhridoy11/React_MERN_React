import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://iamhridoy:01677121384@cluster0.cn57pmi.mongodb.net/FoodDelivery?').then(()=>console.log("DB connected"))
}