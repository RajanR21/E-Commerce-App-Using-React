import axios from "axios";
const BASEURL = import.meta.env.VITE_BASEURL;

//  add category .........................

export async function handleAddCategory(data) {
  data.image = data.image[0];
  const token = localStorage.getItem("user");
  console.log("inside add category ", data);

  try {
    const res = await axios.post(`${BASEURL}categories`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res?.data?.data);
    return res?.data?.data;
  } catch (error) {
    throw error;
  }
}

//  Update category .........................

export async function handleUpdateCategory(data, id) {
  data.image = data.image[0];
  const token = localStorage.getItem("user");
  console.log("inside update category", data);

  try {
    const res = await axios.put(`${BASEURL}categories/${id}`, data, {
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

//  delete category .........................

export async function handleDeleteCategory(id) {
  const token = localStorage.getItem("user");

  console.log("inside delete category handler", id, token);
  try {
    const res = await axios.delete(`${BASEURL}categories/${id}`, {
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

export async function SelectCategory(id, data) {
  // const token = (localStorage.getItem("user"));
  if (id === "All") return data;
  console.log("inside select category handler", id, data);
  try {
    const res = await axios.get(`${BASEURL}products/?category=${id}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
