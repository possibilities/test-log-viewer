import chunk from 'lodash/chunk'
import keyBy from 'lodash/keyBy'
import React from 'react'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { messages as timingMessages } from '../data/timing-messages.json'

const messages = chunk(timingMessages, 2).map(timingMessages => {
  const timing = keyBy(timingMessages, 'type')
  return {
    from: timing.start.url,
    to: timing.stop.url,
    elapsedMs:
      new Date(timing.stop.stamp).getTime() -
      new Date(timing.start.stamp).getTime(),
  }
})

const Page = () => (
  <>
    <Box paddingBottom={2}>
      <Typography variant='h1'>Screen timings</Typography>
    </Box>
    <Box maxWidth={700}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align='right'>Screen URL</TableCell>
            <TableCell>Elapsed seconds</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {messages.map(message => (
            <TableRow key={message.name}>
              <TableCell align='right' component='th' scope='row'>
                {message.from}
              </TableCell>
              <TableCell>{message.elapsedMs / 1000}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  </>
)

export default Page
