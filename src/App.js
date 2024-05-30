import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import Home from "./pages/home/Home";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newuser/NewUser";
import ProductList from "./pages/productlist/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newproduct/NewProduct";
import Login from "./pages/login/Login";
import OrderList from "./pages/orderlist/OrderList";
import Order from "./pages/order/Order";
import UserRequestResponseInterceptor from "./utils/requestMethods";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthAsync } from "./redux/features/auth/authThunks";
import { useEffect, useState } from "react";
// import { checkTokenAndLoginAsync } from "./redux/features/user/userThunks";

// Component for sidebar layout
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
  const dispatch = useDispatch();
  const [userChecked, setUserChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    setLoading(true);
    async function tokenCheck() {
      try {
        const authStatus = await dispatch(
          checkAuthAsync({ TOKEN: user.token })
        );

        if (authStatus.payload) {
          setUserChecked(true);
        } else {
          setUserChecked(false);
        }
      } catch (error) {
        setUserChecked(false);
      } finally {
        setLoading(false);
      }
    }
    tokenCheck();
  }, [user]);

  // useEffect(() => {
  //   setLoading(true);
  //   const userDetail = localStorage.getItem("persist:rootReactApp");
  //   const userToken = JSON.parse(JSON.parse(userDetail).user).currentUser.token;

  //   async function tokenAndLoginCheck() {
  //     try {
  //       const tokenCheckStatus = await dispatch(
  //         checkTokenAndLoginAsync({ TOKEN: userToken })
  //       );

  //       if (tokenCheckStatus.payload) {
  //         setUserChecked(true);
  //       } else {
  //         setUserChecked(false);
  //       }
  //     } catch (error) {
  //       setUserChecked(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   tokenAndLoginCheck();
  // }, []);

  return (
    <>
      <Routes>
        {user && userChecked && (
          <>
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route element={<SidebarLayout />}>
              <Route path="/users" element={<UserList />} />
              <Route path="/user/:userid" element={<User />} />
              <Route path="/newUser" element={<NewUser />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:productid" element={<Product />} />
              <Route path="/newProduct" element={<NewProduct />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/order/:orderid" element={<Order />} />
              <Route path="/" element={<Home />} />
              <Route path="/*" element={<Navigate to="/" />} />
            </Route>
          </>
        )}
        {!loading && (!user || !userChecked) && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
      <UserRequestResponseInterceptor />
    </>
  );
}

export default App;
