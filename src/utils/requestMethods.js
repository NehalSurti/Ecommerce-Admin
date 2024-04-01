import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// import { selectuser } from "../redux/features/user/userSlice";
const BASE_URL = "http://localhost:5000/api";
let TOKEN;
// const { currentUser, isFetching, error } = useSelector((state) => state.user);

// function token () {
//   const { currentUser, isFetching, error } = useSelector((state) => state.user);
//   return currentUser;
// }
async function token() {
  try {
    TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
      .currentUser.token;
    console.log(TOKEN);
  } catch (err) {
    TOKEN = "";
  }
}
token();

// try {
//   selectuser = token();
//   console.log(" currentuser TOKEN",selectuser);
//   TOKEN = selectuser.token;
//     console.log("TOKEN",TOKEN);
// } catch (err) {
//   TOKEN = "";
// }

// const TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjQ5YWEwNjdlODVmZWUwMjA0ZmEwZCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwMzE2OTM5OSwiZXhwIjoxNzAzNDI4NTk5fQ.wOXw93-98vbfOrDimp2VJ4jS0Nw_Dnp1KxooJ8_-0VQVg2Ba9ezOyrYcnltr_AoGHCBjRBGOy5iNggarRwgHQklgwnul6DBiLQtcCtTZk8MjTc7Op8CvooLC9aQoOCfcODZ_HDhV3evoSgY_kHnthGXRsKw9nMT-aBS1cIO6h2G902bV6oSEQe2CSL9VBx7cJKg6zCxTYUWbS7fVTWxgAsOD4WgmG6GzV_wAk7wIsvphZzptbXpDDBnDCSyHvalFRJEZX8mTOLiLEgPEwN2ASgQD3JMaLBzdrOD8KhkuQhXmrsJr4RAuu51EOOfeKE8QelkYViKvcokCDDmI9fs9xA";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${TOKEN}` },
});
