import keyBy from 'lodash/keyBy'
import groupBy from 'lodash/groupBy'
import dynamic from 'next/dynamic'
import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { makeStyles } from '@material-ui/core/styles'
import apiMessages from '../data/api-messages.json'

const useStyles = makeStyles(theme => ({
  treeRoot: {
    paddingBottom: theme.spacing(1),
  },
  treeChildRoot: {
    paddingTop: theme.spacing(1),
  },
}))

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const messages = Object.values(
  groupBy(apiMessages, 'requestId'),
).map(messages => keyBy(messages, 'type'))

const Page = () => {
  const classes = useStyles()
  return (
    <>
      <Box paddingBottom={2}>
        <Typography variant='h1'>API requests</Typography>
      </Box>
      <TreeView
        disableSelection
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {messages.map(message => (
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
