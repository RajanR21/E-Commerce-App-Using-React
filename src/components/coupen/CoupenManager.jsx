import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DefaultPagination } from "./DefaultPagination";
import axios from "axios";
import { setBrands } from "../../redux/brandslices";
import { handleDeleteCoupen } from "../../handlers/coupenhandler";
import { setCoupens } from "../../redux/coupenslice";

function CoupenManager() {
  const queryClint = useQueryClient();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const dispatch = useDispatch();

  //  to delete product  ..................

  const { mutate: mutateDelete } = useMutation({
    mutationFn: (data) => handleDeleteCoupen(data),
    onSuccess: (data) => {
      queryClint.invalidateQueries({
        queryKey: ["coupons"],
      });
      navigate(`/admin/coupons`);
      toast.success("Product Deleted Successfully");
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const getCoupendata = async () => {
    try {
      const res = await axios.get(`${BASEURL}coupons`);
      console.log("inside get coupons", res?.data?.data);
      dispatch(setCoupens(res?.data?.data));
      return res?.data?.data;
    } catch (err) {
      console.log(err);
    }
  };

  const token = localStorage.getItem("user");
  const { data: coupons } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => await getCoupendata(),
    enabled: !!token,
    keepPreviousData: true,
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">All Coupens</h2>
        <Link
          to={"/admin/addcoupon"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Coupen
        </Link>
        <ul className="divide-y divide-gray-200 mt-4">
          {coupons?.map((coupen) => (
            <li key={coupen._id} className="py-4 flex items-center">
              <span className="text-lg">
                {coupen.name} : Discount is {coupen.discount}
              </span>
              <div className="ml-auto">
                <Link
                  to={`/admins/updatecoupon/${coupen._id}`}
                  className="text-blue-500 mr-2 hover:text-blue-600"
                >
                  Edit
                </Link>
                <Link
                  onClick={() => mutateDelete(coupen._id)}
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

export default CoupenManager;
