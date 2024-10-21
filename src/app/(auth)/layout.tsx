"use client"

import React from "react"
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";


const Layout = ({children}: {children: React.ReactNode}) => {
  //return the children (login and register)
  //check for sessions (some sort of middleware)
  const { session } = useAuthStore();
  const router = useRouter();
    React.useEffect(() => {
      if(session){
        router.push("/");
       }
    },[session, router])

    //explicitly return null
    if(session){
      return null;
     }
   
  return (
    <div className="flex flex-col min-h-screen justify-center items-center relative py-12 bg-black">
      <BackgroundBeams />
     <div className="relative">{children}</div>
    </div> 
  )
}

export default Layout