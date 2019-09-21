import React, { PureComponent } from 'react';
import { MessageSimple, } from "stream-chat-react";

export class MessageEncrypted extends PureComponent {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this._isMounted = true;
    this._decryptText()
      .then(
        (decryptedText) => {
          if (this._isMounted) {
            this.setState({ decryptedText });
          }
        }
      );
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  _decryptText = async () => {
    const messageIdentity = this.props.isMyMessage(this.props.message) ? this.props.identity : this.props.chatWith;
    return this.props.virgil.eThree
      .decrypt(this.props.message.text, this.props.virgil.publicKeys[messageIdentity]);
  };

  render = () => {
    const newProps = {
      ...this.props,
      message: {
        ...this.props.message,
        text: this.state.decryptedText || ""
      }
    };

    return <MessageSimple {...newProps} />
  }
}
