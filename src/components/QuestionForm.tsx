//update or add new

import { useAuthStore } from "@/store/auth"
import { ID, Models } from "appwrite"
import React, { useState } from "react";
import {Confetti} from "@/components/magicui/confetti";
import { databases, storage } from "@/models/client/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { useRouter } from "next/navigation";
import slugify from "@/utils/slugify";
import Meteors from "./magicui/meteors";
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import RTE from "./RTE";
import { IconX } from "@tabler/icons-react";
import { log } from "console";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
      <div
          className={cn(
              "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-4",
              className
          )}
      >
          
          {children}
      </div>
  );
};




const QuestionForm = ({question}: {question?: Models.Document}) => {
  //set states
  //confetti
  // create and update question
  //form submit

  //1
  const {user} = useAuthStore();
  const router = useRouter();
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState("");

  const[tag, setTag] = useState("");
  const[formData, setFormData] = useState({
    title: question?.title || "",
    content: question?.content || "",
    authorId: user?.$id,
    tags: new Set((question?.tags || [])as string[]),
    attachment: null as File | null,
  })

  //2
  const loadConfetti = (timeInMS = 3000) => {
    const end = Date.now() + timeInMS; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
        if (Date.now() > end) return;

        Confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            startVelocity: 60,
            origin: { x: 0, y: 0.5 },
            colors: colors,
        });
        Confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            startVelocity: 60,
            origin: { x: 1, y: 0.5 },
            colors: colors,
        });

        requestAnimationFrame(frame);
    };

    frame();
};

// 3 create or update 
const create = async() => {
 ///check for attachment
 if(!formData.attachment) throw new Error("Please add an attachment")

  const storageResponse = await storage.createFile(
    questionAttachmentBucket,
    ID.unique(),
    formData.attachment
  )

  const response = await databases.createDocument(
    db,
    questionCollection,
    ID.unique(),
    {
      title: formData.title,
      content: formData.content,
      authorId: formData.authorId,
      tags: Array.from(formData.tags),
      attachmentId: storageResponse.$id
    }
  );
  loadConfetti();

  return response;
}

const update = async ()=> {
  //first delete then upload for image
  if(!question) throw new Error("Question not found")

      // return the id of attachment for image. If no image was uploaded return old id
      //iife
      let attachmentId = question.attachmentId;

      if(formData.attachment) {
        //if previus exists delete it 
        if(question.attachmentId){
            try {
                await storage.deleteFile(questionAttachmentBucket,question.attachmentId)
            } catch (error) {
                console.log("Error deleting attachment", error);
            }
        }
        const updatedFile = await storage.createFile(
            questionAttachmentBucket,
            ID.unique(),
            formData.attachment
          )
          attachmentId = updatedFile.$id
      }

      
  
  const response = await databases.updateDocument(
    db,
    questionCollection,
    question.$id,  //no ID.uniqyue since its updation
    {
      title: formData.title,
      content: formData.content,
      authorId: formData.authorId,
      tags: Array.from(formData.tags),
      attachmentId: attachmentId
    }
  )
    
    return response;
};


const submit = async(e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if(!formData.title || !formData.content || !formData.authorId) {
    setError(() => "Please fill all the fields");
    return;
  }

  setLoading(()=> true)
  setError(() => "")

  try {
     const response = question ? await update() : await create();
     router.push(`/question/${response.$id}/${slugify(formData.title)}`);

  } catch (error:any) {
    setError(() => error.message);
  }

  setLoading(()=> false)
}

return(
  
  <form className="space-y-4" onSubmit={submit}>
  {error && (
      <LabelInputContainer>
          <div className="text-center">
              <span className="text-red-500">{error}</span>
          </div>
      </LabelInputContainer>
  )}
  <LabelInputContainer>
      <Label htmlFor="title">
          Title Address
          <br />
          <small>
              Be specific and imagine you&apos;re asking a question to another person.
          </small>
      </Label>
      <Input
          id="title"
          name="title"
          placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
          type="text"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
      />
  </LabelInputContainer>
  <LabelInputContainer>
      <Label htmlFor="content">
          What are the details of your problem?
          <br />
          <small>
              Introduce the problem and expand on what you put in the title. Minimum 20
              characters.
          </small>
      </Label>
      <RTE
          value={formData.content}
          onChange={value => setFormData(prev => ({ ...prev, content: value || "" }))}
      />
  </LabelInputContainer>
  <LabelInputContainer>
      <Label htmlFor="image">
          Image
          <br />
          <small>
              Add image to your question to make it more clear and easier to understand.
          </small>
      </Label>
      <Input
          id="image"
          name="image"
          accept="image/*"
          placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
          type="file"
          onChange={e => {
              const files = e.target.files;
              if (!files || files.length === 0) return;
              setFormData(prev => ({
                  ...prev,
                  attachment: files[0],
              }));
          }}
      />
  </LabelInputContainer>
  <LabelInputContainer>
      <Label htmlFor="tag">
          Tags
          <br />
          <small>
              Add tags to describe what your question is about. Start typing to see
              suggestions.
          </small>
      </Label>
      <div className="flex w-full gap-4">
          <div className="w-full">
              <Input
                  id="tag"
                  name="tag"
                  placeholder="e.g. (java c objective-c)"
                  type="text"
                  value={tag}
                  onChange={e => setTag(() => e.target.value)}
              />
          </div>
          <button
              className="relative shrink-0 rounded-full border border-slate-600 bg-slate-700 px-8 py-2 text-sm text-white transition duration-200 hover:shadow-2xl hover:shadow-white/[0.1]"
              type="button"
              onClick={() => {
                  if (tag.length === 0) return;
                  setFormData(prev => ({
                      ...prev,
                      tags: new Set([...Array.from(prev.tags), tag]),
                  }));
                  setTag(() => "");
              }}
          >
              <div className="absolute inset-x-0 -top-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-2xl" />
              <span className="relative z-20">Add</span>
          </button>
      </div>
      <div className="flex flex-wrap gap-2">
          {Array.from(formData.tags).map((tag, index) => (
              <div key={index} className="flex items-center gap-2">
                  <div className="group relative inline-block rounded-full bg-slate-800 p-px text-xs font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900">
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10">
                          <span>{tag}</span>
                          <button
                              onClick={() => {
                                  setFormData(prev => ({
                                      ...prev,
                                      tags: new Set(
                                          Array.from(prev.tags).filter(t => t !== tag)
                                      ),
                                  }));
                              }}
                              type="button"
                          >
                              <IconX size={12} />
                          </button>
                      </div>
                      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                  </div>
              </div>
          ))}
      </div>
  </LabelInputContainer>
  <button
      className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      type="submit"
      disabled={loading}
  >
      {question ? "Update" : "Publish"}
  </button>
</form>
)

}

export default QuestionForm