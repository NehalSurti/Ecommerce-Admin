import "./OrderList.css";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrdersAsync,
  deleteOrderAsync,
} from "../../redux/features/order/orderThunks";

export default function OrderList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrdersAsync());
  }, []);

  const handleDelete = (id) => {
    dispatch(deleteOrderAsync(id));
  };

  const columns = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 100,
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
      width: 100,
      valueGetter: (params) => {
        return params.row.address.Name;
      },
    },
    { field: "_id", headerName: "OrderID", width: 200 },
    { field: "userId", headerName: "UserID", width: 200 },
    { field: "amounts", headerName: "Amount", width: 100 },
    {
      field: "address",
      headerName: "Address",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <div className="addressContainer">
              <ul className="addressElementLists">
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
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <span
              className={`orderListStatus ${
                params.row.status === "delivered" ? "delivered" : ""
              }`}
            >
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
