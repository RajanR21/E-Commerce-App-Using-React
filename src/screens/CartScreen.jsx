import "./CartScreen.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import {
  addToCart,
  calculatePrice,
  discountPrice,
  setCart,
  setCartDiscount,
} from "../redux/cartslices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { useState } from "react";

// Actions
// import useLogin from "../utils/hooks/useLogin";
const BASEURL = import.meta.env.VITE_BASEURL;

const CartScreen = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const token = localStorage.getItem("user");
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const [cartflg, setCartflg] = useState(localStorage.getItem("cart"));

  if (cartflg === "true") {
    localStorage.setItem("cart", "false");
    setCartflg("false");
  }
  if (token === null) {
    toast.success("You Are Not Logged in , Login First");
  }

  const getCartdata = async () => {
    console.log("token inside cartscreen", token);
    try {
      const res = await axios.get(`${BASEURL}cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("inside get cartItems", res?.data?.data?.cartItems);
      dispatch(setCart(res?.data?.data?.cartItems));
      return res?.data?.data?.cartItems;
    } catch (err) {
      console.log(err);
    }
  };

  const { data: cartItems, isSuccess: cartItemsFlag } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => await getCartdata(),
  });

  async function removeFromCartHandler(id) {
    const token = localStorage.getItem("user");
    console.log("inside delete from cart ", id);

    try {
      const res = await axios.delete(`${BASEURL}cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("inside add cart response ", res?.data);
      return res?.data;
    } catch (error) {
      throw error;
    }
  }

  const { mutate: mutateCartItemsDelete } = useMutation({
    mutationFn: (id) => removeFromCartHandler(id),

    onSuccess: (data) => {
      queryClient.invalidateQueries("cartitems");
      navigate("/cart");
      toast.success("Product Removed From Successfully");
    },

    onError: (err) => {
      handleError(err);
    },
  });

  // const { loginInfo } = useLogin();

  if (cartItemsFlag) {
    console.log(" cartItems Succefully fetched", cartItems);
  }

  const qtyChangeHandler = (product, qty) => {
    const obj = {
      product,
      qty,
    };
    dispatch(calculatePrice());
    console.log("inside add quantity", obj);
  };

  const getCartCount = () => {
    let sum = 0;
    cartItems?.map((item) => (sum += item.quantity));
    // return cartItems.length;
    return sum;
  };

  const getCartSubTotal = () => {
    dispatch(calculatePrice());

    return cart.subTotal.toFixed(2);
  };

  const handleProceedBtn = () => {
    navigate("/addressess");
    //alert("Functionality pending please stay tune, will be add soon.");
  };

  ////     Apply Coupon Code ..........................

  const handleApplyCode = async (data) => {
    const token = localStorage.getItem("user");
    console.log("coupon", token);

    try {
      const res = await axios.put(`${BASEURL}cart/applyCoupon`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        "inside apply coupon",
        res?.data?.data?.totalPriceAfterDiscount
      );
      dispatch(setCartDiscount(res?.data?.data?.totalPriceAfterDiscount));
      return res?.data?.data?.totalPriceAfterDiscount;
    } catch (err) {
      console.log(err);
    }
  };

  const { mutate: mutateApplyCode } = useMutation({
    mutationFn: (data) => handleApplyCode(data),
    onSuccess: (data) => {
      // queryClient.invalidateQueries("");
      coupenflg = true;
      dispatch(calculatePrice());
      toast.success("Product Added to caty Successfully");
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      coupen: "Good Product",
    },
  });
  // if (loginInfo.loading) return <h1>Loading.....</h1>;
  // else if (!loginInfo.loading && loginInfo.isLogin)
  return (
    <>
      <div className="cartscreen">
        <div className="cartscreen__left">
          <h2>Shopping Cart</h2>

          {cartItems === "" ? (
            <div>
              Your Cart Is Empty <Link to="/">Go Back</Link>
            </div>
          ) : (
            cartItems?.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                qtyChangeHandler={qtyChangeHandler}
                removeHandler={() => mutateCartItemsDelete(item._id)}
              />
            ))
          )}
        </div>

        <div className="cartscreen__right">
          <div className="cartscreen__info">
            <p>Total ({getCartCount()}) items</p>
            <p>Subtotal : ${getCartSubTotal()}</p>
            {cart.afterDiscount != 0 && (
              <p>Price After Discount : ${cart.afterDiscount}</p>
            )}
          </div>

          <div className="cartscreen__info mt-4">
            <p>Apply Coupen Code</p>
            <form onSubmit={handleSubmit(mutateApplyCode)}>
              <input
                {...register("coupon")}
                className=""
                // className="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />

              <button
                type="submit"
                className="bg-blue-500  mt-3 w-fit  bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Submit
              </button>
            </form>
          </div>
          <div>
            <button
              title="Functionality need to be add."
              onClick={handleProceedBtn}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartScreen;
