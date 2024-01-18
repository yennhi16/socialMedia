import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Saved = () => {
  const { data: currentUser, isLoading } = useGetCurrentUser();

  const savePost = currentUser?.save
    .map((savePost: Models.Document) => {
      return {
        ...savePost.post,
        creator: {
          imageURL: currentUser.imageURL,
        },
      };
    })
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          className="invert-white"
          alt=""
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>
      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePost.length === 0 ? (
            <p className="text-light-4">No availeble posts</p>
          ) : (
            <GridPostList posts={savePost} showStatus={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
