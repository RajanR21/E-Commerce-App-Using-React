import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { setWishList } from "../../redux/wishlistslice";
import toast from "react-hot-toast";

function WishListManager() {
  const { id } = useParams();
  const queryClint = useQueryClient();
  const BASEURL = import.meta.env.VITE_BASEURL;
  // const [active, setActive] = useState(1);
  const dispatch = useDispatch();

  //  to delete item  ..................

  async function handleDeleteFromWishList(data) {
    const token = localStorage.getItem("user");

    console.log("inside delete item from wishlist handler", data, token);

    try {
      const res = await axios.delete(`${BASEURL}wishlist/${data}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  const { mutate: mutateDelete } = useMutation({
    mutationFn: (data) => handleDeleteFromWishList(data),
    onSuccess: (data) => {
      queryClint.invalidateQueries({
        queryKey: ["wishlist"],
      });
      toast.success("Product Deleted Successfully");
      navigate(`/wishlist`);
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const getWishListdata = async () => {
    const token = localStorage.getItem("user");
    try {
      const res = await axios.get(`${BASEURL}wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("inside get wishlist", res?.data?.data);
      dispatch(setWishList(res?.data?.data));
      return res?.data?.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { data: wishlist, isSuccess: categoriesFlag } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => await getWishListdata(),
    keepPreviousData: true,
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Your WishList</h2>

        <ul className="divide-y divide-gray-200 mt-4">
          {wishlist?.map((item) => (
            <li key={item._id} className="py-4 flex items-center">
              <span className="text-lg">{item.title}</span>
              <div className="ml-auto">
                <Link
                  onClick={() => mutateDelete(item._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WishListManager;
