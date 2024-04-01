import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
// import { mobile } from "../utils/responsive";
import { loginAsync } from "../../redux/features/user/userThunks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { publicRequest } from "../../utils/requestMethods";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [checkClick, setCheckClick] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, isFetching, error } = useSelector((state) => state.user);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  // console.log("currentUser", currentUser);
  // console.log("isFetching", isFetching);
  // console.log("error", error);
 

  async function handleClick(e) {
    e.preventDefault();
    dispatch(loginAsync({ username, password }))

    const { data } = await publicRequest.post('/auth/login', {
      username,
      password,
    });
    // if (data.status === false) {
    //   toast.error(data.message, toastOptions);
    // }
    if (data.status === true) {
      console.log("data.status",data.status)
      // localStorage.setItem("chat-app-user", JSON.stringify(data.user));
      navigate("/");
    }

    usernameRef.current.value = "";
    passwordRef.current.value = "";
    setUsername("");
    setPassword("");
    // setCheckClick(true);

    // if (!error) {
    //   navigate("/");
    // }
  }

  // useEffect(() => {
  //   console.log("current user :",currentUser);
  //   if (currentUser !== null) {
  //     navigate("/");
  //   }
  // }, []);

  return (
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        <Form>
          <Input
            onChange={(e) => setUsername(e.target.value)}
            ref={usernameRef}
            placeholder="Username"
          ></Input>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordRef}
            type="password"
            placeholder="Password"
          ></Input>
          <Button onClick={handleClick} disabled={isFetching}>
            LOGIN
          </Button>
          {error && <Error>Something went wrong...</Error>}
          <Link>DO NOT REMEMBER THE PASSWORD?</Link>
          <Link>CREATE A NEW ACCOUNT</Link>
        </Form>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984650/pexels-photo-6984650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-color: red;
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

const Error = styled.span`
  color: red;
`;
