import { useState } from "react";
import "./NewProduct.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { addProductAsync } from "../../redux/features/product/productThunks";
import { useDispatch, useSelector } from "react-redux";

export default function NewProduct() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState([]);
  const [color, setColor] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const dispatch = useDispatch();

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
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

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
            console.log("Unknown error occurred, inspect error.serverResponse");
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const product = {
            ...inputs,
            img: downloadURL,
            categories: cat,
            color: color,
            size: sizes,
          };
          dispatch(addProductAsync(product))
            .then(() => {
              // Dispatch successful, show success popup
              setShowSuccessPopup(true);
              // Reset form
              setInputs({});
              setFile(null);
              setCat([]);
              setColor([]);
              setSizes([]);
              document.getElementById("file").value = null;
            })
            .catch((error) => {
              // Handle dispatch error
              console.error("Error adding product:", error);
            });
        });
      }
    );
  }

  return (
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
              value={inputs.desc  || ""}
              placeholder="Enter description"
              onChange={handleChange}
            />
          </div>
          <div className="addProductItem">
            <label>Price</label>
            <input
              name="price"
              type="number"
              value={inputs.price  || ""}
              placeholder="Enter Price"
              onChange={handleChange}
            />
          </div>
          <div className="addProductItem">
            <label>Categories</label>
            <input
              type="text"
              value={cat}
              placeholder="Jeans, Skirts.."
              onChange={handleCategories}
            />
          </div>
          <div className="addProductItem">
            <label>Sizes</label>
            <input
              type="text"
              value={sizes}
              placeholder="S, M.."
              onChange={handleSizes}
            />
          </div>
          <div className="addProductItem">
            <label>Color</label>
            <input
              type="text"
              value={color}
              placeholder="Red, Blue.."
              onChange={handleColors}
            />
          </div>
          <div className="addProductItem">
            <label>Stock</label>
            <select name="inStock" onChange={handleChange}>
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
      {showSuccessPopup && (
        <div className="successPopup">
          <p>Product added successfully!</p>
          <button onClick={() => setShowSuccessPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
