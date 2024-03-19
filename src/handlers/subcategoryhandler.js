import axios from "axios";
const BASEURL = import.meta.env.VITE_BASEURL;

//  add subcategory .........................

export async function handleAddSubCategory(data, id) {
  console.log(data);
  const obj = {
    ...data,
    category: id,
  };
  const token = localStorage.getItem("user");
  console.log("inside add subcategory ", obj);

  try {
    const res = await axios.post(`${BASEURL}subcategories`, obj, {
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

//  Update subcategory .........................

export async function handleUpdateSubCategory(data, id) {
  data.image = data.image[0];
  const token = localStorage.getItem("user");
  console.log("inside update subcategory", data);

  try {
    const res = await axios.put(`${BASEURL}subcategories/${id}`, data, {
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

//  delete subcategory .........................

export async function handleDeleteSubCategory(data) {
  const token = localStorage.getItem("user");

  console.log("inside delete subcategory handler", data, token);
  try {
    const res = await axios.delete(`${BASEURL}subcategories/${data}`, {
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

export async function SelectSubCategory(id, data) {
  // const token = (localStorage.getItem("user"));
  if (id === "All") return data;
  console.log("inside select subcategory handler", id, data);
  try {
    const res = await axios.get(`${BASEURL}products/?category=${id}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
