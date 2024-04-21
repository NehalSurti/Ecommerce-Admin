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
import ProtectedRoutes from "./components/protectedRoutes/ProtectedRoutes";

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
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoutes>
              <SidebarLayout />
            </ProtectedRoutes>
          }
        >
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
      </Routes>
      <UserRequestResponseInterceptor />
    </>
  );
}

export default App;
