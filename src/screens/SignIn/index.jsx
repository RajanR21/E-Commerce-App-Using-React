import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
// import { Api } from "../../utils/Api";
import "./signIn.css";
import { useMutation } from "@tanstack/react-query";
import { handleAdminLogin, handleSignIn } from "../../handlers/authhandlers";
import { useDispatch } from "react-redux";
import { setToken, setAdminStatus } from "../../redux/authslices";
import toast from "react-hot-toast";

//////// yup validation for the form data

let schema = yup.object({
  password: yup
    .string()
    .required("Password Required")
    .test(
      "len",
      "Password needs to be atleast 8 digits",
      (val) => !(val.toString().length < 8)
    ),

  email: yup.string().required("Email required").email("Invalid email address"),
});

function Index({ admin }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("user");

  if (token != null) {
    toast.success("You are already Logged in");
    // return;
  }
  const dispatch = useDispatch();
  const { mutate } = useMutation({
    mutationFn: (data) => {
      return admin === false ? handleSignIn(data) : handleAdminLogin(data);
    },
    onSuccess: (data) => {
      dispatch(setToken(data?.token));
      toast.success(
        admin === false ? "Sign in Successfully" : "Admin Login Successfull"
      );

      localStorage.setItem("role", data?.user?.role);
      navigate("/products", { flg: true });
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.response.data.errors[0].msg);
      // handleError("Something went Wrong !!! Try again");
    },
  });
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      password: "123456789",
      email: "example@gmail.com",
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;
  return (
    <div className="signupscreen">
      {!token ? (
        <div className="container mt-5 pl-96">
          <div className="innerContainer ">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <p className=" text-2xl text-black">Sign IN</p>
            </div>

            <form onSubmit={handleSubmit(mutate)}>
              <label className=""> Email</label>
              <input
                {...register("email")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
              <label className="mt-7"> Password</label>
              <input
                {...register("password")}
                className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <p className="text-red-500 text-sm">{errors.password?.message}</p>

              <button
                type="submit"
                className="bg-blue-500 block mt-3 w-50%  bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <h1>You are already Logged in</h1>
      )}
    </div>
  );
}

export default Index;
