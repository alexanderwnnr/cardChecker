import React from 'react';
import { Grid } from '@material-ui/core'
import Visa from './assets/icons8-visa.svg';
import Mastercard from './assets/icons8-mastercard.svg';
import Mir from './assets/icons8-mir-64.png';
import Amex from './assets/icons8-amex.svg';
import { cardPrefixes } from './cardPrefixes.js';

const Logo = ({ type, alt, active }) => {
  let imgClass = 'cc-logo';

  if (active) {
    imgClass = 'cc-logo active';
  }

  return (
    <>
      <img src={type} alt={`${alt} credit card logo`} className={imgClass} />
    </>
  );
}

class CreditCardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxLength: 16,
      cardNumber: '',
      placeholder: 'Enter credit card number',
      activeVisa: false,
      activeMastercard: false,
      activeMir: false,
      activeAmex: false,
      type: '',
      valid: '',
      error: {},
    };
  }

  getValidMessage = () => {
    if (this.state.valid !== '') {
      return this.state.valid ? 'Valid ✓' : 'Credit card number is invalid';
    }
    return '';
  }

  verifyNumber = () => {
    let sum = 0;
    let temp = 0;
    let cardNumberCopy = this.state.cardNumber;
    let checkDigit = parseInt(this.state.cardNumber.slice(-1));
    let parity = cardNumberCopy.length % 2;

    for (let i = 0; i <= cardNumberCopy.length - 2; i++) {
      if (i % 2 === parity) {
        temp = (+cardNumberCopy[i]) * 2;
      }
      else {
        temp = (+cardNumberCopy[i]);
      }

      if (temp > 9) {
        temp -= 9;
      }

      sum += temp;
    }

    return (sum + checkDigit) % 10 === 0;
  }

  purgeInactive = (firstCard, secondCard, thirdCard, fourthCard) => {
    this.setState({
      ['active' + firstCard]: false,
      ['active' + secondCard]: false,
      ['active' + thirdCard]: false,
      ['active' + fourthCard]: true,
      valid: '',
    });
  }

  determineType = (cardNumber) => {

    for (let key of cardPrefixes) {
      for (let value of key[1]) {
        if (cardNumber.startsWith(value)) {
          this.setState({
            type: key[0],
          });

          switch (key[0]) {
            case 'Visa':
              this.purgeInactive('Mastercard', 'Mir', 'Amex', 'Visa');
              break;
            case 'Mastercard':
              this.purgeInactive('Visa', 'Mir', 'Amex', 'Mastercard');
              break;
            case 'Mir':
              this.purgeInactive('Visa', 'Mastercard', 'Amex', 'Mir');
              break;
            case 'Amex':
              this.purgeInactive('Visa', 'Mastercard', 'Mir', 'Amex');
              break;
            default:
              break;
          }

          return;
        }
        else {
          this.setState({
            ['active' + key[0]]: false,
            type: '',
            valid: '',
          });
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.cardNumber !== this.state.cardNumber) {
      this.determineType(this.state.cardNumber);
    }

    if (prevState.activeAmex !== this.state.activeAmex) {
      this.state.activeAmex
        ? this.setState({ maxLength: 15 })
        : this.setState({ maxLength: 16 });
    }

    if (prevState.type !== this.state.type) {
      if (this.state.type !== '') {
        this.setState({
          ['active' + this.state.type]: true,
        });
      }
    }

    if (prevState.cardNumber.length !== this.state.cardNumber.length
        && this.state.cardNumber.length === this.state.maxLength) {
          this.setState({
            valid: this.verifyNumber(),
          });
    }
  }

  handleChange = (e) => {
    this.setState({
      cardNumber: e.target.value
    });
  }

  handleClick = (e) => {
    this.setState({
      cardNumber: '',
      valid: '',
    });
  }

  render() {
    return (
      <Grid container flex-direction='row' justify-content='baseline'xs={12} spacing={3}>
        <Grid>
        <div className='credit-card'>
            <div className='credit-card__logo'>Logo goes here</div>

            <input type="text"
            value={this.state.cardNumber}
            placeholder={this.state.placeholder}
            maxLength={this.state.maxLength}
            onChange={this.handleChange}/>
            
            <div className='credit-card__info'>
                <div className='credit-card__info_name'>
                    <div className='credit-card__info_label'>CARDHOLDER'S NAME</div>
                    <div>NAME SURNAME</div>
                </div>

                <div className='credit-card__info_expiry'>
                    <div className='credit-card__info_label'>VALID UP TO</div>
                    <div>MM/YYYY</div>
                </div>
            </div>

        </div>
        </Grid>
        <Grid item={12}>
        <div className="input-addon">
          <button className="reset" onClick={this.handleClick}>Reset</button>
        </div>
        <div container flex-direction='column' className="error">
          <span className={ this.state.valid? 'error valid' : 'error invalid' }>
              { this.getValidMessage() }
          </span>
        </div>
        <div className='logo'>
        <Logo type={Visa} 
            alt="Visa"
            active={this.state.activeVisa}
          />
          <Logo type={Mastercard} 
            alt= "Mastercard"
            active={this.state.activeMastercard}
          />
          <Logo type={Mir}
            alt="Mir"
            active={this.state.activeMir}
          />
          <Logo type={Amex}
            alt="American Express"
            active={this.state.activeAmex}
          />
        </div>
        </Grid>
      </Grid>
    );
  }
}

function App() {
  return (
      <div className="cc-form">
        <CreditCardForm />
      </div>
  );
}

export default App;