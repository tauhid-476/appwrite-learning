"use client"
import { databases } from "@/models/client/config"
import { db, questionCollection } from "@/models/name"
import { useAuthStore } from "@/store/auth"
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation"


const DeleteQuestion = ({
  questionId,
  authorId
}:{
  questionId:string
  authorId:string
})=>{
  const { user } = useAuthStore();
  const router = useRouter();

  const deleteQuestion = async()=>{
    try {
      await databases.deleteDocument(db, questionCollection, questionId);
      router.push("/questions");
    } catch (error) {
      console.log(error);
    }
  }

return user?.$id === authorId ? (
  <button
      className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10"
      onClick={deleteQuestion}
  >
      <IconTrash className="h-4 w-4" />
  </button>
) : null;
};

export default DeleteQuestion;