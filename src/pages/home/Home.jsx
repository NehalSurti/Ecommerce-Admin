import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import Chart from "../../components/chart/Chart";
import Widgetsm from "../../components/widgetsm/Widgetsm";
import Widgetlg from "../../components/widgetlg/Widgetlg";
import { useDispatch } from "react-redux";
import { getUserStatsAsync } from "../../redux/features/user/userThunks";
import { getMonthlyIncomeAsync } from "../../redux/features/order/orderThunks";

export default function Home() {
  const dispatch = useDispatch();
  const [userStats, setUserStats] = useState([]);
  const [salesStats, setSalesStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const uniqueNamesSetUserId = new Set();
  const uniqueNamesSetSalesId = new Set();

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
    setLoading(true);
    const getUserStats = async () => {
      try {
        const getUserStats = await dispatch(getUserStatsAsync());
        if (getUserStats.payload) {
          const userStatslist = getUserStats.payload
            .slice()
            .sort((a, b) => a._id - b._id);

          userStatslist.map((item) => {
            if (uniqueNamesSetUserId.has(item._id)) {
            } else {
              setUserStats((prev) => [
                ...prev,
                {
                  name: MONTHS[item._id - 1],
                  "Active User": item.total,
                },
              ]);
              uniqueNamesSetUserId.add(item._id);
            }
          });
        } else {
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getUserStats();
  }, [MONTHS]);

  useEffect(() => {
    const getSalesStats = async () => {
      try {
        const getSalesStats = await dispatch(getMonthlyIncomeAsync());
        if (getSalesStats.payload) {
          const salesStatslist = getSalesStats.payload
            .slice()
            .sort((a, b) => a._id - b._id);

          salesStatslist.map((item) => {
            if (uniqueNamesSetSalesId.has(item._id)) {
            } else {
              setSalesStats((prev) => [
                ...prev,
                {
                  name: MONTHS[item._id - 1],
                  Sales: item.total,
                },
              ]);
              uniqueNamesSetSalesId.add(item._id);
            }
          });
        } else {
        }
      } catch (err) {
        console.log(err);
      }
    };
    getSalesStats();
  }, [MONTHS]);

  return (
    <div className="home">
      {loading ? (
        <div className="loadingIndicator"></div>
      ) : (
        <>
          <FeaturedInfo></FeaturedInfo>
          <div className="homeCharts">
            <div className="homeChartsLeft">
              <Chart
                data={userStats}
                title="User Analytics"
                grid
                dataKey="Active User"
              ></Chart>
            </div>
            <div className="homeChartsRight">
              <Chart
                data={salesStats}
                title="Sales Analytics"
                grid
                dataKey="Sales"
              ></Chart>
            </div>
          </div>
          <div className="homeWidgets">
            <Widgetsm></Widgetsm>
            <Widgetlg></Widgetlg>
          </div>
        </>
      )}
    </div>
  );
}
