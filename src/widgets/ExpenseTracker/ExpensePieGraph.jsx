import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import PropTypes from "prop-types";
import { useMemo, useRef, useState } from "react";
ChartJS.register(ArcElement, Tooltip, Legend);

const legendPositions = ["top", "right", "bottom", "left"];

const ExpensePieGraph = ({ totalsArr, categories, title }) => {
  const chartRef = useRef(null);
  const [legendIndex, setLegendIndex] = useState(0);
  const [showLegend, setShowLegend] = useState(true);

  const generateRandomColors = (num) => {
    return Array.from(
      { length: num },
      () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    );
  };
  const backgroundColors = useMemo(
    () => generateRandomColors(totalsArr.length),
    [totalsArr.length]
  );
  const handleRightClick = (e) => {
    e.preventDefault();
    const newIndex = (legendIndex + 1) % legendPositions.length;
    setLegendIndex(newIndex);
    const chart = chartRef.current;
    if (chart) {
      chart.options.plugins.legend.position = legendPositions[newIndex];
      chart.update();
    }
  };
  const handleLeftClick = (e) => {
    if (e.button === 0) {
      e.preventDefault();
      setShowLegend((prev) => !prev);
      const chart = chartRef.current;
      if (chart) {
        chart.options.plugins.legend.display = !showLegend;
        chart.update();
      }
    }
  };

  return (
    <div>
      <Pie
        ref={chartRef}
        onContextMenu={handleRightClick}
        onClick={handleLeftClick}
        datasetIdKey="pieData"
        data={{
          labels: categories.map((obj) => {
            return title === "Categories" ? obj.category : obj.subCategory;
          }),
          datasets: [
            {
              label: "Expenses",
              data: categories.map((obj) => obj.amount),
              backgroundColor: backgroundColors,
            },
          ],
        }}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed;
                  const totalAmount = totalsArr.reduce((acc, obj) => {
                    return acc + Math.abs(parseFloat(obj.amount));
                  }, 0);
                  const percentage = (Math.abs(value) / totalAmount) * 100;
                  return `${context.label}: ${value.toFixed(
                    2
                  )} (${percentage.toFixed()}%)`;
                },
              },
            },
            legend: {
              display: showLegend,
              position: legendPositions[legendIndex],
              title: {
                display: true,
                text: title,
              },
            },
          },
        }}
      />
    </div>
  );
};

ExpensePieGraph.propTypes = {
  totalsArr: PropTypes.array,
  categories: PropTypes.array,
  title: PropTypes.string,
};

export default ExpensePieGraph;
