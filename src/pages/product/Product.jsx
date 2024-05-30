import "./Product.css";
import { useLocation } from "react-router-dom";
import Chart from "../../components/chart/Chart";
import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo, useEffect } from "react";
import {
  getProductsAsync,
  updateProductAsync,
} from "../../redux/features/product/productThunks";
import {
  handleFileType,
  handleInputValidation,
  handleRequiredFields,
} from "../../services/InputValidation_Product";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../../services/ToastOptions";
import { handleImageUpload } from "../../services/ImageDelete&Upload_Firebase";
import { getMonthlyIncomeforProductAsync } from "../../redux/features/order/orderThunks";

export default function Product() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState([]);
  const [color, setColor] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [image, setImage] = useState(null);
  const [pStats, setPStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const productId = location.pathname.split("/")[2];
  const { MonthlyIncomeforProduct } = useSelector((state) => state.order);
  const { products, error } = useSelector((state) => state.product);
  const product = products.find((product) => product._id === productId);

  const uniqueNamesSet = new Set();
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
    dispatch(getProductsAsync());
    dispatch(getMonthlyIncomeforProductAsync(productId));
  }, []);

  useEffect(() => {
    setLoading(true);
    setInputs({
      title: product?.title || "",
      desc: product?.desc || "",
      price: product?.price || "",
      inStock: product?.inStock || "",
    });
    setCat(product?.categories || []);
    setColor(product?.color || []);
    setSizes(product?.size || []);
    setImage(product?.img || null);
    setLoading(false);
  }, [product]);

  useEffect(() => {
    if (MonthlyIncomeforProduct && MonthlyIncomeforProduct.length > 0) {
      const getStats = () => {
        try {
          const list = MonthlyIncomeforProduct[0].monthlySales
            .slice()
            .sort((a, b) => a.month - b.month);
          const updatedStats = [];

          list.forEach((item) => {
            if (!uniqueNamesSet.has(item.month)) {
              updatedStats.push({
                name: MONTHS[item.month - 1],
                Sales: item.total,
              });
              uniqueNamesSet.add(item.month);
            }
          });

          setPStats(updatedStats);
        } catch (err) {
          console.log(err);
        }
      };
      getStats();
    }
  }, [MonthlyIncomeforProduct, MONTHS]);

  function handleChange(e) {
    const value = handleInputValidation(e.target.name, e.target.value);
    setInputs((prev) => {
      return { ...prev, [e.target.name]: value };
    });
  }

  function handleCategories(e) {
    const value = handleInputValidation(e.target.name, e.target.value);
    setCat(value);
  }

  function handleColors(e) {
    const value = handleInputValidation(e.target.name, e.target.value);
    setColor(value);
  }

  function handleSizes(e) {
    const value = handleInputValidation(e.target.name, e.target.value);
    setSizes(value);
  }

  async function handleClick(e) {
    e.preventDefault();
    setLoading(true);

    if (handleRequiredFields(inputs, cat, color, sizes)) {
      toast.error("Please fill all fields!", toastOptions);
      setLoading(false);
      return;
    }

    if (file !== null) {
      if (handleFileType(file)) {
        toast.error("Please upload a PNG or JPEG file.", toastOptions);
        setLoading(false);
        return;
      }

      try {
        const downloadURL = await handleImageUpload(file, image);

        const updatedProduct = {
          ...inputs,
          img: downloadURL,
          categories: cat,
          color: color,
          size: sizes,
        };

        dispatch(
          updateProductAsync({
            id: productId,
            productUpdate: updatedProduct,
          })
        )
          .then(() => {
            if (error === false) {
              setLoading(false);
              // document.getElementById("file").value = null;
              toast.success("Product updated successfully!", toastOptions);
            } else {
              setLoading(false);
              toast.error("Error updating product", toastOptions);
            }
          })
          .catch((error) => {
            setLoading(false);
            toast.error("Error updating product", toastOptions);
          });
      } catch (error) {
        setLoading(false);
        toast.error(error, toastOptions);
      }
    } else {
      const updatedProduct = {
        ...inputs,
        img: image,
        categories: cat,
        color: color,
        size: sizes,
      };
      dispatch(
        updateProductAsync({
          id: productId,
          productUpdate: updatedProduct,
        })
      )
        .then(() => {
          if (error === false) {
            setLoading(false);
            toast.success("Product updated successfully!", toastOptions);
          } else {
            setLoading(false);
            toast.error("Error updating product", toastOptions);
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error("Error updating product", toastOptions);
        });
    }
  }

  return (
    <>
      <div className="product">
        {!loading && (
          <>
            <div className="productTitleContainer">
              <h1 className="productTitle">Product</h1>
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
                  <img src={image} alt="" className="productInfoImg" />
                  <span className="productName">{inputs.title}</span>
                </div>
                <div className="productInfoBottom">
                  <div className="productInfoItem">
                    <span className="productInfoKey">Id:</span>
                    <span className="productInfoValue">{product?._id}</span>
                  </div>
                  <div className="productInfoItem">
                    <span className="productInfoKey">Sales:</span>
                    <span className="productInfoValue">
                      ₹
                      {MonthlyIncomeforProduct && MonthlyIncomeforProduct[0]
                        ? MonthlyIncomeforProduct[0].totalSales
                        : 0}
                    </span>
                  </div>
                  <div className="productInfoItem">
                    <span className="productInfoKey">In stock:</span>
                    <span className="productInfoValue">
                      {inputs.inStock ? "True" : "False"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="productBottom">
              <form className="productForm">
                <div className="productFormTop">
                  <div className="productFormLeft">
                    <div className="editProductItem">
                      <label>Product Name</label>
                      <input
                        type="text"
                        name="title"
                        onChange={handleChange}
                        value={inputs.title}
                        placeholder={inputs.title}
                      />
                    </div>
                    <div className="editProductItem">
                      <label>Product Description</label>
                      <input
                        type="text"
                        name="desc"
                        onChange={handleChange}
                        value={inputs.desc}
                        placeholder={inputs.desc}
                      />
                    </div>
                    <div className="editProductItem">
                      <label>Price</label>
                      <input
                        type="number"
                        name="price"
                        onChange={handleChange}
                        value={inputs.price}
                        placeholder={inputs.price}
                      />
                    </div>
                    <div className="editProductItem">
                      <label>Categories</label>
                      <input
                        name="categories"
                        type="text"
                        onChange={handleCategories}
                        value={cat}
                        placeholder={cat}
                      />
                    </div>
                    <div className="editProductItem">
                      <label>Sizes</label>
                      <input
                        name="size"
                        type="text"
                        onChange={handleSizes}
                        value={sizes}
                        placeholder={sizes}
                      />
                    </div>
                    <div className="editProductItem">
                      <label>Color</label>
                      <input
                        name="color"
                        type="text"
                        onChange={handleColors}
                        value={color}
                        placeholder={color}
                      />
                    </div>
                    <div className="editProductItem">
                      <label>In Stock</label>
                      <select
                        name="inStock"
                        id="idStock"
                        onChange={handleChange}
                        value={inputs.inStock ? "true" : "false"}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="productFormRight">
                    <div className="productUpload">
                      {image ? (
                        <>
                          <img
                            src={image}
                            alt=""
                            className="productUploadImg"
                          />
                          <label htmlFor="file"></label>
                          <input
                            type="file"
                            id="file"
                            onChange={(e) => setFile(e.target.files[0])}
                          />
                        </>
                      ) : (
                        <div className="placeholderImage">Loading...</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="productFormBottom">
                  <button onClick={handleClick} className="productButton">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
        {loading && <div className="loadingIndicator"></div>}
      </div>
      <ToastContainer />
    </>
  );
}
