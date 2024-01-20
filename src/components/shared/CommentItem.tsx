import { timeAgo } from "@/lib/utils";

type CommentItemProps = {
  comment?: any;
};
export const CommentItem = ({ comment }: CommentItemProps) => {
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
      </div>
    </div>
  );
};
