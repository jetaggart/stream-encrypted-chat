import React, {PureComponent} from 'react';
import {MessageSimple,} from "stream-chat-react";

export class MessageEncrypted extends PureComponent {

  render() {
    const newProps = {
      ...this.props,
      message: {
        ...this.props.message,
      }
    };
    return <MessageSimple {...newProps} />
  }
}
