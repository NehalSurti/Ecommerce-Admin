import "./User.css";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserAsync,
  updateUserAsync,
} from "../../redux/features/user/userThunks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../../services/ToastOptions";
import {
  handleFileType,
  handleRequiredFields,
  handleValidation,
} from "../../services/InputValidation_User";
import { handleImageUpload } from "../../services/ImageDelete&Upload_Firebase";

export default function User() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [postcode, setPostcode] = useState("");
  const [loading, setLoading] = useState(false);

  const { fetchedUser, updateError, getUserError } = useSelector(
    (state) => state.user
  );

  const userId = location.pathname.split("/")[2];

  function formatDate(date) {
    const createdAt = new Date(date);
    const day = createdAt.getDate();
    const month = createdAt.getMonth() + 1;
    const year = createdAt.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  function handleChange(e) {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function handleClick(e) {
    e.preventDefault();
    setLoading(true);

    if (handleRequiredFields(inputs, image, street, country, postcode)) {
      toast.error("Please fill all fields!", toastOptions);
      setLoading(false);
      return;
    }

    const validationCheck = handleValidation(inputs);
    if (validationCheck.check) {
      if (file !== null) {
        if (handleFileType(file)) {
          toast.error("Please upload a PNG or JPEG file.", toastOptions);
          setLoading(false);
          return;
        }

        try {
          const downloadURL = await handleImageUpload(file, image);
          const updatedUser = {
            ...inputs,
            img: downloadURL,
            address: {
              Add: street,
              Country: country,
              Postcode: postcode,
            },
          };

          dispatch(
            updateUserAsync({
              id: userId,
              userUpdate: updatedUser,
            })
          )
            .then(() => {
              if (updateError === false) {
                setLoading(false);
                setFile(null);
                // document.getElementById("file").value = null;
                dispatch(getUserAsync(userId));
                toast.success("User updated successfully!", toastOptions);
              } else {
                setLoading(false);
                toast.error("Error updating User", toastOptions);
              }
            })
            .catch((error) => {
              setLoading(false);
              toast.error("Error updating User", toastOptions);
            });
        } catch (error) {
          setLoading(false);
          toast.error(error, toastOptions);
        }
      } else {
        const updatedUser = {
          ...inputs,
          img: image,
          address: {
            Add: street,
            Country: country,
            Postcode: postcode,
          },
        };
        dispatch(
          updateUserAsync({
            id: userId,
            userUpdate: updatedUser,
          })
        )
          .then(() => {
            if (updateError === false) {
              setLoading(false);
              dispatch(getUserAsync(userId));
              toast.success("User updated successfully!", toastOptions);
            } else {
              setLoading(false);
              toast.error("Error updating User", toastOptions);
            }
          })
          .catch((error) => {
            setLoading(false);
            toast.error("Error updating User", toastOptions);
          });
      }
    } else {
      setLoading(false);
      toast.error(validationCheck.toastMsg, toastOptions);
    }
  }

  useEffect(() => {
    setLoading(true);
    dispatch(getUserAsync(userId))
      .then((userData) => {
        if (getUserError === false) {
          setLoading(false);
          const fetchedUser = userData.payload;
          setInputs({
            username: fetchedUser?.username || "",
            fullName: fetchedUser?.fullName || "",
            email: fetchedUser?.email || "",
            phone: fetchedUser?.phone || "",
            isAdmin: fetchedUser?.isAdmin || false,
            status: fetchedUser?.status || "",
            createdAt: fetchedUser?.createdAt || "",
          });
          setImage(fetchedUser?.img || null);
          setStreet(fetchedUser?.address?.Add || "");
          setCountry(fetchedUser?.address?.Country || "");
          setPostcode(fetchedUser?.address?.Postcode || "");
        } else {
          setLoading(false);
          toast.error("User Data Not Available", toastOptions);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("User Data Not Available", toastOptions);
      });
  }, [dispatch, userId]);

  useEffect(() => {
    if (image) {
      setInputs({
        username: fetchedUser?.username || "",
        fullName: fetchedUser?.fullName || "",
        email: fetchedUser?.email || "",
        phone: fetchedUser?.phone || "",
        isAdmin: fetchedUser?.isAdmin || false,
        status: fetchedUser?.status || "",
        createdAt: fetchedUser?.createdAt || "",
      });
      setImage(fetchedUser?.img || null);
      setStreet(fetchedUser?.address?.Add || "");
      setCountry(fetchedUser?.address?.Country || "");
      setPostcode(fetchedUser?.address?.Postcode || "");
    }
  }, [fetchedUser]);

  return (
    <>
      <div className="user">
        {!loading ? (
          <>
            <div className="userTitleContainer">
              <h1 className="userTitle">Edit User</h1>
            </div>
            <div className="userContainer">
              <div className="userShow">
                <div className="userShowTop">
                  <img
                    className="userShowImg"
                    src={
                      image
                        ? image
                        : "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"
                    }
                    alt=""
                  />
                  <div className="userShowTopTitle">
                    <span className="userShowUsername">{inputs.fullName}</span>
                  </div>
                </div>
                <div className="userShowBottom">
                  <span className="userShowTitle">Account Details</span>
                  <div className="userShowInfo">
                    <PermIdentityIcon className="userShowIcon"></PermIdentityIcon>
                    <span className="userShowInfoTitle">{inputs.username}</span>
                  </div>
                  <div className="userShowInfo">
                    <CalendarTodayIcon className="userShowIcon"></CalendarTodayIcon>
                    <span className="userShowInfoTitle">
                      {inputs.createdAt ? formatDate(inputs.createdAt) : ""}
                    </span>
                  </div>
                  <span className="userShowTitle">Contact Details</span>
                  <div className="userShowInfo">
                    <PhoneAndroidIcon className="userShowIcon"></PhoneAndroidIcon>
                    <span className="userShowInfoTitle">{inputs.phone || "Not Available"}</span>
                  </div>
                  <div className="userShowInfo">
                    <MailOutlineIcon className="userShowIcon"></MailOutlineIcon>
                    <span className="userShowInfoTitle">{inputs.email || "Not Available"}</span>
                  </div>
                  <div className="userShowInfo">
                    <LocationSearchingIcon className="userShowIcon"></LocationSearchingIcon>
                    <span className="userShowInfoTitle">
                      <div className="addressContainer">
                        <ul className="addressElementLists">
                          <li className="addressElementList">{street || "Not Available"}</li>
                          <li className="addressElementList">{country}</li>
                          <li className="addressElementList">{postcode}</li>
                        </ul>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
              <div className="userUpdate">
                <span className="userUpdateTitle">Edit</span>
                <form className="userUpdateForm">
                  <div className="userUpdateLeft">
                    <div className="userUpdateLeftpart1">
                      <div className="userUpdateItem">
                        <label>Username</label>
                        <input
                          name="username"
                          type="text"
                          placeholder={inputs.username}
                          value={inputs.username}
                          onChange={handleChange}
                          className="userUpdateInput"
                        ></input>
                      </div>
                      <div className="userUpdateItem">
                        <label>Full Name</label>
                        <input
                          name="fullName"
                          type="text"
                          placeholder={inputs.fullName}
                          value={inputs.fullName}
                          onChange={handleChange}
                          className="userUpdateInput"
                        ></input>
                      </div>
                      <div className="userUpdateItem">
                        <label>Email</label>
                        <input
                          name="email"
                          type="text"
                          placeholder={inputs.email}
                          value={inputs.email}
                          onChange={handleChange}
                          className="userUpdateInput"
                        ></input>
                      </div>
                      <div className="userUpdateItem">
                        <label>Phone</label>
                        <input
                          name="phone"
                          type="text"
                          placeholder={inputs.phone}
                          value={inputs.phone}
                          onChange={handleChange}
                          className="userUpdateInput"
                        ></input>
                      </div>
                      <div className="userUpdateItem">
                        <label>Address</label>
                        <div className="addressformgroup">
                          <label htmlFor="street">Street:</label>
                          <input
                            type="text"
                            id="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                          />
                        </div>
                        <div className="addressformgroup">
                          <label htmlFor="country">Country:</label>
                          <input
                            type="text"
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          />
                        </div>
                        <div className="addressformgroup">
                          <label htmlFor="postcode">Postcode:</label>
                          <input
                            type="text"
                            id="postcode"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="userUpdateLeftpart2">
                      <div className="userUpdateItem">
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
                      <div className="userUpdateItem">
                        <label>IsAdmin</label>
                        <select
                          name="isAdmin"
                          id="isAdmin"
                          onChange={handleChange}
                          value={inputs.isAdmin}
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="userUpdateRight">
                    <div className="userUpdateUpload">
                      {image ? (
                        <>
                          <img className="userUpdateImg" src={image} alt="" />
                          <label htmlFor="file"></label>
                          <input
                            type="file"
                            id="file"
                            onChange={(e) => setFile(e.target.files[0])}
                          />
                        </>
                      ) : (
                        // <div className="placeholderImage">Loading...</div>
                        <img
                          className="userUpdateImg"
                          src="https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"
                          alt=""
                        />
                      )}
                    </div>
                    <button onClick={handleClick} className="userUpdateButton">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="loadingIndicator"></div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
