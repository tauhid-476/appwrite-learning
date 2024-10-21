import { Permission } from "appwrite";
import { storage } from "./config";
import { questionAttachmentBucket } from "../name";
import { Error } from "@/types/Error";


export default async function getOrCreateBucketStorage(){
  try {
    await storage.getBucket(questionAttachmentBucket);
    console.log("Storage connected to appwrite");
  } catch (error) {
    try {
      await storage.createBucket(
        questionAttachmentBucket,
        questionAttachmentBucket,
        [
          Permission.create("users"),
          Permission.read("any"),
          Permission.read("users"),
          Permission.update("users"),
          Permission.delete("users"),
        ],
        false,//file security
        undefined,//initially
        undefined,
        ["jpg","png","jpeg","gif","webp","heic"]
      )
      
    } catch (error:unknown) {
      const err = error as Error;
      console.log("Error creating database", err.message);
    }   
  }
}