import { useUserContext } from "@/context/AuthContext";
import { timeAgo } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStates from "./PostStates";
import OverFlowText from "./OverFlowText";
import ReactPlayer from "react-player";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator.imageURL || "/assets/icons/profile-placeholder.svg"
              }
              className="w-12 lg:h-12 rounded-full"
              alt=""
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {timeAgo(post.$createdAt)}
              </p>
              .
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <div className="small-medium lg:base-medium py-5">
        {/* <p>{post.caption}</p> */}
        <OverFlowText>{post.caption}</OverFlowText>
        <ul className="flex gap-1 mt-2">
          {post.tags.map((tag: string, index: string) => {
            return (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            );
          })}
        </ul>
      </div>
      <Link to={`/posts/${post.$id}`}>
        {post.typeFile == "video/mp4" ? (
          <div className="flex flex-1 flex-center rounded-3xl">
            <ReactPlayer url={post?.imageUrl} controls={true} />
          </div>
        ) : (
          <img
            src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
            className="post-card_img"
            alt=""
          />
        )}
      </Link>
      <PostStates post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
