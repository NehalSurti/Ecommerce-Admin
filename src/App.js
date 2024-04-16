import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newuser/NewUser";
import ProductList from "./pages/productlist/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newproduct/NewProduct";
import Login from "./pages/login/Login";
import { useEffect, useState } from "react";
import loader from "./assets/loader.gif";
import { userRequest } from "./utils/requestMethods";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderList from "./pages/orderlist/OrderList";
import Order from "./pages/order/Order";

const SidebarLayout = () => (
  <>
    <Topbar />
    <div className="container">
      <Sidebar />
      <Outlet />
    </div>
  </>
);

function App() {
  // const [adminLogin, setAdminLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, isFetching, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const adminLogin = currentUser?.isAdmin;

  async function tokenVerify(token) {
    try {
      const response = await userRequest.get("/auth/tokenVerify");
      return response.data.status;
    } catch (err) {
      console.log("response status = false");
      return false;
    }
  }

  // console.log("currentUser", currentUser);

  // useEffect(() => {
  //   try {
  //     let tv;
  //     console.log("token = ", currentUser.token);
  //     // if (
  //     //   JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
  //     //     .currentUser
  //     // ) {
  //     //   tv = tokenVerify(
  //     //     JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
  //     //       .currentUser.token
  //     //   );
  //     // }

  //     if (currentUser) {
  //       let tk = currentUser.token;
  //       tv = tokenVerify(tk);
  //     } else {
  //       tv = false;
  //     }

  //     if (tv) {
  //       const admin = JSON.parse(
  //         JSON.parse(localStorage.getItem("persist:root")).user
  //       ).currentUser.isAdmin;
  //       setAdminLogin(admin);
  //     } else {
  //       const admin = false;
  //       setAdminLogin(admin);
  //       console.log("admin 1 = false");
  //       // localStorage.removeItem("persist:root");
  //     }
  //   } catch (err) {
  //     const admin = false;
  //     setAdminLogin(admin);
  //     console.log(err);
  //     console.log("admin 2 = false");
  //     // localStorage.removeItem("persist:root");
  //   }

  //   setIsLoading(false);
  //   console.log("admin check useEffet");
  // }, []);

  // useEffect(()=>{
  //   if(adminLogin === true)
  // },[adminLogin]);

  // useEffect(() => {
  //   console.log("navigate useEffet");
  //   if (!isLoading && !currentUser && !adminLogin) {
  //     navigate("/login"); // Navigate to login if not logged in or not admin
  //   }
  // }, []);

  // useEffect(() => {
  //   console.log("navigate 2 useEffet");
  //   console.log("isLoading",isLoading);
  //   console.log("currentUser",currentUser);
  //   console.log("adminLogin",adminLogin);
  //   if (!isLoading && currentUser && adminLogin) {
  //     console.log("navigate 2 inside useEffet");
  //     navigate("/"); // Navigate to login if not logged in or not admin
  //   }
  // }, [currentUser,isLoading,adminLogin]);

  return (
    <>
      {isLoading ? (
        <div className="loaderContainer">
          <img src={loader} alt="loader" className="loader" />
        </div>
      ) : (
        // <BrowserRouter>
        <Routes>
          {/* {currentUser ? (
            <Route path="/login" element={<Navigate to="/" />} />
          ) : (
            <Route path="/login" element={<Login />} />
          )} */}
          {/* <Route path="/login" element={currentUser ? <Home /> : <Login />} /> */}
          {<Route path="/login" element={<Login />} />}
          {/* {<Route path="/" element={<Home />} />} */}
          {adminLogin ? (
            <Route element={<SidebarLayout />}>
              <Route path="/users" element={<UserList />} />
              <Route path="/user/:userid" element={<User />} />
              <Route path="/newUser" element={<NewUser />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:productid" element={<Product />} />
              <Route path="/newProduct" element={<NewProduct />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/order/:orderid" element={<Order />} />
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/" element={<Home />} />
            </Route>
          ) : (
            <Route path="/*" element={<Navigate to="/login" />} />
          )}
        </Routes>
        // </BrowserRouter>
      )}
    </>
  );
}

export default App;
