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
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { makeStyles } from '@material-ui/core/styles'
import formatDate from 'date-fns/formatRFC7231'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import chunk from 'lodash/chunk'
import omit from 'lodash/omit'
import pickFp from 'lodash/fp/pick'
import dynamic from 'next/dynamic'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const useStyles = makeStyles(theme => ({
  treeItem: {
    paddingBottom: theme.spacing(1),
  },
}))

export async function getStaticProps() {
  const events = JSON.parse(fs.readFileSync('./data/events.json', 'utf8'))
  return { props: { events } }
}

interface Event {
  url: string
  type: string
  stamp: Date
  data: unknown
}

interface PageProps {
  events: { events: Event[] }
}

const Page = ({ events }: PageProps) => {
  const classes = useStyles()
  return (
    <>
      <Box paddingBottom={1}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link href='/'>Events</Link>
          <Typography color='textPrimary'>List</Typography>
        </Breadcrumbs>
      </Box>
      <TreeView
        disableSelection
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {events.events.map((event, index) => (
          <TreeItem
            nodeId={`${index}`}
            key={index}
            label={event.type}
            className={classes.treeItem}
          >
            <Box paddingTop={1}>
              <ReactJson key={index} src={event.data} name={false} />
            </Box>
          </TreeItem>
        ))}
      </TreeView>
    </>
  )
}

export default Page
