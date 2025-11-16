

import mongoose from "mongoose"



const connectToDatabase = async ()=>{
    try{
            await mongoose.connect(process.env.MONGO_URL!)
            console.log(`Database connected successfully`)
    }catch(error){
        console.error(`Error from connect database :${error}`)
    }
}


export default connectToDatabase