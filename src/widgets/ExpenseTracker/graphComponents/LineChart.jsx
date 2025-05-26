import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const LineChart = ({idKey, labels, datasets}) = > {
  const options = {
    type: 'line',
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        }
      }
    },
  };
  return (
    <>
      {datasets.length === 0 ? null : 
        <Line 
          datasetIdKey={idKey}
          datas={{
            labels: labels,
            datasets: datasets
          }}
          options={options}
        />
      }
    </>
  )
}
