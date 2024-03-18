import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../products/AddProduct.css";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { handleUpdateReview } from "../../handlers/reviewhandler";
import { setReview } from "../../redux/reviewslice";

//////// yup validation for the form data
let schema = yup.object({
  title: yup.string().required("Title Required"),
});

function UpdateReview() {
  const [curvalue, setValues] = useState(2);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, reviewId } = useParams();

  const { mutate } = useMutation({
    mutationFn: (data) => {
      data.ratings = curvalue;
      return handleUpdateReview(data, id, reviewId);
    },
    onSuccess: (data) => {
      //dispatch(setReview(data));

      navigate(`/admin/review/${id}`);
      toast("Review Added Successfully");
    },
    onError: (err) => {
      handleError("Something went Wrong !!! Try again");
    },
  });
  const { register, handleSubmit, formState, getValues, setValue } = useForm({
    defaultValues: {
      name: "iphone 13",
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
            <p className=" text-2xl text-black">Update Review</p>
          </div>

          <form onSubmit={handleSubmit(mutate)}>
            <label className="mt-7 justify-center ml-8"> Title</label>
            <input
              {...register("title")}
              className="ml-7 block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              // className="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <Box
              sx={{
                "& > legend": { mt: 2, ml: 5 },
              }}
            >
              <Typography component="legend">Update Ratings</Typography>
              <Rating
                size="large"
                className=" ml-10 mt-2"
                name="simple-controlled"
                {...register("ratings")}
                value={getValues("ratings")}
                onChange={(event, newValue) => {
                  setValue("ratings", newValue);
                  setValues(newValue);
                  console.log(getValues("ratings"));
                }}
              />
            </Box>

            <button
              type="submit"
              className="bg-blue-500 block mt-3 ml-10 w-50%  bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateReview;
