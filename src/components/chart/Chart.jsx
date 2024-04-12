import "./Chart.css";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Chart({ title, data, dataKey, grid }) {
  return (
    <div className="chart">
      <h3 className="chartTitle">{title}</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" aspect={4 / 1}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
            <XAxis dataKey="name" stroke="#5550bd" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#5550bd"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="noChart">Data Not Available</div>
      )}
    </div>
  );
}
