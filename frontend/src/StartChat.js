import React, { PureComponent } from 'react';
import { post } from "./Http";

export class StartChat extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { identity: '', chatWith: '', step: 'identity' };
  }

  _handleIdentityChange = (event) => {
    this.setState({ identity: event.target.value });
  };

  _handleNext = (event) => {
    event.preventDefault();
    this.setState({
      step: 'chatWith'
    })
  };

  _handleChatWithChange = (event) => {
    this.setState({ chatWith: event.target.value });
  };

  _handleSubmit = (event) => {
    event.preventDefault();
    post("http://localhost:8080/v1/authenticate", { identity: this.state.identity })
      .then(res => this.props.setChat({
        identity:  this.state.identity,
        chatWith:  this.state.chatWith,
        authToken: res.authToken
      }));
  };

  _buildForm = (field, title, subtitle, submitLabel, submit, handleFieldChange) => {
    return (
      <div className="container">
        <form className="card" onSubmit={submit}>
          <label htmlFor={field}>{title}</label>
          <div className='subtitle'>{subtitle}</div>
          <input id="identity" type="text" name={field} value={this.state[field]} onChange={handleFieldChange}/>
          <input type="submit" value={submitLabel}/>
        </form>
      </div>
    )
  };

  render() {
    if (this.state.step === 'identity') {
      return this._buildForm('identity', 'Who are you?', '', 'Register', this._handleNext, this._handleIdentityChange);
    } else {
      const subtitle = 'Registered as "' + this.state.identity + '". Open another window to register another identity.';
      return this._buildForm('chatWith', 'Chat with?', subtitle, 'Start Chat', this._handleSubmit, this._handleChatWithChange);
    }
  }
}
