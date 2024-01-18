import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

export const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to={"/"} className="flex gap-3 items-center">
          <img src="/assets/img/logo.svg" width={130} height={325} alt="" />
        </Link>
        <div className="flex gap-4">
          <Button
            onClick={() => signOut()}
            variant="ghost"
            className="shad-button_ghost"
          >
            <img src="/assets/icons/logout.svg" alt="" />
          </Button>
          <Link to={`/profile ${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "assets/img/profile-placeholder.svg"}
              alt="profile"
              className="h-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};
