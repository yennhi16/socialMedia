import { Models } from "appwrite";
import { Link } from "react-router-dom";
import ButtonFollow from "./ButtonFollow";

type UserCardProps = {
  user: Models.Document;
  currentUser: any;
};

const UserCard = ({ user, currentUser }: UserCardProps) => {
  return (
    <>
      <div className="user-card">
        <Link to={`/profile/${user.$id}`}>
          <div className="flex-center mb-1">
            <img
              src={user.imageURL || "assets/icons/profile-placeholder.svg"}
              className="rounded-full w-14 h-14"
              alt=""
            />
          </div>

          <div className="flex-center flex-col gap-1">
            <p className="base-medium text-light-1 text-center line-clamp-1">
              {user.name}
            </p>
            <p className="small-regular text-light-3 text-center line-clamp-1">
              @{user.username}
            </p>
          </div>
        </Link>
        <ButtonFollow user={user} currentUser={currentUser?.id}></ButtonFollow>
      </div>
    </>
  );
};

export default UserCard;
