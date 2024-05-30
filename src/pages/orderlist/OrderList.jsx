import "./OrderList.css";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrdersAsync,
  deleteOrderAsync,
} from "../../redux/features/order/orderThunks";
import { getAllUsersAsync } from "../../redux/features/user/userThunks";

export default function OrderList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { users } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getOrdersAsync());
    dispatch(getAllUsersAsync());
  }, []);

  const handleDelete = (id) => {
    dispatch(deleteOrderAsync(id));
  };

  const columns = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 80,
      valueGetter: (params) => {
        const createdAt = new Date(params.row.createdAt);
        const day = createdAt.getDate();
        const month = createdAt.getMonth() + 1;
        const year = createdAt.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
      },
    },
    {
      field: "nameId",
      headerName: "Name",
      width: 80,
      valueGetter: (params) => {
        const user = users.find((user) => user._id === params.row.userId);
        return user ? user.fullName : "Unknown";
      },
    },
    { field: "_id", headerName: "OrderID", width: 190 },
    { field: "userId", headerName: "UserID", width: 200 },
    {
      field: "amounts",
      headerName: "Amount",
      width: 80,
      valueGetter: (params) => {
        return `₹${params.row.amounts}`;
      },
    },
    {
      field: "address",
      headerName: "Address",
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <div className="addressContainer">
              <ul className="addressElementLists">
                <li className="addressElementList">
                  {params.row.address.Name}
                </li>
                <li className="addressElementList">{params.row.address.Add}</li>
                <li className="addressElementList">
                  {params.row.address.Country}
                </li>
                <li className="addressElementList">
                  {params.row.address.Postcode}
                </li>
              </ul>
            </div>
          </>
        );
      },
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      width: 70,
      valueGetter: (params) => {
        return params.row.paymentMethod ? params.row.paymentMethod : "NA";
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <span
              className={`orderListPaymentStatus ${params.row.paymentStatus}`}
            >
              {params.row.paymentStatus.charAt(0).toUpperCase() +
                params.row.paymentStatus.slice(1)}
            </span>
          </>
        );
      },
    },
    {
      field: "status",
      headerName: "Order Status",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <span className={`orderListStatus ${params.row.status}`}>
              {params.row.status.charAt(0).toUpperCase() +
                params.row.status.slice(1)}
            </span>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => navigate("/order/" + params.row._id)}
              className="orderListEdit"
            >
              Details
            </button>
            <DeleteOutlineIcon
              onClick={() => handleDelete(params.row._id)}
              className="orderListDelete"
            ></DeleteOutlineIcon>
          </>
        );
      },
    },
  ];
  return (
    <div className="orderList">
      <DataGrid
        className="orderListDataGrid"
        rows={orders}
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
  );
}
