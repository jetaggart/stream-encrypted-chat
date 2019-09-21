import React from 'react';
import { Channel, ChannelHeader, Chat, MessageList, Thread, Window } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { MessageEncrypted } from './MessageEncrypted';
import { EThree } from '@virgilsecurity/e3kit';
import { post } from './Http'

import 'stream-chat-react/dist/css/index.css';
import { MessageInputEncrypted } from "./MessageInputEncrypted";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { identity: '', chatWith: '' };
  }

  _handleIdentityChange = (event) => {
    this.setState({ identity: event.target.value });
  };

  _handleChatWithChange = (event) => {
    this.setState({ chatWith: event.target.value });
  };

  _connectStream = (response) => {
    const chatClient = new StreamChat(response.apiKey);

    chatClient.setUser(
      {
        id:    response.user.id,
        name:  response.user.name,
        image: response.user.image
      },
      response.token
    );

    let members = [this.state.identity, this.state.chatWith];
    members.sort();

    const channel = chatClient.channel('messaging', {
      image:   `https://getstream.io/random_svg/?id=rapid-recipe-0&name=${members.join("+")}`,
      name:    members.join(", "),
      members: members,
    });

    this.setState({
      stream: {
        ...response,
        client:  chatClient,
        channel: channel
      }
    });
  };

  _connectVirgil = async (response) => {
    const eThree = await EThree.initialize(() => response.token);
    try {
      await eThree.register();
    } catch {
      // already registered;
    }

    const publicKeys =  await eThree.lookupPublicKeys([this.state.identity, this.state.chatWith]);

    this.setState({
      virgil: {
        ...response,
        eThree,
        publicKeys
      }
    });
  };

  _connect = (authToken) => {
    post("http://localhost:8080/v1/stream-token", {}, authToken)
      .then(this._connectStream);

    post("http://localhost:8080/v1/virgil-token", {}, authToken)
      .then(this._connectVirgil);
  };

  _handleSubmit = (event) => {
    event.preventDefault();
    post("http://localhost:8080/v1/authenticate", { identity: this.state.identity })
      .then(res => res.authToken)
      .then(this._connect);
  };

  _buildMessageEncrypted = (props) => {
    const newProps = {
      ...props,
      virgil:   this.state.virgil,
      identity: this.state.identity,
      chatWith: this.state.chatWith,
    };
    return <MessageEncrypted {...newProps}/>
  };

  render = () => {
    if (this.state.stream && this.state.virgil) {
      return (
        <Chat client={this.state.stream.client} theme={'messaging light'}>
          <Channel channel={this.state.stream.channel}>
            <Window>
              <ChannelHeader/>
              <MessageList Message={this._buildMessageEncrypted}/>
              <MessageInputEncrypted virgil={this.state.virgil} channel={this.state.stream.channel}/>
            </Window>
            <Thread/>
          </Channel>
        </Chat>
      )
    } else {
      return (
        <form onSubmit={this._handleSubmit}>
          <label>
            Who are you?
            <input type="text" name="identity" value={this.state.identity} onChange={this._handleIdentityChange}/>
          </label>
          <label>
            Who do you want to chat with?
            <input type="text" name="chatWith" value={this.state.chatWith} onChange={this._handleChatWithChange}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
      )
    }
  }
}

export default App;
