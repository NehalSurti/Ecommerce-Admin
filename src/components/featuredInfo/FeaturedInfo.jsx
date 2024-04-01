import "./FeaturedInfo.css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useState, useEffect } from "react";
import { userRequest } from "../../utils/requestMethods";

function calculatePercentageDifference(number1, number2) {
  var difference = number1 - number2;
  var average = (number1 + number2) / 2;
  var percentageDifference = -((difference / average) * 100);
  return percentageDifference.toFixed(2);
}

export default function FeaturedInfo() {
  const [income, setIncome] = useState([]);
  const [perc, setPerc] = useState(0);

  useEffect(() => {
    const getIncome = async () => {
      try {
        const res = await userRequest.get("/orders/income");
        setIncome(res.data);
        setPerc(
          calculatePercentageDifference(res.data[0].total, res.data[1].total)
        );
      } catch (err) {
        console.log(err);
      }
    };
    getIncome();
  }, []);

  // console.log(income[1].total);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredtitle">Revenue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${income[1]?.total}</span>
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
      </div>
      <div className="featuredItem">
        <span className="featuredtitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$4,415</span>
          <span className="featuredMoneyRate">
            -11.4 <ArrowDownwardIcon className="featuredIcon negative" />
          </span>
        </div>
        <div className="featuredSub">Compared to last month</div>
      </div>
      <div className="featuredItem">
        <span className="featuredtitle">Cost</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$2,225</span>
          <span className="featuredMoneyRate">
            +2.4 <ArrowUpwardIcon className="featuredIcon" />
          </span>
        </div>
        <div className="featuredSub">Compared to last month</div>
      </div>
    </div>
  );
}
