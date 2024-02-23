import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import SideDrawer from "./components/SideDrawer";
import Backdrop from "./components/Backdrop";

// Screens
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import GetAllUsers from "./components/getusers/GetAllUsers";
import GetAllProducts from "./components/products/GetAllProducts";
import AddProduct from "./components/products/AddProduct";
import UpdateProduct from "./components/products/UpdateProduct";
import CategoryManager from "./components/category/CategoryManager";
import AddCategory from "./components/category/AddCategory";
import UpdateCategory from "./components/category/UpdateCategory";
import BrandManager from "./components/brands/BrandManager";
import AddBrand from "./components/brands/AddBrand";
import UpdateBrand from "./components/brands/UpdateBrand";
import ViewSubCategory from "./components/subcategory/ViewSubCategory";
import AddSubCategory from "./components/subcategory/AddSubCategory";
import ReviewManager from "./components/reviews/ReviewManager";
import UpdateReview from "./components/reviews/UpdateReview";
import WishListManager from "./components/wishlist/WishListManager";
import AddressManager from "./components/address/AddressManager";
import AddAddress from "./components/address/AddAddress";
import CoupenManager from "./components/coupen/CoupenManager";
import AddCoupen from "./components/coupen/AddCoupen";
import UpdateCoupen from "./components/coupen/UpdateCoupen";
import NotFound from "./screens/NotFound";
import { Toaster } from "react-hot-toast";
// import { fetchCart } from "./redux/actions/cartActions";
// import { setUserDeatils } from "./redux/actions/userAction";

function App() {
  const [sideToggle, setSideToggle] = useState(false);
  return (
    <Router>
      <Toaster />
      <Navbar click={() => setSideToggle(true)} />
      <SideDrawer show={sideToggle} click={() => setSideToggle(false)} />
      <Backdrop show={sideToggle} click={() => setSideToggle(false)} />

      <main className="app">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn admin={false} />} />
          <Route path="/adminlogin" element={<SignIn admin={true} />} />
          <Route path="/users" element={<GetAllUsers />} />
          <Route path="/products" element={<GetAllProducts />} />
          <Route path="/admin/addproduct" element={<AddProduct />} />
          <Route path="/admin/updateproduct/:id" element={<UpdateProduct />} />
          <Route path="/admin/addcategory" element={<AddCategory />} />
          <Route path="/admin/category" element={<CategoryManager />} />
          <Route
            path="/admin/updatecategory/:id"
            element={<UpdateCategory />}
          />
          <Route path="/admin/brands" element={<BrandManager />} />
          <Route path="/admin/addbrand" element={<AddBrand />} />
          <Route path="/admin/updatebrand/:id" element={<UpdateBrand />} />
          <Route
            path="/admin/viewsubcategory/:id"
            element={<ViewSubCategory />}
          />
          <Route
            path="/admin/addsubcategory/:id"
            element={<AddSubCategory />}
          />
          <Route path="/admin/review/:id" element={<ReviewManager />} />
          <Route path="/wishlist" element={<WishListManager />} />
          <Route
            path="/admin/updatereview/:id/:reviewId"
            element={<UpdateReview />}
          />
          <Route path="/addressess" element={<AddressManager />} />
          <Route path="/addaddress" element={<AddAddress />} />
          <Route path="/admin/coupons" element={<CoupenManager />} />
          <Route path="/admin/addcoupon" element={<AddCoupen />} />
          <Route path="/admin/updatecoupon/:id" element={<UpdateCoupen />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
