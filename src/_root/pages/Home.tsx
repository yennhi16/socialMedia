import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetPosts,
  useGetUsers
} from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const Home = () => {
  // const {
  //   data: posts,
  //   isLoading: isPostLoading,
  //   isError: isErrorPost,
  // } = useGetRecentPosts();
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isLoading: isPostLoading,
    isError: isErrorPost,
  } = useGetPosts();
  const { ref, inView } = useInView();
  const { user } = useUserContext();
  const [currentUser, setCurrentUser] = useState<any>();
  useEffect(() => {
    if (user.id !== "") {
      setCurrentUser(user);
    }
  }, [user]);
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers();
  if (isErrorPost || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  return (
    <div className="flex left-1 overflow-auto h-full">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {/* {posts?.documents.map((post: Models.Document) => {
                return <PostCard post={post} key={post.$id} />;
              })} */}
              {posts?.pages.map((post) =>
                post.documents.map((item: any) => (
                  <PostCard post={item} key={item.$id} />
                ))
              )}
            </ul>
          )}
        </div>
        {hasNextPage && (
          <div ref={ref} className="mt-10">
            <Loader />
          </div>
        )}
      </div>

      <div className="home-creators ">
        <h3 className="h3-bold text-light-1">Top creator</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => {
              return (
                <li key={creator.$id}>
                  {currentUser?.id && (
                    <UserCard currentUser={currentUser} user={creator} />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
