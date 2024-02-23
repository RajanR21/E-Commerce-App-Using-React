import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { Api } from "../../utils/Api";
import "../products/AddProduct.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { handleUpdateCategory } from "../../handlers/categoryhandler";
import { setCategories } from "../../redux/categoryslices";
import toast from "react-hot-toast";
import axios from "axios";

//////// yup validation for the form data
let schema = yup.object({
  name: yup.string().required("Title Required"),

  image: yup.mixed().test("required", "Please upload a image", (value) => {
    return value != null;
  }),
});

function UpdateCategory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const getCategorydata = async () => {
    try {
      const res = await axios.get(`${BASEURL}categories/${id}`);
      console.log("inside get categories", res?.data?.data);
      dispatch(setCategories(res?.data?.data));
      return res?.data?.data;
    } catch (err) {
      console.log(err);
    }
  };

  const token = localStorage.getItem("user");
  const { data: categories, isSuccess: categoriesFlag } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategorydata(),
    enabled: !!token,
    keepPreviousData: true,
  });

  const { mutate } = useMutation({
    mutationFn: (data) => {
      return handleUpdateCategory(data, id);
    },
    onSuccess: (data) => {
      toast.success("Category Added Successfully");
      dispatch(setCategories(data));
      navigate("/admin/category");
    },
    onError: (err) => {
      handleError("Something went Wrong !!! Try again");
    },
  });
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: categories?.name || "",
      image: "",
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;
  return (
    <div className="signupscreen">
      <div className="container mt-5 pl-96 ml-24">
        <div className="innerContainer ">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <p className=" text-2xl text-black">Update Category</p>
          </div>

          <form onSubmit={handleSubmit(mutate)}>
            <label className="mt-7"> Name</label>
            <input
              {...register("name")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>

            <label className=""> Image</label>
            <input
              type="file"
              multiple // To allow selecting multiple images
              accept="image/*" // To restrict file selection to image files
              {...register("image")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.image?.message}</p>

            <button
              type="submit"
              className="bg-blue-500 block mt-3 w-50%  bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateCategory;
