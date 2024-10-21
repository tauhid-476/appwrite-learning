//oon click increse vote
//on click again decrase vote
//take all the things in request u make in appwrite node sdk

import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { ID } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { UserPrefs } from "@/store/auth";
import { Query } from "appwrite";


// ALGORITHM //
/* 
***
If a vote exists:
a. Delete the existing vote
b. Update author's reputation:

Decrease by 1 if previous vote was upvote
Increase by 1 if previous vote was downvote

***
If no vote exists or vote status has changed:
a. Create a new vote document
b. Update author's reputation:

For existing vote with changed status:

Decrease by 1 if changing from upvote to downvote
Increase by 1 if changing from downvote to upvote


For new vote:

Increase by 1 for upvote
Decrease by 1 for downvote

*/


//Please see at the bottom of the code to see a sample response 
export async function POST(req: NextRequest) {
  try {
    //get the data , list the docs
    const { votedById, voteStatus, type, typeId } = await req.json();
    //type --> question or answer
    //query.equal(attribute, value)
    const response = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("votedById", votedById),
      Query.equal("typeId", typeId),
    ]);

    console.log("response is",response);

    //***//
    //if vote exist
    
    if (response.documents.length > 0) {
      console.log("user has already voted the post");
      await databases.deleteDocument(
        db,
        voteCollection,
        response.documents[0].$id
      );
      const questionOrAnswerCollection = await databases.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );
      const authorPrefs = await users.getPrefs<UserPrefs>(
        questionOrAnswerCollection.authorId
      );

      await users.updatePrefs<UserPrefs>(questionOrAnswerCollection.authorId, {
        reputation:
          response.documents[0].voteStatus === "upvoted"
            ? Number(authorPrefs.reputation) - 1
            : Number(authorPrefs.reputation) + 1,
      });
    }

    //***//
    //if vote doesnt exist or the vote status is changed
    if (response.documents[0]?.voteStatus !== voteStatus) {
      const doc = await databases.createDocument(
        db,
        voteCollection,
        ID.unique(),
        {
          type,
          typeId,
          votedById,
          voteStatus,
        }
      );
      //reputation incr or decr
      const questionOrAnswerCollection = await databases.getDocument(
        db,
        type === "question" ? questionCollection : answerCollection,
        typeId
      );
      const authorPrefs = await users.getPrefs<UserPrefs>(
        questionOrAnswerCollection.authorId
      );


      //For existing vote with changed status:
      if (response.documents[0]) {
        await users.updatePrefs<UserPrefs>(
          questionOrAnswerCollection.authorId,
          {
            reputation:
              response.documents[0].voteStatus === "upvoted"
                ? Number(authorPrefs.reputation) - 1
                : Number(authorPrefs.reputation) + 1,
          }
        );
      } else { 
        //For new vote
        await users.updatePrefs<UserPrefs>(
          questionOrAnswerCollection.authorId,
          {
            reputation:
              voteStatus === "upvoted"
                ? Number(authorPrefs.reputation) + 1
                : Number(authorPrefs.reputation) - 1,
          }
        );
      }

      const [upvotes, downvotes] = await Promise.all([
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("voteStatus", "upvoted"),
          Query.equal("votedById", votedById),
          Query.limit(1), // for optimization as we only need total
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("voteStatus", "downvoted"),
          Query.equal("votedById", votedById),
          Query.limit(1), // for optimization as we only need total
        ]),
      ]);

      return NextResponse.json(
        {
          data: { document: doc, voteResult: upvotes.total - downvotes.total },
          message: response.documents[0] ? "Vote Status Updated" : "Voted",
        },
        {
          status: 201,
        }
      );
    }

    //***************************//
    //counts upvotes and downvotes have to be returned
    const [upvotes, downvotes] = await Promise.all([
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("votedById", votedById),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
        Query.limit(1),
        //query should return a maximum of one document that matches the given query conditions.
      ]),
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("votedById", votedById),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
        Query.limit(1),
      ]),
    ]);
    //we are giving the voteTotal in response
    return NextResponse.json(
      {
        data: {
          document: null,
          voteResult: upvotes.total - downvotes.total,
          message: response.documents[0] ? "Vote updated" : "Vote created",
        },
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Something went wrong",
      },
      {
        status: error?.status || 500,
      }
    );
  }
}


/* 
for first time
{
    "data": {
        "document": {
            "type": "question",
            "typeId": "6707e0590004bae1a3bf",
            "votedById": "6707db32000749239b91",
            "voteStatus": "upvoted",
            "$id": "6707e0ea003a8f097022",
            "$permissions": [],
            "$createdAt": "2024-10-10T14:12:59.391+00:00",
            "$updatedAt": "2024-10-10T14:12:59.391+00:00",
            "$databaseId": "main-stackoverflow",
            "$collectionId": "votes"
        },
        "voteResult": 1
    },
    "message": "Voted"
}



for again
{
  total: 1,
  documents: [
    {
      votedById: '6707db32000749239b91',
      voteStatus: 'upvoted',
      type: 'question',
      typeId: '6707e1cd002d5d5476f6',
      '$id': '6707e27f00017b28f694',
      '$createdAt': '2024-10-10T14:19:43.458+00:00',
      '$updatedAt': '2024-10-10T14:19:43.458+00:00',
      '$permissions': [],
      '$databaseId': 'main-stackoverflow',
      '$collectionId': 'votes'
    }
  ]
}

*/