import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";

import React from "react";

const AllUsers = () => {
  const { toast } = useToast();

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  const { user } = useUserContext();
  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="user-container">All users</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.documents.map((creator: any) => {
              return (
                <li key={creator.$id} className="flex-1 min-w-[200px] w-full">
                  <UserCard currentUser={user} user={creator} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
