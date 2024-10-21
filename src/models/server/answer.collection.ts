import { IndexType, Permission } from "node-appwrite";

import { db, answerCollection } from "../name";
import { databases } from "./config";

export default async function createanswerCollection() {

  await databases.createCollection(db, answerCollection,answerCollection,[
    Permission.read("any"),
    Permission.read("users"),
    Permission.write("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ])

   console.log("answer Collection created successfully");


   //attributes--> answer , answeredBy , questionId

   await Promise.all([
    databases.createStringAttribute(db, answerCollection, "content", 10000,  true),
    databases.createStringAttribute(db, answerCollection, "authorId", 50,  true),
    databases.createStringAttribute(db, answerCollection, "questionId", 50,  false),
   ])
   
   console.log("answr attribute created successfully");

}