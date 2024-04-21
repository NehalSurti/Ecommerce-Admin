import "./FeaturedInfo.css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useState, useEffect } from "react";
import {
  getMonthlyIncomeAsync,
  getOrdersAsync,
} from "../../redux/features/order/orderThunks";
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
  const [income, setIncome] = useState(0);
  const [perc, setPerc] = useState(0);
  const [users, setUsers] = useState(0);
  const [orders, setOrders] = useState([]);

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
    const getOrders = async () => {
      try {
        const getAllOrders = await dispatch(getOrdersAsync());
        if (getAllOrders.payload) {
          const totalOrders = getAllOrders.payload;
          const pendingOrders = [];
          totalOrders.map((order) => {
            if (order.status === "pending") {
              // setOrders((prev) => [...prev, order]);
              pendingOrders.push(order);
            }
          });
          setOrders(pendingOrders);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getIncome();
    getUsers();
    getOrders();
  }, []);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredtitle">Sales</span>
        {income !== 0 ? (
          <>
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
          </>
        ) : (
          <div className="featuredDataNotAvbl">Data Not Available</div>
        )}
      </div>
      <div className="featuredItem">
        <span className="featuredtitle">Total Users</span>
        {users !== 0 ? (
          <div className="featuredMoneyContainer">
            <span className="featuredMoney">{users}</span>
          </div>
        ) : (
          <div className="featuredDataNotAvbl">Data Not Available</div>
        )}
      </div>
      <div className="featuredItem">
        <span className="featuredtitle">Pending Orders</span>
        {orders.length !== 0 ? (
          <div className="featuredMoneyContainer">
            <span className="featuredMoney">{orders.length}</span>
          </div>
        ) : (
          <div className="featuredDataNotAvbl">Data Not Available</div>
        )}
      </div>
    </div>
  );
}
