import "./FeaturedInfo.css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useState, useEffect } from "react";
import { getMonthlyIncomeAsync } from "../../redux/features/order/orderThunks";
import { useDispatch } from "react-redux";
import { getAllUsersAsync } from "../../redux/features/user/userThunks";

function calculatePercentageDifference(number1, number2) {
  var difference = number1 - number2;
  var average = (number1 + number2) / 2;
  var percentageDifference = -((difference / average) * 100);
  return percentageDifference.toFixed(2);
}

export default function FeaturedInfo() {
  const dispatch = useDispatch();
  const [income, setIncome] = useState([]);
  const [perc, setPerc] = useState(0);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    const getIncome = async () => {
      try {
        const getSalesStats = await dispatch(getMonthlyIncomeAsync());
        if (getSalesStats.payload) {
          const salesStatslist = getSalesStats.payload
            .slice()
            .sort((a, b) => a._id - b._id);

          const date = new Date();
          const month = date.getMonth() + 1;

          setIncome(salesStatslist[month - 1].total);
          setPerc(
            calculatePercentageDifference(
              salesStatslist[month - 2].total,
              salesStatslist[month - 1].total
            )
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    getIncome();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const getAllUsers = await dispatch(getAllUsersAsync());
        if (getAllUsers.payload) {
          const totalUsers = getAllUsers.payload.length;
          setUsers(totalUsers);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="featured">
      {/* <div className="featuredItem">
        <span className="featuredtitle">Revenue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">₹{income[1]?.total}</span>
          <span className="featuredMoneyRate">
            { Math.abs(perc)}{" "}
            {perc < 0 ? (
              <ArrowDownwardIcon className="featuredIcon negative" />
            ) : (
              <ArrowUpwardIcon className="featuredIcon" />
            )}
          </span>
        </div>
        <div className="featuredSub">Compared to last month</div>
      </div> */}
      <div className="featuredItem">
        <span className="featuredtitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">₹{income}</span>
          <span className="featuredMoneyRate">
            {perc > 0 ? `+${perc}` : `-${perc}`}{" "}
            {perc > 0 ? (
              <ArrowUpwardIcon className="featuredIcon" />
            ) : (
              <ArrowDownwardIcon className="featuredIcon negative" />
            )}
          </span>
        </div>
        <div className="featuredSub">Compared to last month</div>
      </div>
      <div className="featuredItem">
        <span className="featuredtitle">Total Users</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{users}</span>
          {/* <span className="featuredMoneyRate">
            {perc > 0 ? `+${perc}` : `-${perc}`}{" "}
            {perc > 0 ? (
              <ArrowUpwardIcon className="featuredIcon" />
            ) : (
              <ArrowDownwardIcon className="featuredIcon negative" />
            )}
          </span> */}
        </div>
        {/* <div className="featuredSub">Compared to last month</div> */}
      </div>
      {/* <div className="featuredItem">
        <span className="featuredtitle">Cost</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">₹2,225</span>
          <span className="featuredMoneyRate">
            +2.4 <ArrowUpwardIcon className="featuredIcon" />
          </span>
        </div>
        <div className="featuredSub">Compared to last month</div>
      </div> */}
    </div>
  );
}
