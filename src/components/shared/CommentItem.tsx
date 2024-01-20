import { useDeleteComment } from "@/lib/react-query/queriesAndMutations";
import { timeAgo } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useToast } from "../ui/use-toast";
import Loader from "./Loader";

type CommentItemProps = {
  comment?: any;
  allowDelete?: boolean;
};
export const CommentItem = ({ comment, allowDelete }: CommentItemProps) => {
  const { mutateAsync: deleteComment, isLoading, isError } = useDeleteComment();
  const { toast } = useToast();
  const handleDeleteComment = async (commentId: string) => {
    const response = await deleteComment(commentId);
    if (isError) {
      toast({ title: "Delete Comment failed" });
    }
    if (response?.status == "ok") {
      toast({ title: "Delete Comment successfully" });
    }
  };
  return (
    <div className="py-4 flex">
      <img
        width={50}
        height={50}
        className="avatar rounded-full h-[50px]"
        src={comment.creatorAvatar}
        alt=""
      />
      <div className="content bg-dark-4 p-4 rounded-xl ml-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-primary-500 mb-1 ">
            {comment.creatorName}
          </h3>
          <span className=" text-xs text-primary-500 font-light ml-6">
            {timeAgo(comment.$createdAt)}
          </span>
        </div>
        <div className="text-sm">{comment.content}</div>
        {allowDelete && (
          <div className=" flex justify-end">
            {isLoading ? (
              <Loader />
            ) : (
              <Icon
                onClick={() => handleDeleteComment(comment.$id)}
                className=" text-primary-600 cursor-pointer"
                icon="fluent:delete-32-regular"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
