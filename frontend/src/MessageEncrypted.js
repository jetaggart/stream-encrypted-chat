import React, {PureComponent} from 'react';
import {MessageSimple,} from "stream-chat-react";

export class MessageEncrypted extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.decryptText(this.props);
  };

  decryptText = async (props) => {
    // const publicKey = await this.props.eThree.lookupPublicKeys(this.props.chatWith);
    // const decryptedText = await this.props.eThree.decrypt(props.message.text, publicKey);
    // this.setState({
    //   decryptedText
    // });
    this.setState({
      decryptedText: props.message.text
    })
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
