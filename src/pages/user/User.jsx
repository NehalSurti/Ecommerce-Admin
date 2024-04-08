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
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "../../firebase";

export default function User() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { fetchedUser } = useSelector((state) => state.user);

  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [postcode, setPostcode] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);

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

  function handleClick(e) {
    e.preventDefault();
    setLoading(true);

    if (file !== null) {
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      let desertRef;
      // Create a reference to the file to delete
      try {
        desertRef = ref(storage, image);
      } catch (err) {
        desertRef = false;
      }

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
            const updatedUser = {
              ...inputs,
              img: downloadURL,
              address: {
                Add: street,
                Country: country,
                Postcode: postcode,
              },
            };

            // Delete the file
            if (desertRef) {
              deleteObject(desertRef)
                .then(() => {
                  console.log("File deleted successfully");
                })
                .catch((error) => {
                  console.log("Error deleting product:", error);
                });
            }

            dispatch(
              updateUserAsync({
                id: userId,
                userUpdate: updatedUser,
              })
            )
              .then(() => {
                // Dispatch successful, show success popup
                setLoading(false);
                dispatch(getUserAsync(userId));
                setShowSuccessPopup(true);
                document.getElementById("file").value = null;
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
          // Dispatch successful, show success popup
          setLoading(false);
          dispatch(getUserAsync(userId));
          setShowSuccessPopup(true);
        })
        .catch((error) => {
          // Handle dispatch error
          setLoading(false);
          console.error("Error adding product:", error);
        });
    }
  }

  useEffect(() => {
    dispatch(getUserAsync(userId))
      .then((userData) => {
        console.log("userData :", userData.payload);
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
        setStreet(fetchedUser?.address.Add || "");
        setCountry(fetchedUser?.address.Country || "");
        setPostcode(fetchedUser?.address.Postcode || "");
      })
      .catch((error) => {
        console.log("userData error:", error);
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
      setStreet(fetchedUser?.address.Add || "");
      setCountry(fetchedUser?.address.Country || "");
      setPostcode(fetchedUser?.address.Postcode || "");
    }
  }, [fetchedUser]);

  return (
    <div className="user">
      {!loading && (
        <>
          <div className="userTitleContainer">
            <h1 className="userTitle">Edit User</h1>
          </div>
          <div className="userContainer">
            <div className="userShow">
              <div className="userShowTop">
                <img className="userShowImg" src={image} alt="" />
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
                    {formatDate(inputs.createdAt)}
                  </span>
                </div>
                <span className="userShowTitle">Contact Details</span>
                <div className="userShowInfo">
                  <PhoneAndroidIcon className="userShowIcon"></PhoneAndroidIcon>
                  <span className="userShowInfoTitle">{inputs.phone}</span>
                </div>
                <div className="userShowInfo">
                  <MailOutlineIcon className="userShowIcon"></MailOutlineIcon>
                  <span className="userShowInfoTitle">{inputs.email}</span>
                </div>
                <div className="userShowInfo">
                  <LocationSearchingIcon className="userShowIcon"></LocationSearchingIcon>
                  <span className="userShowInfoTitle">
                    <div className="addressContainer">
                      <ul className="addressElementLists">
                        <li className="addressElementList">{street}</li>
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
                      <div className="placeholderImage">Loading...</div>
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
      )}
      {loading && <div className="loadingIndicator">Updating...</div>}
      {showSuccessPopup && (
        <div className="successPopup">
          <p>User edited successfully!</p>
          <button onClick={() => setShowSuccessPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
