import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const YtdBarChart = ({ monthLabels, datasets }) => {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Finances",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <>
      <Bar
        datasetIdKey="barData"
        data={{
          labels: monthLabels,
          datasets: datasets,
        }}
        const
        options={options}
      />
    </>
  );
};

YtdBarChart.propTypes = {
  monthLabels: PropTypes.string,
  datasets: PropTypes.object,
};

export default YtdBarChart;
