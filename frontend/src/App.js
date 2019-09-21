import React from 'react';
import { Channel, ChannelHeader, Chat, MessageList, Thread, Window } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { MessageEncrypted } from './MessageEncrypted';
import { EThree } from '@virgilsecurity/e3kit';
import { post } from './Http'

import 'stream-chat-react/dist/css/index.css';
import { MessageInputEncrypted } from "./MessageInputEncrypted";
import { StartChat } from "./StartChat";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { identity: '', chatWith: '', error: '' };
  }

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

    try {
      const publicKeys = await eThree.lookupPublicKeys([this.state.identity, this.state.chatWith]);
      this.setState({
        virgil: {
          ...response,
          eThree,
          publicKeys
        }
      });
    } catch {
      this.setState({
        error: 'Other user is not registered. Open another window and register that identity. Refresh browser to start over.'
      })
    }
  };

  _connect = (authToken) => {
    post("http://localhost:8080/v1/stream-token", {}, authToken)
      .then(this._connectStream);

    post("http://localhost:8080/v1/virgil-token", {}, authToken)
      .then(this._connectVirgil);
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

  setChat = (data) => {
    this.setState({
      identity: data.identity,
      chatWith: data.chatWith,
    });
    this._connect(data.authToken);
  };

  render = () => {
    if (this.state.error !== '') {
      return (
        <div className="container">
          <div className="card">
            {this.state.error}
          </div>
        </div>
      )
    }

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
      return <StartChat setChat={this.setChat}/>
    }
  }
}

export default App;
