import React from 'react';
import {Channel, ChannelHeader, Chat, MessageInput, MessageList, Thread, Window} from 'stream-chat-react';
import {StreamChat} from 'stream-chat';
import {MessageEncrypted} from './MessageEncrypted';

import 'stream-chat-react/dist/css/index.css';

const chatClient = new StreamChat('qk4nn7rpcn75');
const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiZGFyay1sYWtlLTIifQ.ACVwzETajeBHceimF00k1EDkcSj9l93L0WFRSr9XCDE';

chatClient.setUser(
  {
    id: 'dark-lake-2',
    name: 'Dark lake',
    image: 'https://getstream.io/random_svg/?id=dark-lake-2&name=Dark+lake'
  },
  userToken,
);

const channel = chatClient.channel('messaging', 'godevs', {
  // add as many custom fields as you'd like
  image: 'https://cdn.chrisshort.net/testing-certificate-chains-in-go/GOPHER_MIC_DROP.png',
  name: 'Talk about Go',
});

const App = () => (
  <Chat client={chatClient} theme={'messaging light'}>
    <Channel channel={channel}>
      <Window>
        <ChannelHeader/>
        <MessageList Message={MessageEncrypted}/>
        <MessageInput/>
      </Window>
      <Thread/>
    </Channel>
  </Chat>
);

export default App;
