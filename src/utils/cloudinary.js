import { v2 as cloudinary } from 'cloudinary';
import {unlinkSync} from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const uploadOnCloudinary = async (localpath) => {

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    
    if(!localpath){
        return null
    }

    const options = {
        public_id: 'displayPicture',
        transformation: { width: 100, height: 150, crop: "fill" }
    };

    try {
        const uploadResult = await cloudinary.uploader.upload(localpath, options);
        const uploadURL = cloudinary.url(uploadResult.public_id, {
            width: 100, 
            height: 150, 
            crop: "fill", 
            fetch_format: "auto"
        });
        unlinkSync(localpath)
        return uploadURL;
    } catch (error) {
        unlinkSync(localpath)
        console.error(error);
        return null
    }
}

export {uploadOnCloudinary}