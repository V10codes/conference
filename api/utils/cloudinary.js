import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return "local File Path not found";
    //upload on cloudinary
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      type: "upload",
    });
    //file has been uploaded successfully
    // console.log("file is uploaded on cloudinary", res.url);
    fs.unlinkSync(localFilePath);
    return res.url;
  } catch (err) {
    //remove the locally saved temporary file as the upload configuration failed
    fs.unlinkSync(localFilePath);
    console.log(err);
    return null;
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
