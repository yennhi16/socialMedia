import { PostForm } from "@/components/form/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();

  const { data: currentPost, isLoading } = useGetPostById(id ? id : "");

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/edit.svg" width={36} height={36} alt="" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Update Post</h2>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <PostForm action="Update" post={currentPost} />
        )}
      </div>
    </div>
  );
};

export default EditPost;
