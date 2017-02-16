import React from 'react'
import TextField from 'material-ui/TextField'
import Slider from 'material-ui/Slider'
import {Card, CardText} from 'material-ui/Card'
import Icon from './Icon'
import Config from './Config'

class SalaryApp extends React.Component {
  constructor (props) {
    super(props)
    this.defaultState = {
      c: [
        {name: 'EUR', change: 1, icon: 'euro_symbol'},
        {name: 'USD', change: 1.07, icon: 'attach_money'},
        {name: 'RON', change: 4.52, icon: 'RON'}
      ],
      p: [
        {name: 'hourly', duration: 1, icon: 'access_time'},
        {name: 'monthly', duration: 173.33, icon: 'today'},
        {name: 'annually', duration: 40*52, icon: 'view_comfy'}
      ],
      current: {min: 1, max: 10, value: 5, c: 0, p: 0, editing: '', editingCell: [-1, -1]},
      flipped: false
    }
    const localState = window.localStorage && window.localStorage.state ? JSON.parse(window.localStorage.state) : {}
    this.state = Object.assign({}, this.defaultState, localState)
    this.stateChanged = false
    this.colors = {
      accent: this.props.muiTheme.palette.primary1Color,
      primary: this.props.muiTheme.palette.accent1Color,
      text: this.props.muiTheme.palette.textColor
    }
  }
  componentDidMount() {
    setInterval(function () {
      if (this.stateChanged) {
        window.localStorage.state = JSON.stringify(this.state)
        this.stateChanged = false
      }
    }.bind(this), 10000)
  }

  parseNumber = number => isNaN(parseFloat(number)) ? 0 : parseFloat(number)
  norm(value, duration = this.state.current.p, change = this.state.current.c) {
    return +value / this.state.c[change].change / this.state.p[duration].duration
  }
  disp(value, duration = this.state.current.p, change = this.state.current.c) {
    return +value * this.state.c[change].change * this.state.p[duration].duration
  }
  between(value, min = this.norm(this.state.current.min), max = this.norm(this.state.current.max)) {
    return Math.min(Math.max(+value, min), max)
  }
  displayHours(value, hours = false) {
    return hours ? (+value * 100).toFixed(0) / 100 : (+value).toFixed(0)
  }
  slideChange(_, value) {
    this.setState({
      current: {...this.state.current, value: this.norm(value)}
    })
  }
  valueChange(durationIndex, changeIndex) {
    return function(_, value) {
      this.setState({
        current: {
          ...this.state.current,
          editing: value,
          value: this.between(this.norm(this.parseNumber(value), durationIndex, changeIndex))
        }
      })
    }.bind(this)
  }
  focusEditing(durationIndex, changeIndex) {
    return function () {
      this.setState({
        current: {
          ...this.state.current,
          editing: durationIndex === -1 || changeIndex === -1 ? '' : this.displayHours(this.disp(this.state.current.value, durationIndex, changeIndex), durationIndex === 0),
          editingCell: [durationIndex, changeIndex]
        }
      })
    }.bind(this)
  }
  changeMinMax(type) {
    return function (_, value) {
      let current = {...this.state.current}
      if (type === 'min') {
        current.min = +value
      }
      if (type === 'max') {
        current.max = +value
      }
      if (type === 'value') {
        current.value = this.between(current.value)
      }
      this.setState({
        current: current
      })
    }.bind(this)
  }
  changeDefaults(period, currency) {
    return function() {
      // ceva mai simplu pentru clonarea unui obiect?
      let current = Object.assign({}, this.state.current)
      if (period !== -1) {
        current.p = period
      }
      if (currency !== -1) {
        current.c = currency
      }
      current.min = +this.displayHours(this.disp(this.norm(current.min), current.p, current.c))
      current.max = +this.displayHours(this.disp(this.norm(current.max), current.p, current.c))
      console.log(current)
      this.setState({
        current: current
      })
    }.bind(this)
  }
  flipCard() {
    this.setState({
      flipped: !this.state.flipped
    })
  }
  configChange(currencyName) {
    return function (_, value) {
      const newCurrency = this.state.c.map(function (currency) {
        if (currency.name === currencyName) {
          currency.change = value
        }
        return currency
      })
      this.setState({
        c: newCurrency
      })
    }.bind(this)
  }
  deleteCurrency(currencyName) {
    return function () {
      const newCurrency = this.state.c.filter(currency => currency.name !== currencyName)
      this.setState({
        c: newCurrency
      })
    }.bind(this)
  }
  restoreDefault() {
    this.setState({...this.defaultState, flipped: true})
  }
  configCurrency(key, name, value) {
    const newCurrency = this.state.c.map(currency => {
      if (currency.name === name) {
        currency[key] = value
      }
      return currency
    })
    this.setState({
      c: newCurrency
    })
  }
  render() {
    this.stateChanged = true
    const {accent, primary, text} = this.colors
    return (
      <div id="salary-app">
        <div className={this.state.flipped ? 'flip-effect flipped' : 'flip-effect'}>
          <Card>
            <CardText>
              <div className="settings">
                <Icon name="help"/>
                <Icon name="settings" onClick={this.flipCard.bind(this)}/>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col first-col"></div>
                  {this.state.c.map((currency, j) => (
                    <div className="col" key={currency.name}>
                      <Icon name={currency.icon} onClick={this.changeDefaults(-1, j)} style={{
                        color: j === this.state.current.c ? accent : primary
                      }}/>
                    </div>
                  ))}
                </div>
                {this.state.p.map((period, i) => (
                  <div className="row" key={period.name}>
                    <div className="col first-col">
                      <Icon name={period.icon} onClick={this.changeDefaults(i, -1)} style={{
                        color: i === this.state.current.p ? accent : primary
                      }}/>
                    </div>
                    {this.state.c.map((currency, j) => (
                      <div className="col" key={currency.name}>
                        <TextField
                          type="number"
                          name={currency.name + '-' + period.name}
                          value={i === this.state.current.editingCell[0] && j === this.state.current.editingCell[1] ? this.state.current.editing : this.displayHours(this.disp(this.state.current.value, i, j), i === 0)}
                          onChange={this.valueChange(i, j)}
                          onClick={this.changeDefaults(i, j)}
                          onFocus={this.focusEditing(i, j)}
                          onBlur={this.focusEditing(-1, -1)}
                          style={{
                            width: 'auto'
                          }}
                          inputStyle={{
                            color: i === this.state.current.p && j === this.state.current.c ? accent : text
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
                <div className="row" style={{
                  justifyContent: 'space-between'
                }}>
                  <TextField
                    className="col"
                    type="number"
                    floatingLabelText="min"
                    value={this.state.current.min}
                    onChange={this.changeMinMax('min')}
                    onBlur={this.changeMinMax('value')}
                    style={{
                      width: 63,
                      flex: '0 0 63px'
                    }}
                  />
                  <div className="col" style={{
                    flex: '0 0 100px',
                    paddingTop: 40,
                    color: accent
                  }}>{this.state.c[this.state.current.c].name} / {this.state.p[this.state.current.p].name}</div>
                  <TextField
                    className="col"
                    type="number"
                    floatingLabelText="max"
                    value={this.state.current.max}
                    onChange={this.changeMinMax('max')}
                    onBlur={this.changeMinMax('value')}
                    style={{
                      width: 63,
                      flex: '0 0 63px'
                    }}
                  />
                </div>
                <Slider
                  className="my-slider"
                  min={this.state.current.min}
                  max={this.state.current.max}
                  value={this.disp(this.between(this.state.current.value))}
                  onChange={this.slideChange.bind(this)}
                  sliderStyle={{
                    margin: 0
                  }}
                />
              </div>
            </CardText>
          </Card>
          <Config
            flipCard={this.flipCard.bind(this)}
            c={this.state.c}
            p={this.state.p}
            deleteCurrency={this.deleteCurrency.bind(this)}
            restoreDefault={this.restoreDefault.bind(this)}
            configCurrency={this.configCurrency.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default SalaryApp
