import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto Mono", monospace',
  },
  overrides: {
    MuiTypography: {
      h1: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
      },
      h2: {
        fontSize: '1.0rem',
        fontWeight: 'bold',
      },
      h3: {
        fontSize: '0.9rem',
        fontWeight: 'bold',
      },
    },
  },
})

export default theme
