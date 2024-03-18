import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { setSubCategories } from "../../redux/subcategoryslice";
import { handleDeleteSubCategory } from "../../handlers/subcategoryhandler";
import { useDispatch } from "react-redux";
import axios from "axios";
import { DefaultPagination } from "./DefaultPagination";
import toast from "react-hot-toast";

const ViewSubCategory = () => {
  const { id } = useParams();
  console.log(id === "65c62b727b1a7ed846cd7ab6");
  const queryClint = useQueryClient();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const [active, setActive] = React.useState(1);
  const dispatch = useDispatch();
  //// get subcategoey data .........................

  const getSubCategorydata = async () => {
    const categoryID = id;
    try {
      const res = await axios.get(
        `${BASEURL}categories/${categoryID}/subcategories?page=${active}`
      );
      console.log("inside get subcategories", res?.data?.subcategories);
      dispatch(setSubCategories(res?.data?.subcategories));
      return res?.data?.subcategories;
    } catch (err) {
      console.log(err);
    }
  };

  const token = localStorage.getItem("user");
  const { data: subcategories, isSuccess: categoriesFlag } = useQuery({
    queryKey: ["subcategories", active],
    queryFn: async () => await getSubCategorydata(),
    enabled: !!token,
    keepPreviousData: true,
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: (data) => handleDeleteSubCategory(data),
    onSuccess: (data) => {
      queryClint.invalidateQueries({
        queryKey: ["subcategories"],
      });
      // navigate(`/viewcategories?`);

      toast.success("Product Deleted Successfully");
    },
    onError: (err) => {
      handleError(err);
    },
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">SubCategory Manager</h2>
        <Link
          to={`/admin/addsubcategory/${id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Add SubCategory
        </Link>
        <ul className="divide-y divide-gray-200 mt-4">
          {subcategories?.map((subcategory) => (
            <li key={subcategory._id} className="py-4 flex items-center">
              <img
                src={subcategory.image}
                alt={subcategory.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <span className="text-lg">{subcategory.name}</span>
              <div className="ml-auto">
                <Link
                  to={`/admin/updatecategory/${subcategory._id}`}
                  className="text-blue-500 mr-2 hover:text-blue-600"
                >
                  Edit
                </Link>
                <Link
                  onClick={() => mutateDelete(subcategory._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </Link>
              </div>
            </li>
          ))}
        </ul>
        {subcategories?.length > 0 ? (
          <DefaultPagination setActive={setActive} active={active} />
        ) : (
          <h3>No SubCategories</h3>
        )}
      </div>
    </div>
  );
};

export default ViewSubCategory;
