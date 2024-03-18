import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { setBlog } from "./blog";
import BlogItem from "./BlogItem";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFindUser } from "../Handlers/loginHandler";
import Useritem from "./UserItem";

function FindUser() {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => handleFindUser(),
  });

  // console.log(data.data);

  return <>{data && <Useritem user={data?.data} />}</>;
}

export default FindUser;
