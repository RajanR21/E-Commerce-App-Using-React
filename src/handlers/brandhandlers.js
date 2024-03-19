import axios from "axios";
const BASEURL = import.meta.env.VITE_BASEURL;

//  add brand .........................

export async function handleAddBrand(data) {
  data.image = data.image[0];
  const token = localStorage.getItem("user");
  console.log("inside add brand ", data);

  try {
    const res = await axios.post(`${BASEURL}brands`, data, {
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

//  Update brand .........................

export async function handleUpdateBrand(data, id) {
  data.image = data.image[0];
  const token = localStorage.getItem("user");
  console.log("inside update brand", data);

  try {
    const res = await axios.put(`${BASEURL}brands/${id}`, data, {
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

//  delete brand .........................

export async function handleDeleteBrand(data) {
  const token = localStorage.getItem("user");

  console.log("inside delete brand handler", data, token);
  try {
    const res = await axios.delete(`${BASEURL}brands/${data}`, {
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

export async function SelectBrand(id, data) {
  // const token = (localStorage.getItem("user"));
  if (id === "All") return data;
  console.log("inside select brand handler", id, data);
  try {
    const res = await axios.get(`${BASEURL}?brands=${id}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
