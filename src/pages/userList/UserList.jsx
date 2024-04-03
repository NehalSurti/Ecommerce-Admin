import "./UserList.css";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { userRows } from "../../utils/dummyData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UserList() {
  const navigate = useNavigate();
  const [data, setData] = useState(userRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "user",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.avatar} alt=""></img>
            {params.row.username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 150 },
    { field: "isAdmin", headerName: "IsAdmin", width: 80 },
    { field: "address", headerName: "Address", width: 120 },
    { field: "phone", headerName: "Phone", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "transactions",
      headerName: "Transaction Volume",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => navigate("/user/" + params.row.id)}
              className="userListEdit"
            >
              Edit
            </button>
            <DeleteOutlineIcon
              onClick={() => handleDelete(params.row.id)}
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
        rows={data}
        columns={columns}
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
