import "./Navbar.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useState } from "react";
// import { logout } from "../utils/localstorage";
// import { setInitialState } from "../redux/actions/userAction";

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("user"));
  const reduxToken = useSelector((state) => state.auth.token);
  const cart = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const { cartItems } = cart;

  const getCartCount = () => {
    return cartItems.length;
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken("");
    toast.success("Logged out Successfully");
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <h2>E-COMMERCE WEBSITE</h2>
      </div>

      <ul className="navbar__links">
        <li>
          {role === "user" && (
            <Link to="/cart" className="cart__link">
              <i className="fas fa-shopping-cart"></i>
              <span>
                Cart <span className="cartlogo__badge">{getCartCount()}</span>
              </span>
            </Link>
          )}
        </li>

        <li>
          {role === "user" && (
            <Link className="cart__link" to="/wishlist">
              <i className="fas fa-shopping-cart"></i>WishList
            </Link>
          )}
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          {!reduxToken && <Link to="/signIn">Sign-In</Link>}
          {reduxToken && <Link onClick={handleLogout}>LogOut</Link>}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
