import { Bar } from 'react-chartjs-2'
import { generateRandomColors } from '../utils/graphUtils'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = ({labels, datasets}) => {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Finances',
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
  }
  
  return (
    <>
      <Bar
        datasetIdKey="barData"
        data={{
          labels: labels,
          datasets: datasets
        }}
        const options={options}
      />
    </>
  )
}
