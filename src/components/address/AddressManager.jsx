import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { setWishList } from "../../redux/wishlistslice";

function AddressManager() {
  const { id } = useParams();
  const queryClint = useQueryClient();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const dispatch = useDispatch();

  //  to delete item  ..................

  async function handleDeleteAddress(data) {
    const token = localStorage.getItem("user");

    console.log("inside delete item from address handler", data, token);

    try {
      const res = await axios.delete(`${BASEURL}addressess/${data}`, {
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
    mutationFn: (data) => handleDeleteAddress(data),
    onSuccess: (data) => {
      queryClint.invalidateQueries({
        queryKey: ["address"],
      });
      navigate(`/addressess`);
      toast.success("Product Deleted Successfully");
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const getAddressdata = async () => {
    const token = localStorage.getItem("user");
    try {
      const res = await axios.get(`${BASEURL}addressess`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("inside get address", res?.data?.data);
      // dispatch(setA(res?.data?.data));
      return res?.data?.data;
    } catch (err) {
      console.log(err);
    }
  };

  const token = localStorage.getItem("user");
  const { data: address, isSuccess: categoriesFlag } = useQuery({
    queryKey: ["address"],
    queryFn: async () => await getAddressdata(),
    enabled: !!token,
    keepPreviousData: true,
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Your All Addresses</h2>
        <Link
          to={"/addaddress"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Address
        </Link>
        <ul className="divide-y divide-gray-200 mt-4">
          {address?.map((item) => (
            <>
              <li key={item._id} className="py-4 flex items-center">
                <span className="text-lg">{item.details}</span>
                <div className="ml-auto">
                  <Link
                    onClick={() => mutateDelete(item._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </Link>
                </div>
              </li>
            </>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddressManager;
