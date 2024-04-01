import { useEffect, useState } from "react";
import "./Widgetsm.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { userRequest } from "../../utils/requestMethods";

export default function Widgetsm() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await userRequest.get("/users?new=true");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        {users.map((user) => {
          return (
            <li className="widgetSmListItem" key={user._id}>
              <img
                src={
                  user.img ||
                  "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"
                }
                alt=""
                className="widgetSmImg"
              />
              <div className="widgetSmUser">
                <span className="widgetSmUsername">{user.username}</span>
              </div>
              <button className="widgetSmButton">
                <VisibilityIcon className="widgetSmIcon"></VisibilityIcon>
                Display
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
