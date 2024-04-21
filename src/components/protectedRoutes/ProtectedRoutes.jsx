import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyTokenAsync } from "../../redux/features/user/userThunks";

function ProtectedRoutes({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenVerify = async () => {
      try {
        const tokenVerify = await dispatch(verifyTokenAsync());
        if (tokenVerify.payload) {
          setIsAdminLoggedIn(true);
        } else {
          setIsAdminLoggedIn(true);
        }
      } catch (error) {
        setIsAdminLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    tokenVerify();
  }, []);

  if (!loading) {
    if (isAdminLoggedIn) {
      return children;
    } else {
      // return null;
      return <Navigate to="/login" />;
    }
  }
}

export default ProtectedRoutes;
