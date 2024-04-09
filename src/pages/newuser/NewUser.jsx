import "./NewUser.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  registerAsync,
  getAllUsersAsync,
} from "../../redux/features/user/userThunks";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewUser() {
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [postcode, setPostcode] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log("inputs : ", inputs);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  function handleChange(e) {
    setInputs((prev) => {
      if (e.target.name === "isAdmin") {
        return {
          ...prev,
          [e.target.name]: e.target.value === "true" ? true : false,
        };
      } else {
        return { ...prev, [e.target.name]: e.target.value };
      }
    });
  }

  function handleClick(e) {
    e.preventDefault();

    const requiredFields = [
      "username",
      "fullName",
      "email",
      "password",
      "phone",
      "isAdmin",
      "status",
    ];
    const isAnyFieldEmpty = requiredFields.some((field) => {
      const value = inputs[field];
      return value === undefined || value === null || value === "";
    });

    if (
      isAnyFieldEmpty ||
      !file ||
      street.length === 0 ||
      country.length === 0 ||
      postcode.length === 0
    ) {
      toast.error("Please fill all fields!", toastOptions);
      return;
    }
    setLoading(true);

    if (file !== null) {
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
              console.log(
                "Unknown error occurred, inspect error.serverResponse"
              );
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const registerUser = {
              ...inputs,
              img: downloadURL,
              address: {
                Add: street,
                Country: country,
                Postcode: postcode,
              },
            };

            dispatch(registerAsync(registerUser))
              .then(() => {
                // Dispatch successful, show success popup
                setLoading(false);
                setShowSuccessPopup(true);
                setInputs({});
                setStreet("");
                setCountry("");
                setPostcode("");
                setFile(null);
                document.getElementById("file").value = null;
                dispatch(getAllUsersAsync());
              })
              .catch((error) => {
                // Handle dispatch error
                setLoading(false);
                console.error("Error adding product:", error);
              });
          });
        }
      );
    } else {
      const registerUser = {
        ...inputs,
        address: {
          Add: street,
          Country: country,
          Postcode: postcode,
        },
      };
      dispatch(registerAsync(registerUser))
        .then(() => {
          // Dispatch successful, show success popup
          setLoading(false);
          setShowSuccessPopup(true);
          setInputs({});
          setStreet("");
          setCountry("");
          setPostcode("");
          setFile(null);
          document.getElementById("file").value = null;
          dispatch(getAllUsersAsync());
        })
        .catch((error) => {
          // Handle dispatch error
          setLoading(false);
          console.error("Error adding product:", error);
        });
    }
  }

  return (
    <>
      <div className="newUser">
        {!loading && (
          <>
            <h1 className="newUserTitle">New User</h1>
            <form className="newUserForm">
              <div className="newUserFormPartZero">
                <div className="addUserImageItem">
                  <label>Image</label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="newUserFormPartOne">
                <div className="newUserItem">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Enter Username..."
                    value={inputs.username}
                    onChange={handleChange}
                    name="username"
                  />
                </div>
                <div className="newUserItem">
                  <label>Full Name</label>
                  <input
                    name="fullName"
                    type="text"
                    value={inputs.fullName}
                    placeholder="Enter Fullname..."
                    onChange={handleChange}
                  />
                </div>
                <div className="newUserItem">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={inputs.email}
                    placeholder="Enter Email..."
                    onChange={handleChange}
                  />
                </div>
                <div className="newUserItem">
                  <label>Password</label>
                  <input
                    name="password"
                    type="password"
                    value={inputs.password}
                    placeholder="Enter Password..."
                    onChange={handleChange}
                  />
                </div>
                <div className="newUserItem">
                  <label>Phone</label>
                  <input
                    name="phone"
                    type="text"
                    value={inputs.phone}
                    placeholder="Enter Phone..."
                    onChange={handleChange}
                  />
                </div>
                <div className="newUserItem">
                  <label>IsAdmin</label>
                  <select
                    name="isAdmin"
                    id="isAdmin"
                    onChange={handleChange}
                    value={inputs.isAdmin === true ? "true" : "false"}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
                <div className="newUserItem">
                  <label>Address</label>
                  <div className="addressformgroup">
                    <label htmlFor="street">Street:</label>
                    <input
                      type="text"
                      id="street"
                      placeholder="Enter Street..."
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>
                  <div className="addressformgroup">
                    <label htmlFor="country">Country:</label>
                    <input
                      type="text"
                      id="country"
                      placeholder="Enter Country..."
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                  <div className="addressformgroup">
                    <label htmlFor="postcode">Postcode:</label>
                    <input
                      type="text"
                      id="postcode"
                      placeholder="Enter Postcode..."
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="newUserItem">
                  <label>Status</label>
                  <select
                    name="status"
                    id="status"
                    onChange={handleChange}
                    value={inputs.status}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="newUserFormPartTwo">
                <button onClick={handleClick} className="newUserButton">
                  Create
                </button>
              </div>
            </form>
          </>
        )}
        {loading && <div className="loadingIndicator">Registering User...</div>}
        {showSuccessPopup && (
          <div className="successPopup">
            <p>User registered successfully!</p>
            <button onClick={() => setShowSuccessPopup(false)}>Close</button>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
