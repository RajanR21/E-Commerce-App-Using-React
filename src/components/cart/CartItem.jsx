import { useDispatch, useSelector } from "react-redux";
import "./CartItem.css";
import { Link } from "react-router-dom";
import { handleUpdateToCart } from "../../handlers/carthandlers";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { calculatePrice, setCart } from "../../redux/cartslices";

const CartItem = ({ item, removeHandler }) => {
  const queryClient = useQueryClient();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const token = localStorage.getItem("user");
  const dispatch = useDispatch();

  const getCartdata = async () => {
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

  const { mutate: mutateCartItemsUpdate } = useMutation({
    mutationFn: (quantity) => handleUpdateToCart(quantity, item._id),
    onSuccess: (data) => {
      queryClient.invalidateQueries("cartItems");
      dispatch(setCart(data?.cartItems));
      dispatch(calculatePrice());
      navigate("/cart");
      toast.success("Product Added to caty Successfully");
    },
    onError: (err) => {
      handleError(err);
    },
  });
  // console.log("insdie cart item", item);
  return (
    <div className="cartitem">
      <p>{item?.product?.title}</p>
      <p className="cartitem__price">${item?.product?.price}</p>
      <select
        value={(e) => e?.target?.value}
        onChange={(e) => mutateCartItemsUpdate(e.target.value)}
        className="cartItem__select"
      >
        {[...Array(5).keys()].map((x) => (
          <option key={x + 1} value={x + 1}>
            {x + 1}
          </option>
        ))}
      </select>
      <button
        className="cartItem__deleteBtn"
        onClick={() => removeHandler(item._id)}
      >
        <i className="fas fa-trash">Remove</i>
      </button>
    </div>
  );
};

export default CartItem;
