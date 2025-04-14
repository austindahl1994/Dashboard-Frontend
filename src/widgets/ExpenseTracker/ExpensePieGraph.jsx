import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import PropTypes from "prop-types";
// Register required elements
ChartJS.register(ArcElement, Tooltip, Legend);

//need to pass use 2 different arrays passed in, categories without Income and all subcategories, change categories here for dataArr.
// Add in utils file to get categories without income, and another to get subcategories that arent in income category
const ExpensePieGraph = ({ totalsArr, categories, title }) => {
  const generateRandomColors = (num) => {
    return Array.from(
      { length: num },
      () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    );
  };
  const backgroundColors = generateRandomColors(totalsArr.length);
  return (
    <div>
      <Pie
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
                    if (obj.amount < 0) {
                      return Number(acc) + Number(obj.amount);
                    } else {
                      return acc;
                    }
                  }, 0);
                  // console.log(`value: ${value}`);
                  // console.log(`total: ${totalAmount}`);
                  const percentage = ((value / totalAmount) * 100).toFixed();
                  // console.log(percentage)
                  return `${context.label}: ${value} (${percentage}%)`;
                },
              },
            },
            legend: {
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
