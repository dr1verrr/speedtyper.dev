import 'chartjs-adapter-moment'

import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
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
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useParams } from 'react-router-dom'

import { getSession } from '@/api/firestore/challenge'
import { convertMsToTime } from '@/utils/timestamp'

import SpinnerWave from '../loaders/SpinnerWave'
import Metrics from '../metrics/Metrics'
import { Box, Container, Stack } from '../shared'
import { TChallengerResults } from './types.d'

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

export default function ChallengerResults({ stats }: { stats?: TChallengerResults }) {
  const params = useParams() as any
  const [statistics, setStatistics] = useState<TChallengerResults | undefined>(stats)
  const [isLoading, setLoading] = useState(false)
  const [chart, setChart] = useState<
    | {
        options: ChartOptions<'line'>
        data: ChartData<'line', number[], number>
      }
    | undefined
  >()

  useEffect(() => {
    if (chart && statistics) {
      return
    }
    if (stats) {
      setChart({ data: getData(stats), options: getOptions(stats) })
    } else if (params.id) {
      setLoading(true)
      getSession(params.id).then(s => {
        if (s) {
          setChart({ data: getData(s.results), options: getOptions(s.results) })
          setStatistics(s.results)
          setLoading(false)
        }
      })
    }
  }, [statistics, params, chart])

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

  if (chart && statistics) {
    return (
      <Container
        maxWidth='lg'
        sx={{ padding: 10 }}
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
            data={chart.data}
            options={chart.options}
          />
        </Box>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SpinnerWave />
      </Container>
    )
  }

  return null
}
