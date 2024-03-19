import axios from "axios";
const BASEURL = import.meta.env.VITE_BASEURL;

//  add product .........................

export async function handleAddProduct(data) {
  data.imageCover = data.imageCover[0];
  data.images = data.images[0];
  const token = localStorage.getItem("user");
  console.log("inside add product", data);

  try {
    const res = await axios.post(`${BASEURL}products`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data);
    // localStorage.setItem("user", res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

//  Update product .........................

export async function handleUpdateProduct(data, id) {
  // data.imageCover = data.imageCover[0];
  data.images = data.images[0];
  const token = localStorage.getItem("user");
  console.log(data);

  try {
    const res = await axios.put(`${BASEURL}products/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

//  delete product .........................

export async function handleDeleteProduct(data) {
  const token = localStorage.getItem("user");

  console.log("inside delete product handler", data, token);
  try {
    const res = await axios.delete(`${BASEURL}products/${data}`, {
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
