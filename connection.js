import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'
import { connect } from 'mongoose'

const port = process.env.PORT || 8000
const uri = process.env.MONGODB_URI
const connectToServer = () => {
    try{
        app.listen(port, () => {
            console.log(`Application started on Port ${port}`)
        })
    } catch(error){
        console.log(`Server Connection Failed`);
        throw error
    }
}

const connectToMongoDB = async () => {
    try{
        const dbConnect = await connect(uri)
        console.log(`Database Connected: ${dbConnect.connection.host}`);
    } catch (error){
        console.log(`MongoDB Connection Failed`);
        process.exit(1)
    }
}

export {connectToServer, connectToMongoDB}