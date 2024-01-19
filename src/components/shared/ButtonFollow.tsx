import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  useAddFollow,
  useDeleteFollow,
} from "@/lib/react-query/queriesAndMutations";
import { useToast } from "../ui/use-toast";
import Loader from "./Loader";

type ButtonFollowProps = {
  user: any;
  currentUser: string;
};
const ButtonFollow = ({ user, currentUser }: ButtonFollowProps) => {
  const {
    mutateAsync: addFollow,
    isLoading,
    isError,
    isSuccess,
  } = useAddFollow();

  const follower = useMemo(
    () => user?.follower.find((item: any) => item.follower.$id == currentUser),
    [user]
  );

  const [checkFollowed, setCheckFollowed] = useState<any>(follower);

  const { toast } = useToast();

  const {
    mutateAsync: deleteFollow,
    isLoading: loadingDelete,
    isError: errorDelete,
    isSuccess: successDelete,
  } = useDeleteFollow();

  const handleAddFollow = async () => {
    const newFollow = await addFollow({
      userId: currentUser,
      followered: user.$id,
    });
    console.log({ newFollow });
    setCheckFollowed(newFollow);

    if (isSuccess) {
      console.log("Successfully added");
    }
    if (isError) {
      toast({ title: "Follow failed", variant: "destructive" });
    }
  };

  const handleUnFollow = async () => {
    if (checkFollowed) {
      const status = await deleteFollow(checkFollowed?.$id);
      if (status?.status == "Ok") {
        setCheckFollowed(false);
      }
    }

    if (errorDelete) {
      toast({ title: "UnFollow failed", variant: "destructive" });
      return;
    }
    if (successDelete) {
      console.log("successDelete");

      toast({ title: "UnFollow successed", variant: "destructive" });
      return;
    }
  };

  return (
    <div>
      <Button
        disabled={isLoading || loadingDelete}
        className={`px-5 ${
          checkFollowed ? "shad-button_secondary" : "shad-button_primary"
        }`}
      >
        {isLoading || loadingDelete ? (
          <>
            <Loader /> Loading...
          </>
        ) : checkFollowed ? (
          <div onClick={() => handleUnFollow()}>UnFollow</div>
        ) : (
          <div onClick={() => handleAddFollow()}>Follow</div>
        )}
      </Button>
    </div>
  );
};

export default ButtonFollow;
