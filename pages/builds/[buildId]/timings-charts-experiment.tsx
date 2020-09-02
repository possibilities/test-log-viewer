import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Chart from 'react-google-charts'
import Link from '../../../components/Link'
import chunk from 'lodash/chunk'
import keyBy from 'lodash/keyBy'
import fs from 'fs'

const columns = [
  { type: 'string', id: 'path' },
  { type: 'number', id: 'start' },
  { type: 'number', id: 'end' },
]

export async function getStaticPaths() {
  const buildIds = fs.readdirSync('./data')
  return {
    fallback: false,
    paths: buildIds.map(buildId => ({ params: { buildId } })),
  }
}

interface TimingMessage {
  url: string
  stamp: Date
  type: 'start' | 'stop'
}

interface StaticProps {
  params: {
    buildId: string
  }
}

export async function getStaticProps({ params: { buildId } }: StaticProps) {
  const { events: messages } = JSON.parse(
    fs.readFileSync(`./data/${buildId}/events/timing.json`, 'utf8'),
  )
  const timings = chunk(messages as TimingMessage[], 2).map(messages => {
    const timing = keyBy(messages, 'type')
    return {
      from: timing.start.url,
      to: timing.stop.url,
      startMs: new Date(timing.start.stamp).getTime(),
      stopMs: new Date(timing.stop.stamp).getTime(),
      elapsedMs:
        new Date(timing.stop.stamp).getTime() -
        new Date(timing.start.stamp).getTime(),
    }
  })

  return { props: { buildId, timings } }
}

interface Timing {
  from: string
  elapsedMs: number
}

interface PageProps {
  buildId: string
  timings: Timing[]
}

const timingViewToTimelineRow = timingView => [
  timingView.from,
  timingView.startMs,
  timingView.stopMs,
]

const removeSpace = allTimingViews => (timingView, index) => {
  const prevRange = allTimingViews.slice(0, index + 1)
  console.log(timingView.from, allTimingViews.slice(0, index + 1))
  let space = 0
  prevRange.forEach((timingView, index) => {
    if (index >= 1) {
      space = space + (timingView.startMs - prevRange[index - 1].stopMs)
    }
  })
  return {
    ...timingView,
    startMs: timingView.startMs - space,
    stopMs: timingView.stopMs - space,
  }
}

const timingsToTimelineRows = timings => {
  const rowsA = timings.map(removeSpace(timings))
  const rows = rowsA.map(timingViewToTimelineRow)
  return rows
}

const Page = ({ buildId, timings }: PageProps) => (
  <>
    <Box paddingBottom={1}>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link href='/'>Builds</Link>
        <Typography color='textPrimary'>Timings Charts Experiment</Typography>
        <Link
          as={`/builds/${buildId}/timings-charts-experiment`}
          href={`/builds/[buildId]/timings-charts-experiment?buildId=${buildId}`}
        >
          {buildId}
        </Link>
      </Breadcrumbs>
    </Box>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell size='small'>Screen URL</TableCell>
          <TableCell>Elapsed seconds</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {timings.map((message, index) => (
          <TableRow key={index}>
            <TableCell size='small' component='th' scope='row'>
              {message.from}
            </TableCell>
            <TableCell>{message.elapsedMs / 1000}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <Box paddingTop={4}>
      <Chart
        chartType='Timeline'
        data={[columns, ...timingsToTimelineRows(timings)]}
        width='100%'
        height={(timings.length + 1) * 40 + 20 + 'px'}
      />
    </Box>
  </>
)

export default Page
