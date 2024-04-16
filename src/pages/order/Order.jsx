import "./Order.css";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  getOrdersAsync,
  updateOrderAsync,
} from "../../redux/features/order/orderThunks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../../services/ToastOptions";

export default function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [updatedOrder, setUpdatedOrder] = useState({});
  const [orderProducts, setOrderProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  let formattedDate;

  const orderId = location.pathname.split("/")[2];
  const { orders } = useSelector((state) => state.order);
  const { products } = useSelector((state) => state.product);
  const order = orders.find((order) => order._id === orderId);

  if (order && order.createdAt) {
    const createdAt = new Date(order.createdAt);
    const day = createdAt.getDate();
    const month = createdAt.getMonth() + 1;
    const year = createdAt.getFullYear();
    formattedDate = `${day}/${month}/${year}`;
  }

  useEffect(() => {
    dispatch(getOrdersAsync());
  }, []);

  useEffect(() => {
    setUpdatedOrder(order);
    const updatedOrderProducts = order?.products.map((product) => {
      const orderProduct = products.find(
        (pdt) => pdt._id === product.productId
      );
      return {
        ...product,
        img: orderProduct.img,
        title: orderProduct.title,
      };
    });
    setOrderProducts(updatedOrderProducts);
  }, [order, products]);

  useEffect(() => {
    if (order && orderProducts.length > 0) {
      const allProductsDelivered = orderProducts.every(
        (product) => product.status === "delivered"
      );
      if (allProductsDelivered) {
        setUpdatedOrder((prev) => {
          return { ...prev, status: "delivered", products: [...orderProducts] };
        });
      } else {
        setUpdatedOrder((prev) => {
          return { ...prev, status: "pending", products: [...orderProducts] };
        });
      }
    }
  }, [orderProducts]);

  function handleChange(productId, status) {
    setOrderProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => {
        if (product.productId === productId) {
          return {
            ...product,
            status: status,
          };
        } else {
          return product;
        }
      });
      return updatedProducts;
    });
  }

  async function handleClick() {
    setLoading(true);
    try {
      const updOrd = await dispatch(
        updateOrderAsync({
          id: orderId,
          orderUpdate: updatedOrder,
        })
      );
      if (updOrd.payload) {
        setLoading(false);
        toast.success("Order updated successfully!", toastOptions);
      } else {
        setLoading(false);
        toast.error("Error updating Order", toastOptions);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error updating Order", toastOptions);
    }
  }

  const columns = [
    {
      field: "productId",
      headerName: "ProductId",
      width: 200,
      renderCell: (params) => {
        return (
          <div
            onClick={() => navigate(`/product/${params.row.productId}`)}
            className="orderProductItem"
          >
            {params.row.productId}
          </div>
        );
      },
    },
    {
      field: "product",
      headerName: "Product",
      width: 350,
      renderCell: (params) => {
        return (
          <div className="orderProductItem">
            <img className="orderProductImg" src={params.row.img} alt=""></img>
            <div className="orderProductTitle">{params.row.title}</div>
          </div>
        );
      },
    },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "color", headerName: "Color", width: 100 },
    { field: "size", headerName: "Size", width: 80 },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: "TotalPrice",
      headerName: "Total Price",
      width: 100,
      valueGetter: (params) => {
        const totalPrice = params.row.quantity * params.row.price;
        return totalPrice;
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="orderItemStatus">
            <select
              name="status"
              id="status"
              onChange={(e) =>
                handleChange(params.row.productId, e.target.value)
              }
              value={params.row.status}
              className={params.row.status === "delivered" ? "delivered" : ""}
            >
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="order">
        {!updatedOrder || !updatedOrder.address ? (
          <div className="loadingIndicator"></div>
        ) : (
          <>
            <div className="orderTop">
              <div className="orderTitleContainer">
                <h1 className="orderTitle">Order Summary</h1>
              </div>
              <div className="orderSummary">
                <div className="orderInfoItem">
                  <span className="orderInfoKey">Order Id:</span>
                  <span className="orderInfoValue">{updatedOrder._id}</span>
                </div>
                <div className="orderInfoItem">
                  <span className="orderInfoKey">User Id:</span>
                  <span className="orderInfoValue">{updatedOrder.userId}</span>
                </div>
                <div className="orderInfoItem">
                  <span className="orderInfoKey">Address:</span>
                  <div className="orderInfoValue">
                    <ul className="orderAddressElementLists">
                      <li className="orderAddressElementList">
                        {updatedOrder.address?.Add}
                      </li>
                      <li className="orderAddressElementList">
                        {updatedOrder.address?.Country}
                      </li>
                      <li className="orderAddressElementList">
                        {updatedOrder.address?.Postcode}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="orderInfoItem">
                  <span className="orderInfoKey">Amount:</span>
                  <span className="orderInfoValue">{updatedOrder.amounts}</span>
                </div>
                <div className="orderInfoItem">
                  <span className="orderInfoKey">Status:</span>
                  <span
                    className={`orderInfoValue orderInfoStatus ${
                      updatedOrder && updatedOrder.status === "delivered"
                        ? "delivered"
                        : ""
                    }`}
                  >
                    {updatedOrder &&
                      updatedOrder.status &&
                      updatedOrder.status.charAt(0).toUpperCase() +
                        updatedOrder.status.slice(1)}
                  </span>
                </div>
                <div className="orderInfoItem">
                  <span className="orderInfoKey">Date:</span>
                  <span className="orderInfoValue">{formattedDate}</span>
                </div>
                <div className="updateOrderBottom">
                  <button onClick={handleClick} className="orderButton">
                    Update Status
                  </button>
                </div>
              </div>
            </div>
            <div className="orderBottom">
              <DataGrid
                rows={orderProducts}
                columns={columns}
                getRowHeight={() => "auto"}
                getRowId={(row) => row._id}
                disableRowSelectionOnClick
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 7 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
              />
            </div>
          </>
        )}
        {loading && <div className="loadingIndicator"></div>}
      </div>
      <ToastContainer />
    </>
  );
}
