import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import Chart from "../../components/chart/Chart";
import { userData } from "../../utils/dummyData";
import Widgetsm from "../../components/widgetsm/Widgetsm";
import Widgetlg from "../../components/widgetlg/Widgetlg";
import { userRequest } from "../../utils/requestMethods";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const [userStats, setUserStats] = useState([]);
  const uniqueNamesSet = new Set();
  const { currentUser, isFetching, error } = useSelector((state) => state.user);
  const TOKEN = currentUser.token;
  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        // const res = await userRequest.get("/users/stats");
        const res = await axios.get("http://localhost:5000/api/users/stats",{
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        res.data.map((item) => {
          if (uniqueNamesSet.has(item._id)) {
          } else {
            setUserStats((prev) => [
              ...prev,
              {
                name: MONTHS[item._id - 1],
                "Active User": item.total,
              },
            ]);
            uniqueNamesSet.add(item._id);
          }
        });
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [MONTHS]); // TODO cHECK THE CHART

  return (
    <div className="home">
      <FeaturedInfo></FeaturedInfo>
      <Chart
        data={userStats}
        title="User Analytics"
        grid
        dataKey="Active User"
      ></Chart>
      <div className="homeWidgets">
        <Widgetsm></Widgetsm>
        <Widgetlg></Widgetlg>
      </div>
    </div>
  );
}
