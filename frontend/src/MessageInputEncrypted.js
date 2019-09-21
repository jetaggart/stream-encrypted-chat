import React, { PureComponent } from 'react';
import { MessageInput } from "stream-chat-react";

export class MessageInputEncrypted extends PureComponent {
  encryptText = async (data) => {
    const encryptedText = await this.props.virgil.eThree.encrypt(data.text, this.props.virgil.publicKeys);
    const encryptedData = {
      ...data,
      text: encryptedText
    };
    await this.props.channel.sendMessage(encryptedData);
  };

  render() {
    const newProps = {
      ...this.props,
      sendMessage: this.encryptText
    };
    return <MessageInput {...newProps} />
  }
}
