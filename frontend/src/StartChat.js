import React, { PureComponent } from 'react';
import { StreamChat } from 'stream-chat';
import { EThree } from '@virgilsecurity/e3kit';
import { post } from './Http'

export class StartChat extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { identity: '', chatWith: '', error: '' }
  };

  _handleIdentityChange = (event) => {
    this.setState({ identity: event.target.value });
  };

  _handleChatWithChange = (event) => {
    this.setState({ chatWith: event.target.value });
  };

  _handleNext = async (event) => {
    event.preventDefault();
    post("http://localhost:8080/v1/authenticate", { identity: this.state.identity })
      .then(res => res.authToken)
      .then(this._connect);
  };

  _handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const publicKeys = await this.state.virgil.eThree.lookupPublicKeys([this.state.identity, this.state.chatWith]);

      let members = [this.state.identity, this.state.chatWith];
      members.sort();

      const channel = this.state.stream.client.channel('messaging', {
        image:   `https://getstream.io/random_svg/?id=rapid-recipe-0&name=${members.join("+")}`,
        name:    members.join(", "),
        members: members,
      });

      this.props.onConnect({
        virgil: {
          ...this.state.virgil,
          publicKeys
        },
        stream: {
          ...this.state.stream,
          channel
        }
      })
    } catch (err) {
      this.setState({
        error: err.message
      })
    }
  };

  _connectStream = (response) => {
    const client = new StreamChat(response.apiKey);

    client.setUser(
      {
        id:    response.user.id,
        name:  response.user.name,
        image: response.user.image
      },
      response.token
    );

    return {
      ...response,
      client
    };
  };

  _connectVirgil = async (response) => {
    const eThree = await EThree.initialize(() => response.token);
    try {
      await eThree.register();
    } catch {
      // already registered;
    }

    try {
      return {
        ...response,
        eThree,
      };
    } catch {
      return {
        error: 'Other user is not registered. Open another window and register that identity. Refresh browser to start over.'
      };
    }
  };

  _connect = async (authToken) => {
    const stream = await post("http://localhost:8080/v1/stream-token", {}, authToken)
      .then(this._connectStream);

    const virgil = await post("http://localhost:8080/v1/virgil-token", {}, authToken)
      .then(this._connectVirgil);

    this.setState({ stream, virgil })
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
    if (this.state.error !== '') {
      return (
        <div className="container">
          <div className="card">
            {this.state.error}
          </div>
        </div>
      )
    } else if (this.state.virgil && this.state.stream) {
      const subtitle = 'Registered as "' + this.state.identity + '". Open another window to register another identity.';
      return this._buildForm('chatWith', 'Chat with?', subtitle, 'Start Chat', this._handleSubmit, this._handleChatWithChange);
    } else {
      return this._buildForm('identity', 'Who are you?', '', 'Register', this._handleNext, this._handleIdentityChange);
    }
  }
}
