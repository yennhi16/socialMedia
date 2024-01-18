import { bottombarLinks } from "@/constants";
import { Link, useLocation } from "react-router-dom";

const BottomBar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            key={link.label}
            to={link.route}
            className={`${
              isActive && "bg-primary-500 rounded-[10px]"
            } bottombar-link p-1 flex-center flex-col gap-1 transition`}
          >
            <img
              src={link.imgURL}
              alt=""
              width={16}
              height={16}
              className={`${isActive && "invert-white"}`}
            />
            <p className="tiny-media text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default BottomBar;
