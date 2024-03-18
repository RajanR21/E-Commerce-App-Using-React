import { useDispatch, useSelector } from "react-redux";
import "reactjs-popup/dist/index.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./screens/SignUp/signup.css";
import { useForm } from "react-hook-form";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteUser, getdata, setdata } from "./redux/demoslice";

let schema = yup.object({
  name: yup.string().required("Name required"),
  city: yup.string().required("City requcity"),
  phone: yup
    .number()
    .required("Password Required")
    .test(
      "len",
      "Password needs to be atleast 10 digits",
      (val) => !(val.toString().length < 10)
    ),
});

const Demo = () => {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState(false);
  const [tmpid, setTmpid] = React.useState(-1);
  const dispatch = useDispatch();

  //   dispatch(getdata());
  let users = useSelector((state) => state?.demo?.data);

  if (!users) {
    dispatch(setdata(JSON.parse(localStorage.getItem("users"))));
  }

  if (users?.length === 0) {
    dispatch(setdata(JSON.parse(localStorage.getItem("users"))));
  }

  let find;
  if (tmpid !== -1) {
    find = users.filter((i) => i.id === tmpid);
    console.log("data obj", find);
  }

  let defval = {
    id: "",
    name: "Rajan",
    phone: "1234567890",
    city: "Rajkot",
  };

  if (tmpid !== -1) {
    defval = find;
  }
  console.log("my data", defval);
  const { register, handleSubmit, formState, getValues, setValue } = useForm({
    defaultValues: {
      ...defval,
    },
    resolver: yupResolver(schema),
  });
  //   const users = useSelector((state) => state.users);
  const { errors } = formState;

  const handleUpdate = (formdata) => {
    console.log("update", tmpid, formdata);
    const updated = users?.map((user) => {
      if (user.id === tmpid) {
        formdata = { ...formdata, id: user.id };
        return formdata;
      } else return user;
    });

    localStorage.setItem("users", JSON.stringify(updated));
    defval = {};
    setTmpid(-1);
    dispatch(setdata(updated));
  };

  const handleAdd = (data) => {
    console.log(data);
    if (!users) users = [];
    data = { ...data, id: Math.floor(Math.random() * 1e8) };
    users = [...users, data];
    console.log("inside add", users);
    localStorage.setItem("users", JSON.stringify(users));
    dispatch(setdata(users));
    setStatus(false);
  };

  const handleDelete = (id) => {
    console.log(id);
    dispatch(deleteUser(id));
  };
  const handleClickOpen = (id) => {
    console.log(id);
    if (id !== -1) setTmpid(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        <button
          className="text-blue-500 mr-2 hover:text-blue-600 xl justify-end"
          onClick={() => handleClickOpen(-1)}
        >
          Add User
        </button>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              console.log(formJson);
              if (tmpid === -1) {
                handleAdd(formJson);
              } else {
                handleUpdate(formJson);
              }
              handleClose();
            },
          }}
        >
          <DialogTitle>Name</DialogTitle>
          <DialogContent>
            <input
              {...register("name")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors?.name?.message}</p>

            <input
              {...register("city")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors?.city?.message}</p>

            <input
              {...register("phone")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors?.phone?.message}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">{tmpid !== -1 ? "Update" : "Add"}</Button>
          </DialogActions>
        </Dialog>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">City</th>
              <th scope="col">Contact No.</th>
            </tr>
          </thead>

          {users?.map((user, ind) => (
            <tbody key={user?.id}>
              <tr>
                <th scope="row">{user?.id}</th>
                <td>{user?.name}</td>
                <td>{user?.city}</td>
                <td>{user?.phone}</td>
                <td className="flex">
                  <button
                    className="text-blue-500 mr-2 hover:text-blue-600"
                    onClick={() => handleClickOpen(user?.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(user?.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr></tr>
            </tbody>
          ))}
        </table>
      </div>
    </>
  );
};

export default Demo;
