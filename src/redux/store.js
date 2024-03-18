import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslices.js";
import productReducer from "./productslices.js";
import categoryReducer from "./categoryslices.js";
import subcategoryReducer from "./subcategoryslice.js";
import cartReducer from "./cartslices.js";
import brandReducer from "./brandslices.js";
import reviewReducer from "./reviewslice.js";
import wishlistReducer from "./wishlistslice.js";
import coupenReducer from "./coupenslice.js";
import demoReducer from "./demoslice.js";
// it will autmatically generate a reducer same as we have in useReducer hook

const store = configureStore({
  reducer: {
    auth: authReducer, // all reducer will be in this store
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
    brand: brandReducer,
    subcategory: subcategoryReducer,
    review: reviewReducer,
    wishlist: wishlistReducer,
    coupen: coupenReducer,
    demo: demoReducer,
  },
});

export default store;
