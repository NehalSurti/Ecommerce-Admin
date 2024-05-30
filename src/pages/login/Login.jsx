import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  checkTokenAndLoginAsync,
  loginAsync,
} from "../../redux/features/user/userThunks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../../services/ToastOptions";
import {
  handleRequiredFields,
  handleValidation,
} from "../../services/InputValidation_Login";
import "./Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { isFetching } = useSelector((state) => state.user);

  const [searchParams] = useSearchParams();

  const userId = searchParams.get("id");

  async function handleClick(e) {
    e.preventDefault();
    setLoading(true);

    if (handleRequiredFields(username, password)) {
      toast.error("Please fill all fields!", toastOptions);
      setLoading(false);
      return;
    }

    const validationCheck = handleValidation(username);

    if (validationCheck.check) {
      try {
        const login = await dispatch(loginAsync({ username, password }));
        console.log("login : ", login);
        if (login.payload.status) {
          setLoading(false);
          setUsername("");
          setPassword("");
          navigate("/");
        } else {
          setLoading(false);
          toast.error("Login not successfull", toastOptions);
        }
      } catch (error) {
        setLoading(false);
        toast.error("Login not successfull", toastOptions);
      }
    } else {
      setLoading(false);
      toast.error(validationCheck.toastMsg, toastOptions);
    }
  }

  useEffect(() => {
    localStorage.removeItem("persist:admin");
  }, []);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      const userDetail = localStorage.getItem("persist:rootReactApp");
      const userToken = JSON.parse(JSON.parse(userDetail).user).currentUser
        .token;

      async function tokenAndLoginCheck() {
        try {
          const tokenCheckStatus = await dispatch(
            checkTokenAndLoginAsync({ TOKEN: userToken })
          );
          if (tokenCheckStatus.payload) {
            navigate("/");
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
      tokenAndLoginCheck();
    }
  }, []);

  return (
    <>
      {!loading && (
        <Container>
          <Wrapper>
            <Title>SIGN IN</Title>
            <Form>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              ></Input>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              ></Input>
              <Button onClick={handleClick} disabled={isFetching}>
                LOGIN
              </Button>
              {/* {loginError && <Error>Something went wrong...</Error>} */}
              <Link className="inactive-feature tooltip">
                DO NOT REMEMBER THE PASSWORD?
                <span class="tooltiptext">Coming Soon!</span>
              </Link>
            </Form>
          </Wrapper>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 25%;
  padding: 20px;
  background-color: white;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0px;
  padding: 10px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;

  &:disabled {
    color: green;
    cursor: not-allowed;
  }
`;

const Link = styled.a`
  margin: 5px 0px;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;
