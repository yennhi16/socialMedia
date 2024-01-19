import { sidebarLinks } from "@/constants";
import { INITIAL_USER, useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { INavLink } from "@/types";
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const LeftSide = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { user, setUser, setIsAuthenticated } = useUserContext();

  const { mutate: signOut } = useSignOutAccount();

  const [openSidebar, setOpenSidebar] = useState(true);

  const handleSignOut = async () => {
    await signOut();

    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    setTimeout(() => {
      navigate("/sign-in");
    }, 1000);
  };

  return (
    <nav
      className={`leftsidebar transition-all duration-500 ease-in relative ${
        openSidebar ? "" : "narrow-sidebar"
      }`}
    >
      <div className="flex flex-col h-full justify-between">
        <Link to={"/"} className="flex gap-3 items-center">
          <img src="/assets/img/logo.svg" width={170} height={36} alt="" />
        </Link>

        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt=""
            className="h-14 w-14 rounded-full"
          />

          <div className="flex flex-col text-item">
            <p className="body-bold text-item">{user.name}</p>
            <p className="small-regular text-wrap text-light-3 text-item">
              @{user.username}
            </p>
          </div>
        </Link>
        <ul className="flex flex-col gap-3">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link ${isActive && "bg-primary-500"}`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4 group"
                >
                  <img
                    src={link.imgURL}
                    alt=""
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />

                  <span className="text-item">{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
        <Button
          onClick={() => handleSignOut()}
          variant="ghost"
          className="shad-button_ghost overflow-hidden"
        >
          <img src="/assets/icons/logout.svg" alt="" />
          <p className="small-medium lg:base-medium text-item">Logout</p>
        </Button>
      </div>
      <div
        onClick={() => setOpenSidebar(!openSidebar)}
        className="absolute w-[30px] h-[30px] flex flex-center bg-dark-2 right-0 bottom-20 translate-x-1/2 border-[2px] border-solid border-primary-600 rounded-md cursor-pointer"
      >
        {openSidebar ? (
          <i className="fa-solid fa-angle-left"></i>
        ) : (
          <i className="fa-solid fa-chevron-right m-0 p-0 "></i>
        )}
      </div>
    </nav>
  );
};

export default LeftSide;
