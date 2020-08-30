import React from 'react'
import Box from '@material-ui/core/Box'
import dynamic from 'next/dynamic'
import Typography from '@material-ui/core/Typography'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { makeStyles } from '@material-ui/core/styles'
import keyBy from 'lodash/keyBy'
import groupBy from 'lodash/groupBy'
import fs from 'fs'

const useStyles = makeStyles(theme => ({
  treeRoot: {
    paddingBottom: theme.spacing(1),
  },
  treeChildRoot: {
    paddingTop: theme.spacing(1),
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

export async function getStaticProps({ params: { buildId } }) {
  const { messages } = JSON.parse(
    fs.readFileSync(`./data/${buildId}/api-messages.json`, 'utf8'),
  )
  const requests = Object.values(groupBy(messages, 'requestId')).map(requests =>
    keyBy(requests, 'type'),
  )
  return { props: { buildId, requests } }
}

const Page = ({ buildId, requests }) => {
  const classes = useStyles()
  return (
    <>
      <Box paddingBottom={2}>
        <Typography variant='h1'>Build {buildId}</Typography>
      </Box>
      <Box paddingBottom={2}>
        <Typography variant='h2'>Requests</Typography>
      </Box>
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
                <Box paddingTop={1}>
                  <ReactJson src={message.request.body} name={false} />
                </Box>
              </TreeItem>
            )}
            {message.response.body && (
              <TreeItem
                nodeId={'response-' + message.response.requestId}
                label='response'
                className={classes.treeChildRoot}
              >
                <Box paddingTop={1}>
                  <ReactJson src={message.response.body} name={false} />
                </Box>
              </TreeItem>
            )}
          </TreeItem>
        ))}
      </TreeView>
    </>
  )
}

export default Page
