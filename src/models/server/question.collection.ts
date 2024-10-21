import { IndexType, Permission } from "node-appwrite";

import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  //1 First collection
  //2 Second Attributes and indexes

  //db , qnCollecttion , name of the collection , permissison(optional) , 
  await databases.createCollection(db, questionCollection,questionCollection,[
    Permission.read("any"),
    Permission.read("users"),
    Permission.write("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ])

   console.log("Qn Collection created successfully");


   //use promise to create attributes
   //db , collectionname , attribute name, size, required
   // qn --> authorId, title, content , imageId (optional) , tags (like #react, #nextjs)

   await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 100,  true),
    databases.createStringAttribute(db, questionCollection, "content", 10000,  true),
    databases.createStringAttribute(db, questionCollection, "authorId", 50,  true),
    databases.createStringAttribute(db, questionCollection, "tags", 50,  true, undefined, true),
                                                                               ///initially,isArray
    databases.createStringAttribute(db, questionCollection, "attachmentId", 50,  false),
   ])

   //indexes --> manually better
   // include those fields in which u want to apply search feature 

   await Promise.all([
    databases.createIndex(db, questionCollection, "title",IndexType.Fulltext, ["title"],["asc"]),
    databases.createIndex(db, questionCollection, "content",IndexType.Fulltext, ["content"],["asc"]),
   ])
   
}