//import all methods an db
// run all methods
import { db } from "../name";
import { databases } from "./config";
import createanswerCollection from "./answer.collection";
import createcommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createvoteCollection from "./vote.collection";


export default async function getOrCreateDatabase(){
  try {
     await databases.get(db);
     console.log("database connection to appwrite");
     
  } catch{
    try {
      await databases.create(db,db)
      console.log("database createed");
      

      await Promise.all([
        createQuestionCollection(),
        createanswerCollection(),
        createcommentCollection(),
        createvoteCollection()
      ])
    
      console.log("Collections created successfully");
      console.log("database connection to appwrite");
      
    } catch (error:unknown) {
      const err = error as Error;
      console.log("Error creating database", err.message);
    }    
  }

  return databases
}