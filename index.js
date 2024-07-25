import { connectToServer, connectToMongoDB } from "./connection.js";

connectToMongoDB().then(() => 
    connectToServer()
).catch(error => {
    console.log(error);
    process.exit(1)
})