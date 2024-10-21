import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import {AppwriteException, Models , ID } from "appwrite"
import { account } from "@/models/client/config";
// state management on client side
/*steps:  1 import  (done)
          2 interface (for typescript only)
          3 store  (immer , persist)
          4 store states and methods 
          5 rehydration
*/        

//every user has reputation based on the upvotes and downvotes they have
//2) interface design for the state u want to manage and a store
export interface UserPrefs{
 reputation: number
}

//hydration -> setHydrated  whther the data are coming ir not from the localstorage 
interface IAuthStore{
   session: Models.Session | null
   user: Models.User<UserPrefs> | null
   jwt: string | null
   hydrated: boolean


   setHydrated(): void;
   verifySession(): Promise<void>;
   login(
    email:string,
    password:string
   ): Promise<
    {
      success: boolean;
      error?: AppwriteException | null;
    }>;
   createAccount(
    name: string,
    email:string,
    password:string
   ): Promise<
    {
      success: boolean;
      error?: AppwriteException | null;
    }>;

    logout(): Promise<void>;
}

//2 step done
//3 create store
// persist --> immer (write all the dunctionalities here)
// some configurations loke store name etc.
export const useAuthStore = create<IAuthStore>()(
  persist(
    immer( (set) => ({
      //inital states
      session: null,
      user: null,
      jwt: null,
      hydrated: false,



      setHydrated(){
        set({hydrated:true})
      },

     async verifySession(){
      try {
        const session = await account.getSession("current");
        set({session})
      } catch (error) {
        console.log(error);
      }
     },
     





     
  
     async login(email:string, password:string){
      try {
       const session = await account.createEmailPasswordSession(email, password)
       //grab the user and jwt
       const [user, {jwt}] = await Promise.all([
        account.get<UserPrefs>(),
        account.createJWT(),
       ])
       console.log(user.$id);
       
       //create reputation if not there
       if(!user.prefs?.reputation) await account.updatePrefs<UserPrefs>({ reputation: 0 })
        
        set({session, user, jwt})

        return ({success: true})
      } catch (error) {
        console.log(error);
        return {
          success: false,
          error: error instanceof AppwriteException ? error: null,
        }
      }
     },


     async createAccount(name:string, email:string, password:string) {
      try {
       await account.create(ID.unique(), email, password, name) 
       return ({ success: true})
      } catch (error) {
        console.log(error);
        return {
          success: false,
          error: error instanceof AppwriteException ? error: null,
        }
      }
     },
     async logout(){
         try {
          await account.deleteSessions()
          set({session: null, jwt: null, user: null})
         } catch (error) {
          console.log(error);
         }
     }
    })),
    {
      name: "auth",
      onRehydrateStorage: () => {
        return (state, error) => {
          if(!error) state?.setHydrated()
        }
      }
    }
  )
)
