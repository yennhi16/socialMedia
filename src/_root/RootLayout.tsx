import BottomBar from "@/components/shared/BottomBar";
import LeftSide from "@/components/shared/LeftSide";
import { Topbar } from "@/components/shared/Topbar";
import React from "react";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <Topbar></Topbar>

      <LeftSide></LeftSide>
      <section className="fex flex-1 h-screen overflow-auto">
        <Outlet />
      </section>
      <BottomBar></BottomBar>
    </div>
  );
};
