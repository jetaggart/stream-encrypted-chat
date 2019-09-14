import React, {PureComponent} from 'react';
import {MessageInput} from "stream-chat-react";

export class MessageInputEncrypted extends PureComponent {
  constructor(props) {
    console.error(props);
    super(props);
  }

  encryptText = async (data) => {
    console.error("sending message", data);
    const encryptedData = {
      ...data,
      text: "intercepted 123"
    };
    await this.props.channel.sendMessage(encryptedData);
  };

  render() {
    console.error(this.props);
    const newProps = {
      ...this.props,
      sendMessage: this.encryptText
    };
    return <MessageInput {...newProps} />
  }
}
