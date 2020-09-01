import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Link from '../../../components/Link'
import chunk from 'lodash/chunk'
import keyBy from 'lodash/keyBy'
import fs from 'fs'

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

const Page = ({ buildId, timings }: PageProps) => (
  <>
    <Box paddingBottom={1}>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link href='/'>Builds</Link>
        <Typography color='textPrimary'>Timings</Typography>
        <Link
          as={`/builds/${buildId}/timings`}
          href={`/builds/[buildId]/timings?buildId=${buildId}`}
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
  </>
)

export default Page
