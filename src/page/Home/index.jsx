import "./home.css";
import "./loader.css";

import { Outlet } from "react-router-dom";
import Header from "../../component/Header";
import NavBar from "../../component/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchFirebaseData } from "../../features/fireBase";
import { fetchCategory } from "../../features/category";
import Loader from "./Loader";

export default function index() {
  const dispatch = useDispatch();
  const {status, error } = useSelector((state) => state.firebase);

  useEffect(() => {
    dispatch(fetchFirebaseData());
    dispatch(fetchCategory());
  }, [dispatch]);

  if (status === "loading") {
    return (
     <Loader />
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Header />
      <NavBar />
      <Outlet />
    </>
  );
}
