import "./Widgetlg.css";
import { useEffect, useState } from "react";
import { userRequest } from "../../utils/requestMethods";
import { format } from 'date-fns';

export default function Widgetlg() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await userRequest.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getOrders();
  }, []);

  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest Transactions</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Customer</th>
          <th className="widgetLgTh">Date</th>
          <th className="widgetLgTh">Amount</th>
          <th className="widgetLgTh">Status</th>
        </tr>
        {orders.map((order) => {
          return (
            <tr className="widgetLgTr" key={order._id}>
              <td className="widgetLgUser">
                <span className="widgetLgName">{order.userId}</span>
              </td>
              <td className="widgetLgDate">{format (order.createdAt,'MMMM dd, yyyy')}</td>
              <td className="widgetLgAmount">{order.amounts}</td>
              <td className="widgetLgStatus">
                <Button type={order.status} />
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
