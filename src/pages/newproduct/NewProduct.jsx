import { useState } from "react";
import "./NewProduct.css";
import { addProductAsync } from "../../redux/features/product/productThunks";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  handleFileType,
  handleInputValidation,
  handleRequiredFields,
} from "../../services/InputValidation_NewProduct";
import { toastOptions } from "../../services/ToastOptions";
import { handleImageUpload } from "../../services/ImageUpload_Firebase";

export default function NewProduct() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState([]);
  const [color, setColor] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { error } = useSelector((state) => state.product);

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

    if (handleRequiredFields(inputs, file, cat, color, sizes)) {
      toast.error("Please fill all fields!", toastOptions);
      setLoading(false);
      return;
    }

    if (handleFileType(file)) {
      toast.error("Please upload a PNG or JPEG file.", toastOptions);
      setLoading(false);
      return;
    }

    try {
      const downloadURL = await handleImageUpload(file);

      const product = {
        ...inputs,
        img: downloadURL,
        categories: cat,
        color: color,
        size: sizes,
      };

      dispatch(addProductAsync(product))
        .then(() => {
          if (error === false) {
            setLoading(false);
            // Reset form
            setInputs({});
            setFile(null);
            setCat([]);
            setColor([]);
            setSizes([]);
            document.getElementById("file").value = null;
            toast.success("Product added successfully!", toastOptions);
          } else {
            setLoading(false);
            toast.error("Error adding product", toastOptions);
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error("Error adding product", toastOptions);
        });
    } catch (error) {
      setLoading(false);
      toast.error(error, toastOptions);
    }
  }

  return (
    <>
      <div className="newProduct">
        <h1 className="addProductTitle">New Product</h1>
        <form className="addProductForm">
          <div className="formPartOne">
            <div className="addProductImageItem">
              <label>Image</label>
              <input
                type="file"
                id="file"
                // value={file}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>
          <div className="formPartTwo">
            <div className="addProductItem">
              <label>Title</label>
              <input
                name="title"
                type="text"
                value={inputs.title || ""}
                placeholder="Enter title"
                onChange={handleChange}
              />
            </div>
            <div className="addProductItem">
              <label>Description</label>
              <input
                name="desc"
                type="text"
                value={inputs.desc || ""}
                placeholder="Enter description"
                onChange={handleChange}
              />
            </div>
            <div className="addProductItem">
              <label>Price</label>
              <input
                name="price"
                type="number"
                value={inputs.price || ""}
                placeholder="Enter Price"
                onChange={handleChange}
              />
            </div>
            <div className="addProductItem">
              <label>Categories</label>
              <input
                name="categories"
                type="text"
                value={cat}
                placeholder="Jeans, Skirts.."
                onChange={handleCategories}
              />
            </div>
            <div className="addProductItem">
              <label>Sizes</label>
              <input
                name="size"
                type="text"
                value={sizes}
                placeholder="S, M.."
                onChange={handleSizes}
              />
            </div>
            <div className="addProductItem">
              <label>Color</label>
              <input
                name="color"
                type="text"
                value={color}
                placeholder="Red, Blue.."
                onChange={handleColors}
              />
            </div>
            <div className="addProductItem">
              <label>Stock</label>
              <select
                name="inStock"
                onChange={handleChange}
                value={inputs.inStock ? "true" : "false"}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div className="formPartThree">
            <button onClick={handleClick} className="addProductButton">
              Create
            </button>
          </div>
        </form>
        {loading && <div className="loadingIndicator"></div>}
      </div>
      <ToastContainer />
    </>
  );
}
