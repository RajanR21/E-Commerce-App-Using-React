import axios from "axios";
const BASEURL = import.meta.env.VITE_BASEURL;

//  add To Cart .........................

export async function handleAddToCart(data) {
  const token = localStorage.getItem("user");
  console.log("inside add to cart ", data);

  try {
    const res = await axios.post(`${BASEURL}cart/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("inside add cart response ", res?.data?.data);
    return res?.data?.data?.cartItems;
  } catch (error) {
    throw error;
  }
}

export async function handleUpdateToCart(quantity, id) {
  const obj = { quantity };
  console.log(id);
  const token = localStorage.getItem("user");
  // console.log("inside update to cart ", data);

  try {
    const res = await axios.put(`${BASEURL}cart/${id}`, obj, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("inside update cart response ", res?.data?.data);
    return res?.data?.data;
  } catch (error) {
    throw error;
  }
}
