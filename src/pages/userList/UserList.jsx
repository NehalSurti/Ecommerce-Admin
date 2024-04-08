import "./UserList.css";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsersAsync,
  deleteUserAsync,
} from "../../redux/features/user/userThunks";

export default function UserList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsersAsync());
  }, []);

  const handleDelete = (id) => {
    dispatch(deleteUserAsync(id));
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    {
      field: "username",
      headerName: "User",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.img} alt=""></img>
            {params.row.username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "isAdmin",
      headerName: "IsAdmin",
      width: 80,
      valueGetter: (params) => {
        return params.row.isAdmin ? "True" : "False";
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
    { field: "phone", headerName: "Phone", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 80,
      valueGetter: (params) => {
        return (
          params.row.status.charAt(0).toUpperCase() + params.row.status.slice(1)
        );
      },
    },
    {
      field: "transactions",
      headerName: "Transaction Vol.",
      width: 130,
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => navigate("/user/" + params.row._id)}
              className="userListEdit"
            >
              Edit
            </button>
            <DeleteOutlineIcon
              onClick={() => handleDelete(params.row._id)}
              className="userListDelete"
            ></DeleteOutlineIcon>
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <button onClick={() => navigate("/newUser")} className="userAddButton">
        Create New User
      </button>
      <DataGrid
        className="userListDataGrid"
        rows={users}
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
