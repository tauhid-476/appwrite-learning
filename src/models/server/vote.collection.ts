import { IndexType, Permission } from "node-appwrite";

import { db, voteCollection } from "../name";
import { databases } from "./config";

export default async function createvoteCollection() {

  console.log("creating vote collection");
  await databases.createCollection(db, voteCollection,voteCollection,[
    Permission.read("any"),
    Permission.read("users"),
    Permission.write("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ])

   console.log("vote Collection created successfully");

  // votes --> maaybe on questions / answers , so enums is used
  // votedBy 
  // voteStatus  --> enums
   await Promise.all([
    databases.createEnumAttribute(db, voteCollection, "type", ["question", "answer"], true),
   databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
   databases.createStringAttribute(db, voteCollection, "typeId", 50,  true),
   databases.createEnumAttribute( db, voteCollection, "voteStatus", ["upvoted", "downvoted"], true)
   ])
  
   console.log("vote attribue created successfully");

   
}