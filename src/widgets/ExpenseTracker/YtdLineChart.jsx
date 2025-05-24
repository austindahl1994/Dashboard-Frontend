import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const YtdLineChart = ({ labels, datasets, data }) => {
  const options = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Chart.js Line Chart",
        },
      },
    },
  };

  return (
    <>
      <Line
        datasetIdKey="expenseLineChart"
        data={{
          labels: labels,
          datasets: datasets,
        }}
        options={options}
      />
    </>
  );
};

YtdLineChart.propTypes = {
  labels: PropTypes.string,
  datasets: PropTypes.object,
  data: PropTypes.object,
};

export default YtdLineChart;
