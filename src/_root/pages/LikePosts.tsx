import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";

const LikePosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div>
      {currentUser.liked.length === 0 && (
        <p className="text-light">No liked posts</p>
      )}
      <GridPostList posts={currentUser.liked} showStatus={false} />
    </div>
  );
};

export default LikePosts;
