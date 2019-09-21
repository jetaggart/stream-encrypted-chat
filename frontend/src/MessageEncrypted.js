import React, { PureComponent } from 'react';
import { MessageSimple, } from "stream-chat-react";

export class MessageEncrypted extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.decryptText(this.props);
  };

  decryptText = async (props) => {
    if (props.isMyMessage(props.message)) {
      const publicKey = await this.props.virgil.eThree.lookupPublicKeys(this.props.identity);
      const decryptedText = await this.props.virgil.eThree.decrypt(props.message.text, publicKey);
      this.setState({
        decryptedText
      });
    } else {
      const publicKey = await this.props.virgil.eThree.lookupPublicKeys(this.props.chatWith);
      const decryptedText = await this.props.virgil.eThree.decrypt(props.message.text, publicKey);
      this.setState({
        decryptedText
      });
    }
  };

  render() {
    if (this.state.decryptedText) {
      const newProps = {
        ...this.props,
        message: {
          ...this.props.message,
          text: this.state.decryptedText
        }
      };
      return <MessageSimple {...newProps} />
    } else {
      const newProps = {
        ...this.props,
        message: {
          ...this.props.message,
          text: "Loading..."
        }
      };
      return <MessageSimple {...newProps} />
    }
  }
}
