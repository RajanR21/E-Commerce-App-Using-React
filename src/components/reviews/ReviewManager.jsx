import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { DefaultPagination } from "./DefaultPagination";
import axios from "axios";
import { setReview } from "../../redux/reviewslice";
import { handleDeleteReview } from "../../handlers/reviewhandler";

function ReviewManager() {
  const { id } = useParams();
  const queryClint = useQueryClient();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const [active, setActive] = useState(1);
  const dispatch = useDispatch();
  // const isAdmin = useSelector((state) => state.auth.isAdmin);
  const role = localStorage.getItem("role");

  //  to delete review  ..................

  const { mutate: mutateDelete } = useMutation({
    mutationFn: (data) => handleDeleteReview(data),
    onSuccess: (data) => {
      queryClint.invalidateQueries({
        queryKey: ["reviews"],
      });
      navigate(`/reviews?page=${active}`);
      toast.success("Product Deleted Successfully");
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const getCategorydata = async () => {
    try {
      const res = await axios.get(
        `${BASEURL}products/${id}/reviews?page=${active}`
      );
      console.log("inside get reviews", res?.data?.data);
      dispatch(setReview(res?.data?.data));
      return res?.data?.data;
    } catch (err) {
      console.log(err);
    }
  };

  const token = localStorage.getItem("user");
  const { data: reviews, isSuccess: categoriesFlag } = useQuery({
    queryKey: ["reviews", active],
    queryFn: async () => await getCategorydata(),
    enabled: !!token,
    keepPreviousData: true,
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Review Manager</h2>

        <ul className="divide-y divide-gray-200 mt-4">
          {reviews?.map((review) => (
            <li key={review._id} className="py-4 items-center">
              <li>
                <span className="text-xl">
                  Reviewed by : {review.user.name}
                </span>
              </li>
              <li>
                <span className="text-lg">
                  Product : {review.product.title}
                </span>
              </li>

              <li>
                <span className="text-lg text-blue-700">{review.title}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm">Ratings : {review.ratings}</span>
                <div className="ml-auto">
                  {role === "admin" && (
                    <>
                      <Link
                        to={`/admin/updatereview/${id}/${review._id}`}
                        className="text-blue-500 mr-2 hover:text-blue-600"
                      >
                        Edit
                      </Link>
                      <Link
                        onClick={() => mutateDelete(review._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </Link>
                    </>
                  )}
                </div>
              </li>
            </li>
          ))}
        </ul>
        {reviews?.length > 0 ? (
          <DefaultPagination setActive={setActive} active={active} />
        ) : (
          <h3>No Reviews</h3>
        )}
      </div>
    </div>
  );
}

export default ReviewManager;
