import "./Widgetsm.css";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch } from "react-redux";
import { getAllUsersAsync } from "../../redux/features/user/userThunks";
import { useNavigate } from "react-router-dom";

export default function Widgetsm() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUsers() {
      try {
        const getUsers = await dispatch(getAllUsersAsync(true));
        if (getUsers.payload) {
          setUsers(getUsers.payload);
        } else {
        }
      } catch (error) {}
    }
    getUsers();
  }, []);

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        {users.length !== 0 ? (
          users.map((user) => {
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
                <button
                  onClick={() => navigate(`/user/${user._id}`)}
                  className="widgetSmButton"
                >
                  <VisibilityIcon className="widgetSmIcon"></VisibilityIcon>
                  Display
                </button>
              </li>
            );
          })
        ) : (
          <div className="widgetSmListDataNotAvbl">Data Not Available</div>
        )}
      </ul>
    </div>
  );
}
