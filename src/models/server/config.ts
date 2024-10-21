import {env} from "@/app/env";

import { Client, Users, Avatars, Databases, Storage} from "node-appwrite"

//we  are gonna talk to user in backend

const client = new Client()

client
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId) // Your project ID
    .setKey(env.appwrite.apikey) // Your secret API key


const users = new Users(client);
const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

console.log("database connected ");

export {client , users, databases, avatars, storage}