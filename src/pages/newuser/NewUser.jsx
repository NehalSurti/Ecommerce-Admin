import "./NewUser.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerAsync,
  getAllUsersAsync,
} from "../../redux/features/user/userThunks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  handleFileType,
  handleRequiredFields,
  handleValidation,
} from "../../services/InputValidation_NewUser";
import { handleImageUpload } from "../../services/ImageUpload_Firebase";
import { toastOptions } from "../../services/ToastOptions";

export default function NewUser() {
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [postcode, setPostcode] = useState("");
  const [loading, setLoading] = useState(false);

  const { registerError } = useSelector((state) => state.user);

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

  async function handleClick(e) {
    e.preventDefault();
    setLoading(true);

    if (handleRequiredFields(inputs, street, country, postcode, file)) {
      toast.error("Please fill all fields!", toastOptions);
      setLoading(false);
      return;
    }

    if (handleFileType(file)) {
      toast.error("Please upload a PNG or JPEG file.", toastOptions);
      setLoading(false);
      return;
    }

    const validationCheck = handleValidation(inputs);

    if (validationCheck.check) {
      try {
        const downloadURL = await handleImageUpload(file);

        const registerUser = {
          ...inputs,
          img: downloadURL,
          address: {
            Add: street,
            Country: country,
            Postcode: postcode,
          },
        };

        try {
          const regUsr = await dispatch(registerAsync(registerUser));

          if (regUsr.payload) {
            setLoading(false);
            setInputs({});
            setStreet("");
            setCountry("");
            setPostcode("");
            setFile(null);
            dispatch(getAllUsersAsync());
            toast.success("User added successfully!", toastOptions);
          } else {
            setLoading(false);
            toast.error("Error adding User", toastOptions);
          }
        } catch (error) {
          setLoading(false);
          toast.error("Error adding User", toastOptions);
        }
      } catch (error) {
        setFile(null);
        setLoading(false);
        toast.error(error, toastOptions);
      }
    } else {
      setLoading(false);
      toast.error(validationCheck.toastMsg, toastOptions);
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
                  <select name="isAdmin" id="isAdmin" onChange={handleChange}>
                    <option disabled selected hidden>
                      Select
                    </option>
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
                  <select name="status" id="status" onChange={handleChange}>
                    <option disabled selected hidden>
                      Select
                    </option>
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
      </div>
      <ToastContainer />
    </>
  );
}
