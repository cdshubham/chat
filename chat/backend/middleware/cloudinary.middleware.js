import { v2 as cloudinary } from "cloudinary";

async function uploadOnCloudinary(image) {
  cloudinary.config({
    cloud_name: "dlwtkp728",
    api_key: "433358234734668",
    api_secret: "7j9G8lKD0imhfvuhGlCXIs6ZggA",
  });
  try {
    const uploadResult = await cloudinary.uploader.upload(image);
    return uploadResult;
  } catch (error) {
    console.log("Error in Cloudinary", error);
    return "error";
  }
}

export { uploadOnCloudinary };
