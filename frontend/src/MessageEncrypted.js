import React, {PureComponent} from 'react';
import {MessageSimple,} from "stream-chat-react";

export class MessageEncrypted extends PureComponent {

  render() {
    console.error(this.props.message);
    const newProps = {
      ...this.props,
      message: {
        ...this.props.message,
        text: "decrypted text"
      }
    };
    return <MessageSimple {...newProps} />
  }
}
