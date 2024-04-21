import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  // headers: { Authorization: `Bearer ${TOKEN}` },
});

const UserRequestResponseInterceptor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    userRequest.interceptors.request.use(
      (config) => {
        const token = currentUser ? currentUser.token : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    userRequest.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (
          error.response &&
          (error.response.status === 403 || error.response.status === 401)
        ) {
          try {
            localStorage.removeItem("persist:admin");
            navigate("/login");
          } catch (error) {}
        }
        return Promise.reject(error);
      }
    );
    return () => {
      // userRequest.interceptors.request.eject(requestInterceptor);
      // userRequest.interceptors.response.eject(responseInterceptor);
    };
  }, [currentUser, dispatch]);

  return null; // This component doesn't render anything
};

export default UserRequestResponseInterceptor;
