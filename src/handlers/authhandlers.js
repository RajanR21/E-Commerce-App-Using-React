import axios from "axios";
const BASEURL = import.meta.env.VITE_BASEURL;

//  Sign up form.........................

export async function handleSignUp(data) {
  console.log("inside signup handler", data);
  try {
    const res = await axios.post(`${BASEURL}auth/signup`, data);
    console.log(res.data);
    // localStorage.setItem("user", res.data.token);

    return res.data;
  } catch (error) {
    throw error;
  }
}

// Sign In form .................

export async function handleSignIn(data) {
  console.log("inside signin handler", data);
  try {
    const res = await axios.post(`${BASEURL}auth/login_user`, data);
    console.log(res.data);
    localStorage.setItem("user", res.data.token);
    return res.data;
  } catch (error) {
    throw error;
  }
}

//  // Sign In for Admin  .................

export async function handleAdminLogin(data) {
  console.log("inside adminlogin handler", data);
  try {
    const res = await axios.post(`${BASEURL}auth/login_admin`, data);
    console.log(res.data);
    localStorage.setItem("user", res.data.token);
    return res.data;
  } catch (error) {
    throw error;
  }
}

// error handler.............................

export function handleError(err) {
  console.log(err);
  toast.error(err.response.data.message);
}
