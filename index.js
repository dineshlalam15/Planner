import { connectToServer, connectToMongoDB } from "./src/utils/connection.js";

connectToMongoDB().then(() => 
    connectToServer()
).catch(error => {
    console.log(error);
    process.exit(1)
})