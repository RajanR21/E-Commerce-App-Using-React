import axios from "axios";
const BASEURL = import.meta.env.VITE_BASEURL;

//  add review .........................

export async function handleAddReview(data, id) {
  const token = localStorage.getItem("user");
  const obj = { ...data, product: id };
  console.log("inside add review ", obj);

  try {
    const res = await axios.post(`${BASEURL}reviews`, obj, {
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

//  Update review .........................

export async function handleUpdateReview(data, id, reviewId) {
  const token = localStorage.getItem("user");
  console.log("inside update review", data);

  try {
    const res = await axios.put(`${BASEURL}reviews/${reviewId}`, data, {
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

//  delete review .........................

export async function handleDeleteReview(data) {
  const token = localStorage.getItem("user");

  console.log("inside delete review handler", data, token);

  try {
    const res = await axios.delete(`${BASEURL}reviews/${data}`, {
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

export async function SelectReview(id, data) {
  // const token = (localStorage.getItem("user"));
  if (id === "All") return data;
  console.log("inside select review handler", id, data);
  try {
    const res = await axios.get(`${BASEURL}reviews/${id}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
