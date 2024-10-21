//find voted document 
// get the vote status and toggle the vote
"use client"
import { cn } from "@/lib/utils";
import { databases } from "@/models/client/config";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/auth";
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react";
import { Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



const VoteButtons = (
  {
    type,
    id,
    upvotes,
    downvotes,
    className
  }: {
    type: "question" | "answer";
    id: string;
    upvotes: Models.DocumentList<Models.Document>;
    downvotes: Models.DocumentList<Models.Document>;
    className?: string;
  }) => {
  //our app looks like this
  /*        UpvoteButton
               RESULT
            DownVoteButton
*/

  const [votedDocument, setVotedDocument] = useState<Models.Document | null>();
  const [votesResult, setVotesResult] = useState<number>(upvotes.total - downvotes.total);

  const router = useRouter();
  const { user } = useAuthStore();


  //when a user visits the page of voting functionality , the votes should be displayed correctly
  useEffect(() => {
    async () => {
      if (user) {

        const response = await databases.listDocuments(
          db, voteCollection, [
          Query.equal("votedById", user.$id),
          Query.equal("type", type),
          Query.equal("typeId", id)
        ]);
        setVotedDocument(response.documents[0] || null);
      }
    }
  }, [user, id, type])

  //toggle upvote

  const toggleUpvote = async () => {
    if (!user) return router.push("/login")

    if (!votedDocument) return;

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id, // Now TypeScript knows user is not null.
          voteStatus: "upvoted",
          type,
          typeId: id
        })
      })

      const data = await response.json();
      console.log("data is", data, "data.data is", data.data);


      if (!response.ok) throw data;

      setVotesResult(data.data.voteResult);
      setVotedDocument(data.data.document);

    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  }
  //toggle downvote
  const toggleDownvote = async () => {
    if (!user) return router.push("/login")

    if (!votedDocument) return;

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id, // Now TypeScript knows user is not null.
          voteStatus: "downvoted",
          type,
          typeId: id
        })
      })
      const data = await response.json();
      console.log("data is", data, "data.data is", data.data);


      if (!response.ok) throw data;

      setVotesResult(data.data.voteResult);
      setVotedDocument(data.data.document);

    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  }


  return (

    <div className={cn("flex shrink-0 flex-col items-center justify-start gap-y-4", className)}>
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
          votedDocument && votedDocument.voteStatus === "upvoted"
            ? "border-orange-500 text-orange-500"
            : "border-white/30"
        )}
        onClick={toggleUpvote}
      >
        <IconCaretUpFilled />
      </button>
      <span>{votesResult}</span>
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
          votedDocument && votedDocument.voteStatus === "downvoted"
            ? "border-orange-500 text-orange-500"
            : "border-white/30"
        )}
        onClick={toggleDownvote}
      >
        <IconCaretDownFilled />
      </button>
    </div>
  );
};

export default VoteButtons