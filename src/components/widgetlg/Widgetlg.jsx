import "./Widgetlg.css";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { getOrdersAsync } from "../../redux/features/order/orderThunks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Widgetlg() {
  const [orders, setOrders] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const getOrders = await dispatch(getOrdersAsync(true));
        if (getOrders.payload) {
          setOrders(getOrders.payload);
        } else {
        }
      } catch (err) {}
    };
    getOrders();
  }, []);

  const Button = ({ type }) => {
    return (
      <button className={"widgetLgButton " + type}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    );
  };

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest Transactions</h3>
      {orders.length !== 0 ? (
        <table className="widgetLgTable">
          <tr className="widgetLgTr">
            <th className="widgetLgTh">Order Id</th>
            <th className="widgetLgTh">Date</th>
            <th className="widgetLgTh">Amount</th>
            <th className="widgetLgTh">Payment Status</th>
            <th className="widgetLgTh">Order Status</th>
          </tr>
          {orders.map((order) => {
            return (
              <tr className="widgetLgTr" key={order._id}>
                <td
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="widgetLgUser"
                >
                  <span className="widgetLgName">{order._id}</span>
                </td>
                <td className="widgetLgDate">
                  {format(order.createdAt, "MMMM dd, yyyy")}
                </td>
                <td className="widgetLgAmount">₹{order.amounts}</td>
                <td className={`widgetLgPaymentStatus ${order.paymentStatus}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </td>
                <td
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="widgetLgStatus"
                >
                  <Button type={order.status} />
                </td>
              </tr>
            );
          })}
        </table>
      ) : (
        <div className="widgetLgDataNotAvbl">Data Not Available</div>
      )}
    </div>
  );
}
