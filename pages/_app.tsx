import React, { useEffect, ReactNode } from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider as MaterialUiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import theme from '../modules/theme'
import Link from '../components/Link'
import { Stack, Columns, Column, Box } from 'mui-primitives'

const Layout = ({ children }: { children: ReactNode }) => (
  <Box padding={2} paddingTop={0}>
    <Stack space={2}>
      <Columns space={1}>
        <Column width='content'>
          <Link href='/'>api</Link>
        </Column>
        <Column width='content'>|</Column>
        <Column>
          <Link href='/timings'>timings</Link>
        </Column>
      </Columns>
      {children}
    </Stack>
  </Box>
)

const App = (props: AppProps) => {
  const { Component, pageProps } = props

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      const parentElement = jssStyles.parentElement as HTMLElement
      parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
        <title>Test Log Viewer</title>
      </Head>
      <MaterialUiThemeProvider theme={theme}>
        <StyledComponentsThemeProvider theme={theme}>
          <CssBaseline />
          <Box padding={2}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Box>
        </StyledComponentsThemeProvider>
      </MaterialUiThemeProvider>
    </>
  )
}

export default App
