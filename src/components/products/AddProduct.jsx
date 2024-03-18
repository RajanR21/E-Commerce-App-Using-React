import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// import { Api } from "../../utils/Api";
import "./AddProduct.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { handleAddProduct } from "../../handlers/producthandler";
import { setProducts } from "../../redux/productslices";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { setBrands } from "../../redux/brandslices";
import { setSubCategories } from "../../redux/subcategoryslice";
import { setCategories } from "../../redux/categoryslices";
import axios from "axios";
import { Option, Select } from "@material-tailwind/react";
const BASEURL = import.meta.env.VITE_BASEURL;

//////// yup validation for the form data
let schema = yup.object({
  title: yup.string().required("Title Required"),
  description: yup.string().required("Description Required"),
  quantity: yup.string().required("Quantity Required"),
  images: yup.mixed().test("required", "Please upload a image", (value) => {
    return value != null;
  }),
  priceAfterDiscount: yup
    .number()
    .required("Price After Discount Required")
    .positive("Price After Discount must be a positive number"),
  imageCover: yup.mixed().test("required", "Please upload a image", (value) => {
    return value != null;
  }),
  price: yup
    .number()
    .required("Price Required")
    .positive("Price must be a positive number"),
});

function AddProduct({ admin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: (data) => {
      return handleAddProduct(data);
    },
    onSuccess: (data) => {
      dispatch(setProducts(data));

      navigate("/products");
      toast.success("Product Added Successfully");
    },
    onError: (err) => {
      handleError("Something went Wrong !!! Try again");
    },
  });

  const getCategorydata = async () => {
    try {
      const res = await axios.get(`${BASEURL}categories`);
      console.log("inside get categories", res?.data?.categories);
      dispatch(setCategories(res?.data?.categories));
      return res?.data?.categories;
    } catch (err) {
      console.log(err);
    }
  };

  const { data: categories, isSuccess: categoriesFlag } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategorydata(),
  });

  const getSubCategorydata = async () => {
    try {
      const res = await axios.get(`${BASEURL}subcategories`);
      console.log("inside get subcategories", res?.data?.subcategories);
      dispatch(setSubCategories(res?.data?.subcategories));
      return res?.data?.subcategories;
    } catch (err) {
      console.log(err);
    }
  };

  const { data: subcategories, isSuccess: subcategoriesFlag } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => await getSubCategorydata(),
  });

  const getBranddata = async () => {
    try {
      const res = await axios.get(`${BASEURL}brands`);
      console.log("inside get brands", res?.data?.data);
      dispatch(setBrands(res?.data?.data));
      return res?.data?.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => await getBranddata(),
    keepPreviousData: true,
  });

  const { register, handleSubmit, formState, getValues, setValue } = useForm({
    defaultValues: {
      title: "",
      description:
        "give your pup the nutrition and flavor he loves with the Kibbles 'n Bits Original Savory Beef & Chicken Flavors Dry Dog Food. This formula packs plenty of meaty taste into",
      quantity: 30,
      price: 40,
      priceAfterDiscount: 20,
      imageCover: "",
      images: [],
      categories: "",
      brand: "",
      subcategories: [],
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;
  return (
    <div className="signupscreen">
      <div className="container mt-5 pl-96 ml-24">
        <div className="innerContainer ">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <p className=" text-2xl text-black">Add Product</p>
          </div>

          <form onSubmit={handleSubmit(mutate)}>
            <label className="mt-7"> Title</label>
            <input
              {...register("title")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.title?.message}</p>
            <label className=""> Description</label>
            <input
              {...register("description")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">
              {errors.description?.message}
            </p>
            <label className=""> Quantity</label>
            <input
              {...register("quantity")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.quantity?.message}</p>
            <label className=""> Images</label>
            <input
              type="file"
              multiple // To allow selecting multiple images
              accept="image/*" // To restrict file selection to image files
              {...register("images")}
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.images?.message}</p>

            <label className=""> Price After Discount</label>
            <input
              {...register("priceAfterDiscount")}
              type="number"
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">
              {errors.priceAfterDiscount?.message}
            </p>

            <label className=""> Image Cover</label>
            <input
              type="file"
              {...register("imageCover")}
              accept="image/*" // To restrict file selection to image files
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.imageCover?.message}</p>

            <label className="mt-2">Category</label>
            <div className="">
              {categories && (
                <Select
                  color="blue"
                  label="Select Category"
                  defaultValue="All"
                  selected={(element) =>
                    element &&
                    React.cloneElement(element, {
                      disabled: true,
                      className:
                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                    })
                  }
                >
                  {categories?.map((category) => (
                    <Option
                      key={category.name}
                      value={category._id}
                      {...register("category")}
                      onClick={(e) => {
                        setValue("category", category._id);
                      }}
                    >
                      {category?.name}
                    </Option>
                  ))}
                </Select>
              )}
              <label className="mt-2">Brand</label>
              {brands && (
                <Select
                  color="purple"
                  label="Select Brand"
                  defaultValue="All"
                  selected={(element) =>
                    element &&
                    React.cloneElement(element, {
                      disabled: true,
                      className:
                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                    })
                  }
                >
                  {brands?.map((brand, ind) => (
                    <Option
                      value={brand._id}
                      {...register("brand")}
                      onClick={(e) => {
                        setValue("brand", brand._id);
                      }}
                    >
                      {brand.name}
                    </Option>
                  ))}
                </Select>
              )}

              <label className="mt-2 mb-2">SubCategory</label>
              {subcategories && (
                <Select
                  size="lg"
                  label="Select Subcategory"
                  selected={(element) =>
                    element &&
                    React.cloneElement(element, {
                      disabled: true,
                      className:
                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                    })
                  }
                >
                  {subcategories.map((subcategory) => (
                    <Option
                      key={subcategory.name}
                      value={subcategory._id}
                      className="flex items-center gap-2"
                      {...register("subcategories")}
                      onClick={(e) => {
                        const tmp = getValues("subcategories");
                        tmp.push(subcategory._id);
                        setValue("subcategories", tmp);
                      }}
                    >
                      {subcategory.name}
                    </Option>
                  ))}
                </Select>
              )}
            </div>

            <label className=""> Price</label>
            <input
              {...register("price")}
              type="number"
              className="block w-50% rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="text-red-500 text-sm">{errors.price?.message}</p>

            <button
              type="submit"
              className="bg-blue-500 block mt-3 w-50%  bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
