import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";


const FinanceHome = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default FinanceHome;
