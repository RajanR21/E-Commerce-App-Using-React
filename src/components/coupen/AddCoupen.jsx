import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleAddCoupen } from "../../handlers/coupenhandler";

//////// yup validation for the form data
let schema = yup.object({
  name: yup.string().required("Name Required"),
  expire: yup.string().required("Expire Required"),
  discount: yup.number(),
});

function AddCoupen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: (data) => {
      return handleAddCoupen(data);
    },
    onSuccess: (data) => {
      navigate("/admin/coupons");
      toast("Coupons Added Successfully");
    },
    onError: (err) => {
      handleError("Something went Wrong !!! Try again");
    },
  });

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: "",
      expire: "",
      discount: "",
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
            <p className=" text-2xl text-black">Add Coupons</p>
          </div>

          <form onSubmit={handleSubmit(mutate)}>
            <label className="mt-7"> Name</label>
            <input
              {...register("name")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>

            <label className="mt-7"> Expire</label>
            <input
              {...register("expire")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.expire?.message}</p>

            <label className="mt-7"> Discount</label>
            <input
              {...register("discount")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.discount?.message}</p>

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

export default AddCoupen;
