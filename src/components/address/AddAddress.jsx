import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//////// yup validation for the form data
const BASEURL = import.meta.env.VITE_BASEURL;

let schema = yup.object({
  alias: yup.string().required("Alias Required"),
  details: yup.string().required("Details Required"),
  phone: yup.string().required("Phone Required"),
  city: yup.string().required("City Required"),
  postalCode: yup.string().required("Postal Code Required"),
});

function AddAddress() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleAddAddress(data) {
    const token = localStorage.getItem("user");
    console.log("inside add to addressess ", data);

    try {
      const res = await axios.post(`${BASEURL}addressess/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("inside add addressess response ", res?.data?.data);
      return res?.data?.data;
    } catch (error) {
      throw error;
    }
  }

  const { mutate } = useMutation({
    mutationFn: (data) => {
      return handleAddAddress(data);
    },
    onSuccess: (data) => {
      navigate("/addressess");
      toast("Address Added Successfully");
    },
    onError: (err) => {
      handleError("Something went Wrong !!! Try again");
    },
  });

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      alias: "town",
      details: "985 Pinnickinnick Street",
      phone: "615-827-2462",
      city: "Sayreville",
      postalCode: "08872",
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
            <p className=" text-2xl text-black">Add Address</p>
          </div>

          <form onSubmit={handleSubmit(mutate)}>
            <label className="mt-7"> Alias</label>
            <input
              {...register("alias")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.alias?.message}</p>

            <label className="mt-7"> Details</label>
            <input
              {...register("details")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.details?.message}</p>

            <label className="mt-7"> Phone</label>
            <input
              {...register("phone")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.phone?.message}</p>

            <label className="mt-7"> City</label>
            <input
              {...register("city")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.city?.message}</p>

            <label className="mt-7"> Postal Code</label>
            <input
              {...register("postalCode")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.postalCode?.message}</p>

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

export default AddAddress;
