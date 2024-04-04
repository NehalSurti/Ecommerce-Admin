import "./Product.css";
import { useLocation, useNavigate } from "react-router-dom";
import Chart from "../../components/chart/Chart";
import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo, useEffect } from "react";
import { userRequest } from "../../utils/requestMethods";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "../../firebase";
import { updateProductAsync } from "../../redux/features/product/productThunks";

export default function Product() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState([]);
  const [color, setColor] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [image, setImage] = useState(null);
  // const [prevImage, setPrevImage] = useState({ image: null, prevImage: null });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const productId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const [pStats, setPStats] = useState([]);
  const uniqueNamesSet = new Set();

  const { products } = useSelector((state) => state.product);
  const product = products.find((product) => product._id === productId);

  useEffect(() => {
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
    // setPrevImage((prev) => {
    //   return { ...prev, image: product?.img || null, prevImage: prev.image };
    // });
  }, [product]);

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

  function handleChange(e) {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleCategories(e) {
    setCat(e.target.value.split(","));
  }

  function handleColors(e) {
    setColor(e.target.value.split(","));
  }

  function handleSizes(e) {
    setSizes(e.target.value.split(","));
  }

  function handleClick(e) {
    e.preventDefault();

    if (file !== null) {
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      // Create a reference to the file to delete
      const desertRef = ref(storage, image);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              console.log("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              console.log("User canceled the upload");
              break;
            case "storage/unknown":
              console.log(
                "Unknown error occurred, inspect error.serverResponse"
              );
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const updatedProduct = {
              ...inputs,
              img: downloadURL,
              categories: cat,
              color: color,
              size: sizes,
            };

            // Delete the file
            deleteObject(desertRef)
              .then(() => {
                console.log("File deleted successfully");
              })
              .catch((error) => {
                console.log("Error deleting product:", error);
              });

            dispatch(
              updateProductAsync({
                id: productId,
                productUpdate: updatedProduct,
              })
            )
              .then(() => {
                // Dispatch successful, show success popup
                setShowSuccessPopup(true);
                document.getElementById("file").value = null;
              })
              .catch((error) => {
                // Handle dispatch error
                console.error("Error adding product:", error);
              });
          });
        }
      );
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
          // Dispatch successful, show success popup
          setShowSuccessPopup(true);
        })
        .catch((error) => {
          // Handle dispatch error
          console.error("Error adding product:", error);
        });
    }
  }

  return (
    <div className="product">
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
              <span className="productInfoValue">
                {product.inStock ? "True" : "False"}
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
                  placeholder={product.title}
                />
              </div>
              <div className="editProductItem">
                <label>Product Description</label>
                <input
                  type="text"
                  name="desc"
                  onChange={handleChange}
                  value={inputs.desc}
                  placeholder={product.desc}
                />
              </div>
              <div className="editProductItem">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  onChange={handleChange}
                  value={inputs.price}
                  placeholder={product.price}
                />
              </div>
              <div className="editProductItem">
                <label>Categories</label>
                <input
                  type="text"
                  onChange={handleCategories}
                  value={cat}
                  placeholder={product.categories}
                />
              </div>
              <div className="editProductItem">
                <label>Sizes</label>
                <input
                  type="text"
                  onChange={handleSizes}
                  value={sizes}
                  placeholder={product.size}
                />
              </div>
              <div className="editProductItem">
                <label>Color</label>
                <input
                  type="text"
                  onChange={handleColors}
                  value={color}
                  placeholder={product.color}
                />
              </div>
              <div className="editProductItem">
                <label>In Stock</label>
                <select
                  name="inStock"
                  id="idStock"
                  onChange={handleChange}
                  value={inputs.inStock}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <div className="productFormRight">
              <div className="productUpload">
                <img src={image} alt="" className="productUploadImg" />
                <label htmlFor="file">{/* <Publish></Publish> */}</label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
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
      {showSuccessPopup && (
        <div className="successPopup">
          <p>Product edited successfully!</p>
          <button onClick={() => setShowSuccessPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
