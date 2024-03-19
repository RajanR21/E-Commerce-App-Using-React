import axios from "axios";
const BASEURL = import.meta.env.VITE_BASEURL;

//  add coupon .........................

export async function handleAddCoupen(data) {
  const token = localStorage.getItem("user");
  console.log("inside add coupon ", data);

  try {
    const res = await axios.post(`${BASEURL}coupons`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res?.data?.data);
    return res?.data?.data;
  } catch (error) {
    throw error;
  }
}

//  Update coupon .........................

export async function handleUpdateCoupen(data, id) {
  const token = localStorage.getItem("user");
  console.log("inside update coupon", data, id);

  try {
    const res = await axios.put(`${BASEURL}coupons/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("success update coupen", res?.data?.data);
    return res?.data?.data;
  } catch (error) {
    throw error;
  }
}

//  delete coupon .........................

export async function handleDeleteCoupen(data) {
  const token = localStorage.getItem("user");

  console.log("inside delete coupon handler", data, token);
  try {
    const res = await axios.delete(`${BASEURL}coupons/${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function SelectCoupen(id, data) {
  // const token = (localStorage.getItem("user"));
  if (id === "All") return data;
  console.log("inside select coupon handler", id, data);
  try {
    const res = await axios.get(`${BASEURL}?coupons=${id}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
