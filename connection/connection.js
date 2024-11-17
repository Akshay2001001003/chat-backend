import mongoose from "mongoose";

export const db=async()=>await mongoose.connect("mongodb+srv://ak:12@cluster0.1pq1x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then((r)=>console.log("connected"))