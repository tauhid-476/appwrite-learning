import {env} from "@/app/env";

import { Client, Account, Avatars, Databases, Storage } from "appwrite";
//avatars --> lightweight images --> qn is asked with image also
//storage ---> to store and upload stuffss


const client = new Client()
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId); // Your project ID



//create instances for alll and export    
const account = new Account(client);
const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

export {client , account, databases, avatars, storage}

