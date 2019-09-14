import React from 'react';
import {Channel, ChannelHeader, Chat, MessageInput, MessageList, Thread, Window} from 'stream-chat-react';
import {StreamChat} from 'stream-chat';
import {MessageEncrypted} from './MessageEncrypted';

import 'stream-chat-react/dist/css/index.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {identity: '', chatWith: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleChatWithChange = this.handleChatWithChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStream = this.handleStream.bind(this);
    this.handleVirgil = this.handleVirgil.bind(this);
    this.handleAuthenticate = this.handleAuthenticate.bind(this);
  }

  handleChange(event) {
    this.setState({identity: event.target.value});
  }

  handleChatWithChange(event) {
    this.setState({chatWith: event.target.value});
  }

  handleStream(response) {
    const chatClient = new StreamChat(response.apiKey);

    chatClient.setUser(
      {
        id: response.user.id,
        name: response.user.name,
        image: response.user.image
      },
      response.token
    );

    let members = [this.state.identity, this.state.chatWith];
    members.sort();

    const channel = chatClient.channel('messaging', members.join("-"), {
      image: 'https://cdn.chrisshort.net/testing-certificate-chains-in-go/GOPHER_MIC_DROP.png',
      name: members.join(", "),
      members: members,
    });

    this.setState({
      stream: {
        ...response,
        client: chatClient,
        channel: channel
      }
    });
  }

  handleVirgil(response) {
    this.setState({
      virgil: response
    });
  }

  handleAuthenticate(response) {
    fetch("http://localhost:8080/v1/stream-token", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + response.authToken
      },
      body: JSON.stringify({})
    })
      .then(res => res.json())
      .then(this.handleStream);

    fetch("http://localhost:8080/v1/virgil-token", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + response.authToken
      },
    })
      .then(res => res.json())
      .then(this.handleVirgil);
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch("http://localhost:8080/v1/authenticate", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identity: this.state.identity,
      })
    })
      .then(res => res.json())
      .then(this.handleAuthenticate);
  }

  render() {
    if (this.state.stream) {
      console.error(this.state.stream);
      return (
        <Chat client={this.state.stream.client} theme={'messaging light'}>
          <Channel channel={this.state.stream.channel}>
            <Window>
              <ChannelHeader/>
              <MessageList Message={MessageEncrypted}/>
              <MessageInput/>
            </Window>
            <Thread/>
          </Channel>
        </Chat>
      )
    } else {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Who are you?
            <input type="text" name="identity" value={this.state.identity} onChange={this.handleChange}/>
          </label>
          <label>
            Who do you want to chat with?
            <input type="text" name="chatWith" value={this.state.chatWith} onChange={this.handleChatWithChange}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
      )
    }
  }
}

export default App;
