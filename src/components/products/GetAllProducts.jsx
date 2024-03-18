import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import axios from "axios";
import Product from "./Product.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../redux/productslices.js";
import { Select, Option, Button } from "@material-tailwind/react";
import { setCategories } from "../../redux/categoryslices.js";
import { useForm } from "react-hook-form";
import { setSubCategories } from "../../redux/subcategoryslice.js";
import { setBrands } from "../../redux/brandslices.js";
import { DefaultPagination } from "./DefaultPagination.jsx";

const BASEURL = import.meta.env.VITE_BASEURL;
const IMGURL = import.meta.env.VITE_IMGURL;

function GetAllProducts() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("user");
  const [active, setActive] = React.useState(1);
  const ratings = ["1", "2", "3", "4", "5"];
  const params = useParams();
  console.log(window.location);


  const getProductdata = async () => {
    const data = getValues();
    let url = `${BASEURL}products`;
    let sort = data.sortt;
    
    if (sort === "true") {
      url += `?sortedBy=price`;
      url += `&page=${active}`;
      url += `&limit=${5}`;
    } else {
      console.log("inside getproduct data form obj", getValues());

      if (data.brand || data.category || data.subcategory || data.ratings)
        url += "?";

      if (data?.category) {
        url += `category=${data?.category}`;
        if (data?.brand) url += `&brand=${data?.brand}`;
        if (data?.subcategory) url += `&subCategory=${data?.subcategory}`;
        if (data?.ratings) url += `&ratingsAverage[gte]=${data.ratings}`;
      } else if (data?.brand) {
        url += `brand=${data?.brand}`;
        if (data?.category) url += `&category=${data?.category}`;
        if (data?.subcategory) url += `&brand=${data?.subcategory}`;
        if (data?.ratings) url += `&ratingsAverage[gte]=${data.ratings}`;
      } else if (data?.subcategory) {
        url += `subCategory=${data.subcategory}`;
        if (data?.category) url += `&category=${data?.category}`;
        if (data?.brand) url += `&brand=${data?.brand}`;
        if (data?.ratings) url += `&ratingsAverage[gte]=${data.ratings}`;
      } else if (data?.ratings) {
        url += `ratingsAverage[gte]=${data.ratings}`;
        if (data?.category) url += `&category=${data?.category}`;
        if (data?.brand) url += `&brand=${data?.brand}`;
        if (data?.subcategory) url += `&brand=${data?.subcategory}`;
      }

      if (
        data.brand === "" &&
        data.category === "" &&
        data.subcategory === "" &&
        data.ratings === ""
      )
        url += `?page=${active}`;
      else url += `&page=${active}`;
      url += `&limit=${5}`;

      console.log(url);
    }
    try {
      const res = await axios.get(url);
      dispatch(setProducts(res?.data?.data));
      return res?.data?.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { data: products, isSuccess: productsFlag } = useQuery({
    queryKey: ["products", active],
    queryFn: async () => await getProductdata(),
    keepPreviousData: true,
  });

  if (productsFlag) {
    console.log("Products fatched ", products);
  }

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

  if (categoriesFlag) {
    console.log("Categories fatched ", categories);
  }

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    defaultValues: {
      category: "",
      price: 40,
      subcategory: "",
      brand: "",
      ratings: "",
      sortt: "false",
    },
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

  let productDataByCategory = useSelector(
    (state) => state?.category?.products?.data
  );
  function check() {
    if (productDataByCategory) return true;
    else return false;
  }

  function handlesort() {
    setValue("sortt", "true");
    queryClient.invalidateQueries("products");
  }

  const onSubmit = () => {
    setValue("sortt", "false");
    queryClient.invalidateQueries("products");
  };

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

  const role = localStorage.getItem("role");
  // console.log("brand mili", brands);
  return (
    <>
      <div className="bg-white flex">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex  justify-between">
            <div>
              {role === "admin" ? (
                <>
                  <Link
                    to={`/admin/addproduct/`}
                    className="bg-black text-white p-3 ml-3"
                  >
                    Add Product
                  </Link>
                  <Link
                    className=" bg-black text-white p-3 ml-3  "
                    to={"/admin/category"}
                  >
                    Categories
                  </Link>
                  <Link
                    className=" bg-black text-white p-3 ml-3  "
                    to={"/admin/brands"}
                  >
                    Brands
                  </Link>
                  <Link
                    className=" bg-black text-white p-3 ml-3  "
                    to={"/admin/coupons"}
                  >
                    Coupens
                  </Link>
                </>
              ) : (
                <>
                  <h2>All Products</h2>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {check() === false
              ? products?.map((product, ind) => (
                  <Product
                    key={ind}
                    imageUrl={product.images}
                    description={product.description}
                    price={product.price}
                    name={product.title}
                    productId={product._id}
                  />
                ))
              : productDataByCategory?.map((product, ind) => (
                  <Product
                    key={ind}
                    imageUrl={product.images}
                    description={product.description}
                    price={product.price}
                    name={product.title}
                    productId={product._id}
                  />
                ))}
          </div>

          {products?.length > 0 ? (
            <DefaultPagination setActive={setActive} active={active} />
          ) : (
            <h3>No Products Found</h3>
          )}
        </div>

        <div className="mx-auto max-w-1xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex  justify-between">
            <div className="flex">
              <p className=" bg-black text-white p-3  " to={"/addproduct"}>
                Filter Products
              </p>

              <button
                className=" bg-black text-white p-3 ml-3 "
                onClick={handlesort}
              >
                Sort By Price
              </button>
            </div>
          </div>

          <div className="mt-6  ">
            <form
              className="flex w-72 flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
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
                      value={category.slug}
                      {...register("category")}
                      onClick={(e) => {
                        setValue("category", category.slug);
                      }}
                    >
                      {category?.name}
                    </Option>
                  ))}
                </Select>
              )}
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
                      key={ind}
                      value={brand.slug}
                      {...register("brand")}
                      onClick={(e) => {
                        setValue("brand", brand.slug);
                      }}
                    >
                      {brand.name}
                    </Option>
                  ))}
                </Select>
              )}

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
                      value={subcategory.slug}
                      className="flex items-center gap-2"
                      {...register("subcategory")}
                      onClick={(e) => {
                        setValue("subcategory", subcategory.slug);
                      }}
                    >
                      {subcategory.name}
                    </Option>
                  ))}
                </Select>
              )}

              {ratings && (
                <Select
                  size="lg"
                  label="Minimum Rating"
                  selected={(element) =>
                    element &&
                    React.cloneElement(element, {
                      disabled: true,
                      className:
                        "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                    })
                  }
                >
                  {ratings.map((rating, ind) => (
                    <Option
                      key={ind}
                      value={rating}
                      className="flex items-center gap-2"
                      {...register("ratings")}
                      onClick={(e) => {
                        setValue("ratings", rating);
                      }}
                    >
                      {rating}
                    </Option>
                  ))}
                </Select>
              )}
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
    </>
  );
}

export default GetAllProducts;

{
  /* <Select color="blue" label="Select SubCategory" defaultValue="">
                  <Option
                    value=""
                    {...register("subcategory")}
                    onClick={(e) => {
                      setValue("subcategory", "");
                    }}
                  >
                    All
                  </Option>
                  {subcategories?.map((subcategory) => (
                    <Option
                      value={subcategory.slug}
                      {...register("subcategory")}
                      onClick={(e) => {
                        setValue("subcategory", subcategory.slug);
                      }}
                    >
                      {subcategory.name}
                    </Option>
                  ))}
                </Select> */
}
