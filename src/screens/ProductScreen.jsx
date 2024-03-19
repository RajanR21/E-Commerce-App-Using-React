import { Button } from "@material-tailwind/react";
import "./ProductScreen.css";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleDeleteProduct } from "../handlers/producthandler";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { handleAddToCart } from "../handlers/carthandlers.js";
import { useForm } from "react-hook-form";
import { handleAddReview } from "../handlers/reviewhandler.js";
import axios from "axios";
import toast from "react-hot-toast";
const BASEURL = import.meta.env.VITE_BASEURL;
const IMGURL = import.meta.env.VITE_IMGURL;
// Actions

const ProductScreen = () => {
  const token = localStorage.getItem("user");
  const [curvalue, setValues] = useState(2);
  const role = localStorage.getItem("role");
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const getCartdata = async () => {
    const res = await axios.get(`${BASEURL}cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("inside get cartItems", res?.data?.data?.cartItems);
    dispatch(setCart(res?.data?.data?.cartItems));
    return res?.data?.data?.cartItems;
  };

  const { data: cartItems, isSuccess: cartItemsFlag } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => await getCartdata(),
  });

  const getProduct = async () => {
    console.log("single prod", id);
    // console.log(`${BASEURL}products/${id}`);
    const res = await axios.get(`${BASEURL}products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("inside get single product", res?.data?.data);
    return res?.data?.data;
  };

  const {
    data: product,
    isSuccess: productflg,
    isError: ProductError,
  } = useQuery({
    queryKey: ["singleproduct"],
    queryFn: async () => await getProduct(),
  });

  if (productflg) {
    console.log("yes", product);
  }

  const { mutate: mutateProducts } = useMutation({
    mutationFn: (data) => handleDeleteProduct(data),
    onSuccess: (data) => {
      navigate("/products");
      toast.success("Product Deleted Successfully");
    },
    onError: (err) => {
      handleError(err);
    },
  });
  const { mutate: mutateCartItemsAdd } = useMutation({
    mutationFn: (data) => handleAddToCart(data),
    onSuccess: (data) => {
      toast.success("Successfully Added!");
      localStorage.setItem("cart", "true");
      // navigate("/cart");
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const addToCartHandler = (id) => {
    // toast.success("andr haiiii");
    console.log("add to cart");
    console.log("screen", product);
    const obj = {
      product,
      productId: product._id,
      color: "pink",
      quantity: 1,
    };
    mutateCartItemsAdd(obj);
    // navigate("/cart");
    // if (user.userInfo.isLogin) {
    //   dispatch(addToCart(product._id, qty))
    //   history.push(`/cart`)
    //   return
    // } else {
    //   alert('You need to first login.')
    // }
  };

  //////// Adddd product to wishlist ..................

  async function addToWishListHandler() {
    const id = product._id;
    // console.log("wishlist id ", id);

    const token = localStorage.getItem("user");
    const obj = { product: id };
    console.log("inside add to wishlist ", obj);

    try {
      const res = await axios.post(`${BASEURL}wishlist`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res?.data?.data);
      toast.success("Added to WishList");
      return res?.data?.data;
    } catch (error) {
      throw error;
    }
  }

  const { register, handleSubmit, setValue, formState, getValues } = useForm({
    defaultValues: {
      title: "Good Product",
      ratings: "3",
    },
  });

  const { mutate: mutateReviews } = useMutation({
    mutationFn: (data) => {
      data.ratings = curvalue;
      return handleAddReview(data, id);
    },
    onSuccess: (data) => {
      //   dispatch(setCategories(data));
      // navigate(`/viewsubcategory/${id}`);
      toast.success("Review Added Successfully");
    },
    onError: (err) => {
      handleError("Something went Wrong !!! Try again");
    },
  });

  return (
    <>
      <div className="productscreen">
        {product && (
          /* loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : ( */
          <>
            <div className="productscreen__left">
              <div className="left__image">
                <img
                  src={`${IMGURL}${product?.images[0]}`}
                  alt={product?.title}
                />
              </div>
              <div className="left__info">
                <p className="left__name">{product?.title}</p>
                <p>Price: ${product?.price}</p>
                <p>Description: {product?.description}</p>
                {role == "admin" && (
                  <>
                    <Button
                      color="black"
                      className=" mt-1"
                      onClick={() => mutateProducts(product?._id)}
                    >
                      Delete
                    </Button>

                    <Link
                      className=" bg-black text-white p-3 ml-4 mt-1 rounded-lg"
                      to={`/admin/updateproduct/${product?._id}`}
                    >
                      Update Product
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="productscreen__right justify-center">
              {
                <div className="right__info">
                  <p>
                    Price:
                    <span>${product?.price}</span>
                  </p>
                  <p>
                    Status:
                    <span>
                      {product?.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </p>
                  {role == "user" && (
                    <p>
                      <button type="button" onClick={addToCartHandler}>
                        Add To Cart
                      </button>

                      <button
                        type="button"
                        className=" mt-3"
                        onClick={addToWishListHandler}
                      >
                        Add To WishList
                      </button>
                    </p>
                  )}

                  {role == "user" && (
                    <form onSubmit={handleSubmit(mutateReviews)}>
                      <input
                        {...register("title")}
                        className="ml-7"
                        // className="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <Box
                        sx={{
                          "& > legend": { mt: 2, ml: 5 },
                        }}
                      >
                        <Typography component="legend">
                          Review Product
                        </Typography>
                        <Rating
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
                  )}
                </div>
              }

              <Link
                className=" bg-black text-white p-3 ml-8  mt-1 rounded-lg"
                to={`admin/review/${product._id}`}
              >
                View All Reviews
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductScreen;
