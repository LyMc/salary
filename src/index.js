import React from 'react'
import ReactDOM from 'react-dom'
import SalaryApp from './App'
import './index.css'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {cyan500, deepPurple500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

injectTapEventPlugin()

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: cyan500,
    // primary2Color: cyan700,
    // primary3Color: grey400,
    accent1Color: deepPurple500, //pinkA200,
    // accent2Color: grey100,
    // accent3Color: grey500,
    // textColor: darkBlack,
    // alternateTextColor: white,
    // canvasColor: white,
    // borderColor: grey300,
    // disabledColor: fade(darkBlack, 0.3),
    // pickerHeaderColor: cyan500,
    // clockCircleColor: fade(darkBlack, 0.07),
    // shadowColor: fullBlack,
  },
})

const Mui = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <SalaryApp muiTheme={muiTheme} />
  </MuiThemeProvider>
)

ReactDOM.render(
  <Mui />,
  document.getElementById('root')
)
