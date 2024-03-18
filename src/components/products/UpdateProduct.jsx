import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { Api } from "../../utils/Api";
import "./AddProduct.css";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setToken, setAdminStatus } from "../../redux/authslices";
import { handleUpdateProduct } from "../../handlers/producthandler";
import { setProducts } from "../../redux/productslices";
import toast from "react-hot-toast";

//////// yup validation for the form data
let schema = yup.object({
  title: yup.string().required("Title Required"),
  images: yup.mixed().test("required", "Please upload a image", (value) => {
    return value != null;
  }),
  priceAfterDiscount: yup
    .number()
    .required("Price After Discount Required")
    .positive("Price After Discount must be a positive number"),
});

function UpdateProduct({ admin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { mutate } = useMutation({
    mutationFn: (data) => {
      return handleUpdateProduct(data, id);
    },
    onSuccess: (data) => {
      dispatch(setProducts(data));

      navigate("/products");
      toast.success("Product Updated Successfully");
    },
    onError: (err) => {
      handleError("Something went Wrong !!! Try again");
    },
  });
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      title: "iphone 13",
      priceAfterDiscount: 20,
      images: "",
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
            <p className=" text-2xl text-black">Add Product</p>
          </div>

          <form onSubmit={handleSubmit(mutate)}>
            <label className="mt-7"> Title</label>
            <input
              {...register("title")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.title?.message}</p>

            <label className=""> Images</label>
            <input
              type="file"
              multiple // To allow selecting multiple images
              accept="image/*" // To restrict file selection to image files
              {...register("images")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.images?.message}</p>

            <label className=""> Price After Discount</label>
            <input
              {...register("priceAfterDiscount")}
              type="number"
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">
              {errors.priceAfterDiscount?.message}
            </p>

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

export default UpdateProduct;
