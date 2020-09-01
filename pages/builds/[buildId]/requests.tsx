import React from 'react'
import Box from '@material-ui/core/Box'
import dynamic from 'next/dynamic'
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { makeStyles } from '@material-ui/core/styles'
import Link from '../../../components/Link'
import keyBy from 'lodash/keyBy'
import groupBy from 'lodash/groupBy'
import fs from 'fs'

const useStyles = makeStyles(theme => ({
  treeRoot: {
    paddingBottom: theme.spacing(2),
  },
  treeChildRoot: {
    paddingTop: theme.spacing(2),
  },
}))

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

export async function getStaticPaths() {
  const buildIds = fs.readdirSync('./data')
  return {
    fallback: false,
    paths: buildIds.map(buildId => ({ params: { buildId } })),
  }
}

interface StaticProps {
  params: {
    buildId: string
  }
}

export async function getStaticProps({ params: { buildId } }: StaticProps) {
  const { messages } = JSON.parse(
    fs.readFileSync(`./data/${buildId}/api-messages.json`, 'utf8'),
  )
  const requests = Object.values(groupBy(messages, 'requestId')).map(requests =>
    keyBy(requests, 'type'),
  )
  return { props: { buildId, requests } }
}

interface Request {
  request: {
    requestId: string
    method: 'GET' | 'PUT' | 'POST'
    path: string
    body?: unknown
  }
  response: {
    requestId: string
    method: 'GET' | 'PUT' | 'POST'
    path: string
    status: number
    body: unknown
  }
}

interface PageProps {
  buildId: string
  requests: Request[]
}

const Page = ({ buildId, requests }: PageProps) => {
  const classes = useStyles()
  return (
    <>
      <Box paddingBottom={1}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link href='/'>Builds</Link>
          <Typography color='textPrimary'>Requests</Typography>
          <Link
            as={`/builds/${buildId}/requests`}
            href={`/builds/[buildId]/requests?buildId=${buildId}`}
          >
            {buildId}
          </Link>
        </Breadcrumbs>
      </Box>
      <Box paddingTop={1}>
        <TreeView
          disableSelection
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {requests.map(message => (
            <TreeItem
              key={message.request.requestId}
              nodeId={message.request.requestId}
              label={`${message.request.method} ${message.request.path} ${message.response.status}`}
              className={classes.treeRoot}
            >
              {message.request.body && (
                <TreeItem
                  nodeId={'request-' + message.request.requestId}
                  label='request'
                  className={classes.treeChildRoot}
                >
                  <Box paddingTop={2}>
                    <ReactJson
                      src={message.request.body as object}
                      name={false}
                    />
                  </Box>
                </TreeItem>
              )}
              {message.response.body && (
                <TreeItem
                  nodeId={'response-' + message.response.requestId}
                  label='response'
                  className={classes.treeChildRoot}
                >
                  <Box paddingTop={2}>
                    <ReactJson
                      src={message.response.body as object}
                      name={false}
                    />
                  </Box>
                </TreeItem>
              )}
            </TreeItem>
          ))}
        </TreeView>
      </Box>
    </>
  )
}

export default Page
