import React from 'react'
import fs from 'fs'
import Chart from 'react-google-charts'
import Link from '../components/Link'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import formatDate from 'date-fns/formatRFC7231'
import groupBy from 'lodash/groupBy'
import chunk from 'lodash/chunk'
import range from 'lodash/range'

export async function getStaticProps() {
  const buildTimings = fs.readdirSync('./data').map(buildId => {
    const timing = JSON.parse(
      fs.readFileSync(`./data/${buildId}/events/timing.json`, 'utf8'),
    )
    return { id: buildId, ...timing }
  })
  const timingsByUrl = groupBy(
    chunk(
      buildTimings.flatMap(timing => timing.events),
      2,
    ),
    '[0].url',
  )
  const timingUrlsToDisplay = buildTimings[0].events
    .filter(event => event.type === 'start')
    .map(event => event.url)
  const builds = timingUrlsToDisplay.map(url => ({
    url,
    timings: timingsByUrl[url],
  }))
  return { props: { builds } }
}

interface Build {
  id: string
  stamp: Date
}

interface PageProps {
  builds: Build[]
}

const toLineColumns = builds => ['Date', ...builds.map(build => build.url)]

const toLineData = builds => {
  const lines = builds.slice(2, 3).map(build => {
    const timings = build.timings.map(
      (timing, index) =>
        new Date(timing[1].stamp).getTime() -
        new Date(timing[0].stamp).getTime(),
    )
    return { timings, url: build.url }
  })
  const numberOfSamples = lines[0].timings.length
  return {
    builds,
    lineData: range(numberOfSamples).map(n => [
      new Date(builds[0].timings[0][0].stamp).getTime(),
      ...lines.map(line => line.timings[n] / 1000),
    ]),
    lines,
  }
}

const Page = ({ builds }: PageProps) => (
  <>
    <Box paddingBottom={1}>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link href='/'>Timings</Link>
        <Typography color='textPrimary'>Dashboard</Typography>
      </Breadcrumbs>
      <Chart
        chartType='Line'
        width='100%'
        height='800px'
        data={[toLineColumns(builds), ...toLineData(builds).lineData]}
        options={{
          title: 'Timings',
        }}
      />
    </Box>
  </>
)
// <pre>{JSON.stringify(builds, null, 2)}</pre>

export default Page
