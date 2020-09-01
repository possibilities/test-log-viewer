import React from 'react'
import fs from 'fs'
import Link from '../components/Link'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import formatDate from 'date-fns/formatRFC7231'

export async function getStaticProps() {
  const builds = fs.readdirSync('./data').map(buildId => {
    const { stamp } = JSON.parse(
      fs.readFileSync(`./data/${buildId}/events/api.json`, 'utf8'),
    )
    return { id: buildId, stamp }
  })
  return { props: { builds } }
}

interface Build {
  id: string
  stamp: Date
}

interface PageProps {
  builds: Build[]
}

const Page = ({ builds }: PageProps) => (
  <>
    <Box paddingBottom={1}>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link href='/'>Builds</Link>
        <Typography color='textPrimary'>List</Typography>
      </Breadcrumbs>
    </Box>
    <Table>
      <TableBody>
        {builds.map(build => (
          <TableRow key={build.id}>
            <TableCell component='th' scope='row'>
              {formatDate(new Date(build.stamp))}
            </TableCell>
            <TableCell>
              <Link
                as={`/builds/${build.id}/requests`}
                href={`/builds/[buildId]/requests?buildId=${build.id}`}
              >
                Requests
              </Link>
            </TableCell>
            <TableCell>
              <Link
                as={`/builds/${build.id}/timings`}
                href={`/builds/[buildId]/timings?buildId=${build.id}`}
              >
                Timings
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>
)

export default Page
