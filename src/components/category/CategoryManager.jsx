import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setCategories } from "../../redux/categoryslices";
import { DefaultPagination } from "./DefaultPagination";
import axios from "axios";
import { handleDeleteCategory } from "../../handlers/categoryhandler";
import toast from "react-hot-toast";
const IMGURL = import.meta.env.VITE_IMGURL;

function CategoryManager() {
  const queryClint = useQueryClient();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const [active, setActive] = React.useState(1);
  const dispatch = useDispatch();

  //  to delete product  ..................

  const { mutate: mutateDelete } = useMutation({
    mutationFn: (data) => handleDeleteCategory(data),
    onSuccess: (data) => {
      queryClint.invalidateQueries({
        queryKey: ["categories"],
      });
      toast.success("Category Deleted Successfully");
      navigate(`/admin/categories?page=${active}`);
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const getCategorydata = async () => {
    try {
      const res = await axios.get(`${BASEURL}categories?page=${active}`);
      console.log("inside get categories", res?.data?.categories);
      dispatch(setCategories(res?.data?.categories));
      return res?.data?.categories;
    } catch (err) {
      console.log(err);
    }
  };

  const token = localStorage.getItem("user");
  const { data: categories, isSuccess: categoriesFlag } = useQuery({
    queryKey: ["categories", active],
    queryFn: async () => await getCategorydata(),
    enabled: !!token,
    keepPreviousData: true,
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Category Manager</h2>
        <Link
          to={`/admin/addcategory`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Category
        </Link>
        <ul className="divide-y divide-gray-200 mt-4">
          {categories?.map((category) => (
            <li key={category._id} className="py-4 flex items-center">
              <img
                src={`${category.image}`}
                alt={category.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <span className="text-lg">{category.name}</span>
              <div className="ml-auto">
                <Link
                  to={`/admin/updatecategory/${category._id}`}
                  className="text-blue-500 mr-2 hover:text-blue-600"
                >
                  Edit
                </Link>
                <Link
                  onClick={() => mutateDelete(category._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </Link>
                <Link
                  to={`/admin/viewsubcategory/${category._id}`}
                  className="text-blue-500 mr-2 ml-2 hover:text-blue-600"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
        {categories?.length > 0 ? (
          <DefaultPagination setActive={setActive} active={active} />
        ) : (
          <h3>No Categories</h3>
        )}
      </div>
    </div>
  );
}

export default CategoryManager;
