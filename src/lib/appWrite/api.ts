import {
  IComment,
  INewPost,
  INewUser,
  IUpdatePost,
  IUpdateUser,
} from "@/types";
import { account, appwiteConfig, avatars, database, storage } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
  console.log("createUserAccount");
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw Error;
    const avartarURL = avatars.getInitials(user.name);
    console.log("avartarURL", avartarURL);
    const newUser = await saveUserToDB({
      name: newAccount.name,
      accountId: newAccount.$id,
      email: newAccount.email,
      imageURL: avartarURL.toString(),
      username: user.username,
    });
    console.log("created account", newUser);
    return newUser;
  } catch (err) {
    console.log(err);
  }
}

export async function saveUserGoogleToDB() {
  try {
    const accountUser = await account.get();
    if (!accountUser) throw Error;

    const oldUser = await database.listDocuments(
      appwiteConfig.databaseId,
      appwiteConfig.userCollectionId,
      [Query.equal("email", accountUser.email)]
    );
    if (oldUser.documents.length === 0) {
      const avartarURL = avatars.getInitials(accountUser.name);

      const newUser = {
        name: accountUser.name,
        accountId: accountUser.$id,
        email: accountUser.email,
        imageURL: avartarURL.toString(),
        username: accountUser.name,
      };

      const user = await database.createDocument(
        appwiteConfig.databaseId,
        appwiteConfig.userCollectionId,
        ID.unique(),
        newUser
      );

      return user;
    }
    return oldUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export async function saveUserToDB(user: {
  name: string;
  accountId: string;
  email: string;
  imageURL: string;
  username?: string;
}) {
  try {
    console.log({ user });
    const newUser = await database.createDocument(
      appwiteConfig.databaseId,
      appwiteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function signInWithGoogle() {
  try {
    await account.createOAuth2Session(
      "google",
      "http://localhost:3000/sign-in",
      "http://localhost:3000/sign-in"
    );

    const session = await account.getSession("current");

    if (!session) throw Error;

    const accountUser = account.get();

    return accountUser;
  } catch (error) {
    console.log(error);
  }
}

//=================Get user===========
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await database.listDocuments(
      appwiteConfig.databaseId,
      appwiteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

//======================Get All Users =================

export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await database.listDocuments(
      appwiteConfig.databaseId,
      appwiteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await database.getDocument(
      appwiteConfig.databaseId,
      appwiteConfig.userCollectionId,
      userId
    );
    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserPost(userId?: string) {
  if (!userId) return;
  try {
    const posts = database.listDocuments(
      appwiteConfig.databaseId,
      appwiteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );
    if (!posts) return;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

//=================Update User ==============================

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      const upLoadedFile = await fileUpload(user.file[0]);

      if (!upLoadedFile) throw Error;

      const fileUrl = getFilePriview(upLoadedFile.$id);

      if (!fileUrl) {
        await deleteFile(upLoadedFile.$id);
        throw Error;
      }

      image = { ...image, imageId: upLoadedFile.$id, imageUrl: fileUrl };
    }

    const updateUser = await database.updateDocument(
      appwiteConfig.databaseId,
      appwiteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageURL: image.imageUrl,
        imageID: image.imageId,
      }
    );
    if (!updateUser) {
      if (hasFileToUpdate) await deleteFile(image.imageId);
      throw Error;
    }

    // delete old file after successful

    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updateUser;
  } catch (error) {
    console.log(error);
  }
}

//================Get post by ID =============================

export async function getPostById(postId: string) {
  try {
    const post = await database.getDocument(
      appwiteConfig.databaseId,
      appwiteConfig.postCollectionId,
      postId
    );
    if (!post) return;

    return post;
  } catch (error) {
    console.log(error);
  }
}

//========================Create Post =================
export async function createPost(post: INewPost) {
  try {
    console.log("create post", post);
    const uploadFile = await fileUpload(post.file[0]);
    console.log({ uploadFile });
    if (!uploadFile) throw Error;

    const fileUrl =
      uploadFile.mimeType == "video/mp4"
        ? getVideoUpload(uploadFile.$id)
        : getFilePriview(uploadFile.$id);

    console.log({ fileUrl });
    if (!fileUrl) {
      deleteFile(uploadFile.$id);
      throw Error;
    }
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newPost = await database.createDocument(
      appwiteConfig.databaseId,
      appwiteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        location: post.location,
        tags: tags,
        imageID: uploadFile.$id,
        typeFile: uploadFile.mimeType,
      }
    );

    if (!newPost) {
      deleteFile(uploadFile.$id);
      throw Error;
    }
    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function fileUpload(file: File) {
  try {
    const uploadFile = await storage.createFile(
      appwiteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadFile;
  } catch (error) {
    console.log(error);
  }
}
export function getVideoUpload(fileId: string) {
  try {
    const fileUrl = storage.getFileView(appwiteConfig.storageId, fileId);
    if (!fileUrl) throw Error;
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePriview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwiteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileId) throw Error;
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwiteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
      typeFile: post.file[0].type,
    };
    if (hasFileUpdate) {
      const uploadFIle = await fileUpload(post.file[0]);
      if (!uploadFIle) throw Error;

      const fileUrl =
        uploadFIle.mimeType == "video/mp4"
          ? getVideoUpload(uploadFIle.$id)
          : getFilePriview(uploadFIle.$id);

      if (!fileUrl) {
        await deleteFile(uploadFIle.$id);
        throw Error;
      }
      image = {
        ...image,
        imageId: uploadFIle.$id,
        imageUrl: fileUrl,
        typeFile: uploadFIle.mimeType,
      };
    }
    console.log({ image });
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatePost = await database.updateDocument(
      appwiteConfig.databaseId,
      appwiteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageID: image.imageId,
        location: post.location,
        tags: tags,
        typeFile: image.typeFile,
      }
    );

    if (!updatePost) {
      if (hasFileUpdate) {
        await deleteFile(image.imageId);
      }
      throw Error;
    }
    if (hasFileUpdate) {
      await deleteFile(post.imageId);
    }
    return updatePost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId?: string, imageId?: string) {
  console.log("deletePost", { postId, imageId });
  if (!postId || !imageId) {
    return;
  }
  try {
    const statusCode = await database.deleteDocument(
      appwiteConfig.databaseId,
      appwiteConfig.postCollectionId,
      postId
    );
    console.log("statusCode", statusCode);

    if (!statusCode) {
      throw Error;
    }
    await deleteFile(imageId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

//==================== Get Popular post

export async function getRecentPost() {
  try {
    const posts = await database.listDocuments(
      appwiteConfig.databaseId,
      appwiteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

//=================getInfinitePosts ==============

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(3)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await database.listDocuments(
      appwiteConfig.databaseId,
      appwiteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

//============= Get post ==============

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await database.listDocuments(
      appwiteConfig.databaseId,
      appwiteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

//================= LIKE / UNLIKE POST ===========

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatePost = await database.updateDocument(
      appwiteConfig.databaseId,
      appwiteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatePost) throw Error;

    return updatePost;
  } catch (error) {
    console.log(error);
  }
}

//===============Save Post ======
export async function savePost(userId: string, postId: string) {
  try {
    const updatePost = await database.createDocument(
      appwiteConfig.databaseId,
      appwiteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatePost) throw Error;
    return updatePost;
  } catch (error) {
    console.log(error);
  }
}

//================= delete saved post ============

export async function deleteSavedPost(saveRecordId: string) {
  try {
    const statusCode = await database.deleteDocument(
      appwiteConfig.databaseId,
      appwiteConfig.savesCollectionId,
      saveRecordId
    );
    if (!statusCode) throw Error;
    return { status: "OK" };
  } catch (error) {
    console.log(error);
  }
}

// ===================== Follow people===============

export async function addFollowers(userId: string, followdId: string) {
  try {
    console.log("followId", appwiteConfig.followCollectionId);
    const newFollow = await database.createDocument(
      appwiteConfig.databaseId,
      appwiteConfig.followCollectionId,
      ID.unique(),
      {
        follower: userId,
        following: followdId,
      }
    );
    if (!newFollow) throw Error;

    return newFollow;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFollow(followId: string) {
  try {
    console.log("Deleting", followId);
    const statusCode = await database.deleteDocument(
      appwiteConfig.databaseId,
      appwiteConfig.followCollectionId,
      followId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getFollowing(userId: string) {
  try {
    const listFollwing = await database.listDocuments(
      appwiteConfig.databaseId,
      appwiteConfig.followCollectionId,
      [Query.equal("following", userId)]
    );
    console.log({ listFollwing });
    if (!listFollwing) throw Error;

    return listFollwing;
  } catch (error) {
    console.log(error);
  }
}
//================ Add Comment ======================

export async function addComment(comment: IComment) {
  try {
    const newComment = await database.createDocument(
      appwiteConfig.databaseId,
      appwiteConfig.commentsCollectionId,
      ID.unique(),
      {
        postId: comment.postId,
        creatorId: comment.creatorId,
        content: comment.content,
        creatorAvatar: comment.avatar,
        creatorName: comment.creatorName,
      }
    );

    if (!newComment) throw Error;
    return newComment;
  } catch (error) {
    console.log(error);
  }
}

export async function getCommentOfPost(postId: string) {
  try {
    const listComment = await database.listDocuments(
      appwiteConfig.databaseId,
      appwiteConfig.commentsCollectionId,
      [Query.equal("postId", postId)]
    );
    console.log({ postId, listComment });
    if (!listComment) throw Error;
    // console.log({ listComment });
    return listComment;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteComment(commentId: string) {
  try {
    const status = await database.deleteDocument(
      appwiteConfig.databaseId,
      appwiteConfig.commentsCollectionId,
      commentId
    );
    if (!status) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
