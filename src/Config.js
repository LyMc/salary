import React from 'react'
import {Card, CardText} from 'material-ui/Card'
import Icon from './Icon'
import TextField from 'material-ui/TextField'

class Config extends React.Component {
  /*constructor(props) {
    super(props)
  }*/
  configCurrency(key, name) {
    return function (_, value) {
      this.props.configCurrency(key, name, value)
    }.bind(this)
  }
  render() {
    return (
      <Card>
        <CardText>
          <div className="settings">
            <Icon name="restore" onClick={this.props.restoreDefault}/>
            <Icon name="close" onClick={this.props.flipCard}/>
          </div>
          <div className="container">
            <div className="row"><h3>Currencies</h3></div>
            <div className="row">
              <div className="col">Name</div>
              <div className="col">Change</div>
              <div className="col">Icon</div>
              <div className="col" style={{width: 24, flex: '0 0 24px'}}></div>
            </div>
            {this.props.c.map((currency) => (
              <div className="row" key={currency.name}>
                <div className="col">
                  <TextField
                    name={currency.name + '-name'}
                    value={currency.name}
                    style={{
                      width: 'auto'
                    }}
                    onChange={this.configCurrency('name', currency.name)}
                  />
                </div>
                <div className="col">
                  <TextField
                    name={currency.name + '-change'}
                    value={currency.change}
                    style={{
                      width: 'auto'
                    }}
                    onChange={this.props.configChange(currency.name)}
                  />
                </div>
                <div className="col">
                  <TextField
                    name={currency.name + '-icon'}
                    value={currency.icon}
                    style={{
                      width: 'auto'
                    }}
                  />
                </div>
                <div className="col" style={{width: 24, flex: '0 0 24px'}} onClick={this.props.deleteCurrency(currency.name)}><Icon name="delete"/></div>
              </div>
            ))}
          </div>
        </CardText>
      </Card>
    )
  }
}

export default Config