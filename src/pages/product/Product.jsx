import "./Product.css";
import { useLocation, useNavigate } from "react-router-dom";
import Chart from "../../components/chart/Chart";
import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo, useEffect } from "react";
import { userRequest } from "../../utils/requestMethods";

export default function Product() {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  // const dispatch = useDispatch();
  const [pStats, setPStats] = useState([]);
  const uniqueNamesSet = new Set();

  const { products } = useSelector((state) => state.product);
  const product = products.find((product) => product._id === productId);

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get("/orders/income?pid=" + productId);
        const list = res.data.sort((a, b) => {
          return a._id - b._id;
        });
        list.map((item) => {
          if (uniqueNamesSet.has(item._id)) {
          } else {
            setPStats((prev) => [
              ...prev,
              {
                name: MONTHS[item._id - 1],
                Sales: item.total,
              },
            ]);
            uniqueNamesSet.add(item._id);
          }
        });
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [MONTHS]); // TODO cHECK THE SALES PERFORMANCE CHART

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        {/* <button
          onClick={() => navigate("/newProduct")}
          className="productAddButton"
        >
          Create
        </button> */}
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart
            data={pStats}
            dataKey="Sales"
            title="Sales Performance"
            grid
          ></Chart>
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product.img} alt="" className="productInfoImg" />
            <span className="productName">{product.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">Id:</span>
              <span className="productInfoValue">{product._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Sales:</span>
              <span className="productInfoValue">5123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">In stock:</span>
              <span className="productInfoValue">{product.inStock}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <div className="editProductItem">
              <label>Product Name</label>
              <input type="text" placeholder={product.title} />
            </div>
            <div className="editProductItem">
              <label>Product Description</label>
              <input type="text" placeholder={product.desc} />
            </div>
            <div className="editProductItem">
              <label>Price</label>
              <input type="text" placeholder={product.price} />
            </div>
            <div className="editProductItem">
              <label>Categories</label>
              <input type="text" placeholder={product.categories} />
            </div>
            <div className="editProductItem"></div>
            <label>Sizes</label>
            <input type="text" placeholder={product.size} />
            <div className="editProductItem">
              <label>Color</label>
              <input type="text" placeholder={product.color} />
            </div>
            <div className="editProductItem">
              <label>In Stock</label>
              <select name="inStock" id="idStock">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src={product.img} alt="" className="productUploadImg" />
              <label htmlFor="file">{/* <Publish></Publish> */}</label>
              <input type="file" id="file" style={{ display: "none" }} />
            </div>
            <button className="productButton">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}
