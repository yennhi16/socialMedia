import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { CommentItem } from "./CommentItem";
import { Icon } from "@iconify/react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import {
  useAddComment,
  useGetCommentOfPost,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";
import { useUserContext } from "@/context/AuthContext";
import { IComment } from "@/types";
import { useToast } from "../ui/use-toast";

interface CommentProps {
  postId: string;
}

export const Comments = ({ postId }: CommentProps) => {
  const { data: comments, isLoading } = useGetCommentOfPost(postId);

  const [value, setValue] = useState<string>("");

  const [showEmoji, setShowEmoji] = useState(false);

  const theme: Theme = Theme.DARK;

  const {
    mutateAsync: addComment,
    isLoading: addCommentLoading,
    isError: addCommentError,
  } = useAddComment();

  const handlePickEmoji = (emojiData: EmojiClickData) => {
    setValue((prevValue) => prevValue + emojiData.emoji);
  };

  const { user: currentUser } = useUserContext();

  const [commentList, setCommentList] = useState(comments?.documents);

  const { toast } = useToast();

  useEffect(() => {
    if (comments) {
      setCommentList(comments.documents);
    }
  }, [comments]);

  const handleAddComment = async () => {
    const newComment: IComment = {
      creatorId: currentUser.id,
      creatorName: currentUser.username,
      avatar: currentUser.imageUrl,
      content: value,
      postId: postId,
    };
    console.log("handleAddComment", newComment);
    const comment = await addComment(newComment);

    if (addCommentError) {
      toast({ title: "Add Comment failed" });
    }
    if (comment) {
      setValue("");
      setShowEmoji(false);
    }
  };

  return (
    <>
      <div className="py-4 h-[300px] overflow-auto">
        {isLoading ? (
          <Loader />
        ) : (
          commentList?.map((item) => (
            <CommentItem
              allowDelete={item.creatorId == currentUser.id}
              key={item.$id}
              comment={item}
            />
          ))
        )}
      </div>

      <div className=" relative h-fit">
        <Input
          disabled={addCommentLoading}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder="Add your comment"
          className="shad-input rounded-full"
        />
        <span className="absolute top-1/2 right-0 translate-y-[-50%] mr-2 ">
          {addCommentLoading ? (
            <Loader />
          ) : (
            <Icon
              onClick={handleAddComment}
              className="text-primary-500 w-6 h-6 cursor-pointer"
              icon="fluent:send-24-filled"
            />
          )}
        </span>

        <Icon
          icon="mdi:emoji-outline"
          className={`${
            showEmoji ? "text-primary-600" : "text-primary-500"
          } w-6 h-6 absolute top-1/2 right-10 translate-y-[-50%] cursor-pointer`}
          onClick={() => setShowEmoji(!showEmoji)}
        />
        {showEmoji && (
          <div className="custom-scrollbar container-emoji rounded-xl absolute right-0 bottom-0 h-[350px] top-[-370px]">
            <EmojiPicker
              height="350px"
              className=" rounded-xl h-[300px]"
              skinTonesDisabled={true}
              theme={theme}
              onEmojiClick={handlePickEmoji}
            />
          </div>
        )}
      </div>
    </>
  );
};
