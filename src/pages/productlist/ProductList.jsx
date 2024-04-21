import "./ProductList.css";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductsAsync,
  deleteProductAsync,
} from "../../redux/features/product/productThunks";

export default function ProductList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProductsAsync());
  }, []);

  const handleDelete = (id) => {
    dispatch(deleteProductAsync(id));
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "product",
      headerName: "Product",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.img} alt=""></img>
            <div className="productListTitle">{params.row.title}</div>
          </div>
        );
      },
    },
    { field: "categories", headerName: "Categories", width: 100 },
    { field: "size", headerName: "Size", width: 100 },
    { field: "color", headerName: "Color", width: 100 },
    {
      field: "inStock",
      headerName: "Stock",
      width: 100,
      valueGetter: (params) => {
        return params.row.inStock ? "True" : "False";
      },
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      valueGetter: (params) => {
        return `₹${params.row.price}`;
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
              onClick={() => navigate("/product/" + params.row._id)}
              className="productListEdit"
            >
              Edit
            </button>
            <DeleteOutlineIcon
              onClick={() => handleDelete(params.row._id)}
              className="productListDelete"
            ></DeleteOutlineIcon>
          </>
        );
      },
    },
  ];
  return (
    <div className="productList">
      <button
        onClick={() => navigate("/newProduct")}
        className="productAddButton"
      >
        Create New Product
      </button>
      <DataGrid
        className="productListDataGrid"
        rows={products}
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
