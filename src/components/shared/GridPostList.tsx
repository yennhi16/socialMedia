import { useUserContext } from "@/context/AuthContext";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import React from "react";
import { Link } from "react-router-dom";
import PostStates from "./PostStates";
import OverFlowText from "./OverFlowText";

type GridPostListProps = {
  posts?: Models.Document[];
  showUser?: boolean;
  showStatus?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStatus = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts?.map((post) => {
        return (
          <li
            key={post.$id}
            className="relative h-80 postItem transition-all ease-in-out delay-500 duration-500 group overflow-hidden"
          >
            <div className="absolute top-0 bottom-0 left-0 right-0 transition-all ease-in-out duration-500 translate-y-full bg-[rgba(0,0,0,0.64)] group-hover:translate-y-0 group-hover:duration-500">
              <h2 className="text-center line-clamp-1 text-xl font-bold h-full flex justify-center items-center">
                <Link to={`/posts/${post.$id}`}>
                  <OverFlowText width="250">{post.caption}</OverFlowText>
                </Link>
              </h2>
            </div>
            <Link to={`/posts/${post.$id}`} className="grid-post_link">
              <img
                src={post.imageUrl}
                alt="post"
                className="h-full w-full object-cover"
              />
            </Link>

            <div className="grid-post_user ">
              {showUser && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img
                    src={
                      post.creator.imageURL ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="line-clamp-1">{post.creator.name}</p>
                </div>
              )}

              {showStatus && <PostStates post={post} userId={user.id} />}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GridPostList;
