import React, { Component } from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.currencies = ["AUD", "CAD", "CHF", "USD", "NZD", "EUR", "GBP"];
    this.cached = [];
    this.state = {
      base: "USD",
      target: "EUR",
      value: 0,
      converted: 0,
    };
  }

  makeSelection = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      this.recalculate
    );
  };

  changeValue = (event) => {
    this.setState(
      {
        value: event.target.value,
      },
      this.recalculate
    );
  };

  recalculate = () => {
    const value = parseFloat(this.state.value);
    if (isNaN(value)) {
      return;
    }
    if (
      this.cached[this.state.base] !== undefined &&
      Date.now() - this.cached[this.state.base].timestamp < 10000 * 60
    ) {
      this.setState({
        converted:
          this.cached[this.state.base].rates[this.state.target] * value,
      });
    }
    fetch(`https://api.exchangeratesapi.io/latest?base=${this.state.base}`)
      .then((response) => response.json())
      .then((data) => {
        this.cached[this.state.base] = {
          rates: data.rates,
          timestamp: Date.now(),
        };
        this.setState({
          converted: data.rates[this.state.target] * value,
        });
      });
  };

  render() {
    return (
      <div className="App">
        <div>
          <select
            onChange={this.makeSelection}
            name="base"
            value={this.state.base}
          >
            {this.currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input value={this.state.value} onChange={this.changeValue} />
        </div>
        <div>
          <select
            onChange={this.makeSelection}
            name="target"
            value={this.state.target}
          >
            {this.currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input
            disable={true}
            value={
              this.state.converted === null
                ? "Calculating"
                : this.state.converted
            }
          />
        </div>
      </div>
    );
  }
}

export default App;
