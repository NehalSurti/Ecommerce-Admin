import "./Order.css";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { userRequest } from "../../utils/requestMethods";
import { updateOrderAsync } from "../../redux/features/order/orderThunks";

export default function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [updatedOrder, setUpdatedOrder] = useState({});
  const [orderProducts, setOrderProducts] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const orderId = location.pathname.split("/")[2];
  const { orders } = useSelector((state) => state.order);
  const { products } = useSelector((state) => state.product);
  const order = orders.find((order) => order._id === orderId);
  console.log(order.products);

  const createdAt = new Date(order.createdAt);
  const day = createdAt.getDate();
  const month = createdAt.getMonth() + 1;
  const year = createdAt.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

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
        status: "pending",
      };
    });
    setOrderProducts(updatedOrderProducts);
  }, [order]);

  function handleChange(e) {
    setUpdatedOrder((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleClick(e) {
    e.preventDefault();
    dispatch(
      updateOrderAsync({
        id: orderId,
        orderUpdate: updatedOrder,
      })
    )
      .then(() => {
        // Dispatch successful, show success popup
        setShowSuccessPopup(true);
      })
      .catch((error) => {
        // Handle dispatch error
        console.error("Error adding product:", error);
      });
  }

  const columns = [
    {
      field: "productId",
      headerName: "ProductId",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="orderProductItem">
            {params.row.productId}
          </div>
        );
      },
    },
    {
      field: "product",
      headerName: "Product",
      width: 300,
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
    { field: "size", headerName: "Size", width: 100 },
    { field: "price", headerName: "Price", width: 150 },
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
              onChange={handleChange}
              value={params.row.status}
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
    <div className="order">
      <div className="orderTop">
        <div className="orderTitleContainer">
          <h1 className="orderTitle">Order Summary</h1>
        </div>
        <div className="orderSummary">
          <div className="orderInfoItem">
            <span className="orderInfoKey">Order Id:</span>
            <span className="orderInfoValue">{order._id}</span>
          </div>
          <div className="orderInfoItem">
            <span className="orderInfoKey">User Id:</span>
            <span className="orderInfoValue">{order.userId}</span>
          </div>
          <div className="orderInfoItem">
            <span className="orderInfoKey">Address:</span>
            <div className="orderInfoValue">
              <ul className="orderAddressElementLists">
                <li className="orderAddressElementList">{order.address.Add}</li>
                <li className="orderAddressElementList">
                  {order.address.Country}
                </li>
                <li className="orderAddressElementList">
                  {order.address.Postcode}
                </li>
              </ul>
            </div>
          </div>
          <div className="orderInfoItem">
            <span className="orderInfoKey">Amount:</span>
            <span className="orderInfoValue">{order.amounts}</span>
          </div>
          <div className="orderInfoItem">
            <span className="orderInfoKey">Status:</span>
            <span className="orderInfoValue">{order.status}</span>
          </div>
          <div className="orderInfoItem">
            <span className="orderInfoKey">Date:</span>
            <span className="orderInfoValue">{formattedDate}</span>
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
      {showSuccessPopup && (
        <div className="successPopup">
          <p>Order status updated!</p>
          <button onClick={() => setShowSuccessPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
