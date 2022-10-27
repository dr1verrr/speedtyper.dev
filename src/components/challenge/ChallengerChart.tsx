import 'chartjs-adapter-moment'

import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip
} from 'chart.js'
import { Line } from 'react-chartjs-2'

import { convertMsToTime } from '@/utils/timestamp'

import Metrics from '../metrics/Metrics'
import { Box, Container, Stack } from '../shared'
import { TChallengerResults } from './types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TimeScale
)

function getOptions(stats: TChallengerResults): ChartOptions<'line'> {
  return {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      title: {
        display: true
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          text: 'WPM',
          display: true
        },
        beginAtZero: true,
        axis: 'y'
      },
      x: {
        type: 'time',
        time: {
          stepSize: stats.time / 1000 > 60 ? 5 : 2,
          unit: 'second',
          displayFormats: {
            second: 's'
          },
          tooltipFormat: 's'
        },
        axis: 'x',
        display: true,
        position: 'bottom',
        title: {
          text: 'seconds',
          display: true,
          font: { weight: '700' },
          padding: 30
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  }
}

function getLabels(stats: TChallengerResults) {
  return stats.timeline.map(s => s.time)
}

function getData(stats: TChallengerResults) {
  return {
    labels: getLabels(stats),
    datasets: [
      {
        fill: 'origin',
        label: 'WPM each second',
        data: stats.timeline.map(s => s.wpm),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }
    ]
  }
}

type ChallengerChartProps = {
  statistics: TChallengerResults
}

export default function ChallengerChart({ statistics }: ChallengerChartProps) {
  const data = getData(statistics)
  const options = getOptions(statistics)
  return (
    <Container
      maxWidth='lg'
      sx={{
        padding: 10,
        height: '100%'
      }}
    >
      <Stack
        direction='row'
        spacing={20}
        sx={{ flexWrap: 'wrap', padding: 20, justifyContent: 'center' }}
      >
        <Metrics
          data={[
            ['Time', convertMsToTime(statistics.time)],
            ['WPM', `${Math.floor(statistics.wpm)}`],
            ['Max combo', `${statistics.maxCombo}`],
            ['Errors', `${statistics.errors.length}`],
            ['Accuracy', `${statistics.accuracy.toFixed(2)}%`]
          ]}
          style={{ flex: 1, maxWidth: '33%' }}
        />
      </Stack>

      <Box sx={{ padding: 10 }}>
        <Line
          data={data}
          options={options}
        />
      </Box>
    </Container>
  )
}
