import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import {UserPrefs} from "@/store/auth"
import {Error} from "@/types/Error"
export async function POST(request: NextRequest){
  try {
    const {questionId, answer, authorId} = await request.json();

    const response = await databases.createDocument(db, answerCollection, ID.unique(), {
      content: answer,
      authorId: authorId,
      questionId: questionId
    })

    // Increase author reputation
    const prefs = await users.getPrefs<UserPrefs>(authorId)
    await users.updatePrefs(authorId, {
      reputation: Number(prefs.reputation) + 1
    })

    return NextResponse.json(response, {
      status: 201
    })

  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
        {
            error: err.message,
        },
        {
            status: 400,
        },
    );
}
}

export async function DELETE(request: NextRequest){
  try {
    const {answerId} = await request.json()

    const answer = await databases.getDocument(db, answerCollection, answerId)

    const response = await databases.deleteDocument(db, answerCollection, answerId)

    //decrese the reputation
    const prefs = await users.getPrefs<UserPrefs>(answer.authorId)
    await users.updatePrefs(answer.authorId, {
      reputation: Number(prefs.reputation) - 1
    })

    return NextResponse.json(
      {data: response},
      {status: 200}
  )



  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
        {
            error: err.message,
        },
        {
            status: 400,
        },
    );
}
}