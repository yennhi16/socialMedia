import { Account, Avatars, Client, Databases, Storage } from "appwrite";

export const appwiteConfig = {
  projectID: "658704173d9e13dc0817",
  url: "https://cloud.appwrite.io/v1",
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE,
  userCollectionId: import.meta.env.VITE_APPWRITE_COLECTION_USERS,
  postCollectionId: import.meta.env.VITE_APPWRITE_COLECTION_POSTS,
  savesCollectionId: import.meta.env.VITE_APPWRITE_COLECTION_SAVES,
  followCollectionId: import.meta.env.VITE_APPWRITE_COLECTION_FOLLOW,
  commentsCollectionId: import.meta.env.VITE_APPWRITE_COLECTION_COMMENTS,
};

export const client = new Client();
client.setEndpoint(appwiteConfig.url).setProject(appwiteConfig.projectID);
export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
