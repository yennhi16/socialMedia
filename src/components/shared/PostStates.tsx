import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";
import { Comments } from "./Comments";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

type PostStatesProps = {
  post: Models.Document;
  userId: string;
};

const PostStates = ({ post, userId }: PostStatesProps) => {
  const location = useLocation();

  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(likesList);

  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();

  const { mutate: savePost, isLoading: isSaveLoading } = useSavePost();

  const { mutate: deleteSavedPost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  const handleLikePost = () => {
    let likesArray = [...likes];
    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((like) => like !== userId);
    } else {
      likesArray.push(userId);
    }
    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };

  const handleSavedPost = () => {
    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavedPost(savedPostRecord.$id);
    }
    setIsSaved(true);
    return savePost({ userId, postId: post.$id });
  };

  // const containerStyles = location.pathname.startsWith("/profile")
  //   ? "w-full"
  //   : "";
  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        {/* {isLikeLoading ? (
          <Loader />
        ) : ( */}
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          width={20}
          height={20}
          className="cursor-pointer"
          alt=""
          onClick={() => handleLikePost()}
        />
        {/* )} */}
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        <div>
          {isSaveLoading ? (
            <Loader />
          ) : (
            <img
              src={
                isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"
              }
              width={20}
              height={20}
              className="cursor-pointer"
              alt=""
              onClick={() => handleSavedPost()}
            />
          )}
        </div>
        <div className="ml-2">
          {/* <Comments postId={post.$id} /> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="p-0 h-fit">
                <i className="fa-regular fa-comment text-primary-500 text-[20px]"></i>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px] min-h-[550px] bg-dark-2">
              <DialogHeader>
                <DialogTitle>
                  <i className="fa-regular fa-comment text-primary-500 text-[26px] mr-4"></i>
                  Comments
                </DialogTitle>
              </DialogHeader>
              <Comments postId={post.$id} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PostStates;
