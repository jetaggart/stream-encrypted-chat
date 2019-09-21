import React from 'react';
import { Channel, ChannelHeader, Chat, MessageList, Thread, Window } from 'stream-chat-react';
import { MessageEncrypted } from './MessageEncrypted';

import 'stream-chat-react/dist/css/index.css';
import { MessageInputEncrypted } from "./MessageInputEncrypted";
import { StartChat } from "./StartChat";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  _buildMessageEncrypted = (props) => {
    const newProps = {
      ...props,
      virgil:   this.state.virgil,
      identity: this.state.identity,
      chatWith: this.state.chatWith,
    };
    return <MessageEncrypted {...newProps}/>
  };

  onConnect = (chatData) => {
    this.setState(chatData);
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
      return <StartChat onConnect={this.onConnect}/>
    }
  }
}

export default App;
