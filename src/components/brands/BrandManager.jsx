import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DefaultPagination } from "./DefaultPagination";
import axios from "axios";
import { handleDeleteBrand } from "../../handlers/brandhandlers";
import { setBrands } from "../../redux/brandslices";
import toast from "react-hot-toast";

function BrandManager() {
  const queryClint = useQueryClient();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const [active, setActive] = React.useState(1);
  const dispatch = useDispatch();

  //  to delete product  ..................

  const { mutate: mutateDelete } = useMutation({
    mutationFn: (data) => handleDeleteBrand(data),
    onSuccess: (data) => {
      queryClint.invalidateQueries({
        queryKey: ["brands"],
      });
      toast.success("Product Deleted Successfully");
      navigate(`/admin/brands?page=${active}`);
    },
    onError: (err) => {
      handleError(err);
    },
  });

  const getBranddata = async () => {
    try {
      const res = await axios.get(`${BASEURL}brands?page=${active}`);
      console.log("inside get brands", res?.data?.data);
      dispatch(setBrands(res?.data?.data));
      return res?.data?.data;
    } catch (err) {
      console.log(err);
    }
  };

  const token = localStorage.getItem("user");
  const { data: brands, isSuccess: categoriesFlag } = useQuery({
    queryKey: ["brands", active],
    queryFn: async () => await getBranddata(),
    keepPreviousData: true,
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Brand Manager</h2>
        <Link
          to={"/admin/addbrand"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Brand
        </Link>
        <ul className="divide-y divide-gray-200 mt-4">
          {brands?.map((brand) => (
            <li key={brand._id} className="py-4 flex items-center">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <span className="text-lg">{brand.name}</span>
              <div className="ml-auto">
                <Link
                  to={`/admin/updatecategory/${brand._id}`}
                  className="text-blue-500 mr-2 hover:text-blue-600"
                >
                  Edit
                </Link>
                <Link
                  onClick={() => mutateDelete(brand._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </Link>
              </div>
            </li>
          ))}
        </ul>
        {brands?.length > 0 ? (
          <DefaultPagination setActive={setActive} active={active} />
        ) : (
          <h3>No Brands</h3>
        )}
      </div>
    </div>
  );
}

export default BrandManager;
