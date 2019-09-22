# Building HIPAA Compliant End-to-End Encrypted Chat with Stream React Chat and Virgil

As healthcare technology advances, real-time communication is becoming increasingly
important to any modern healthcare application. It's important to provide experiences
patients expect while protecting their privacy.

In this tutorial we will walk through how to create a full, end-to-end encrypted chat client 
using Stream Chat's React widgets combined with Virgil Security. 
By combining [Virgil Security](https://virgilsecurity.com/end-to-end-encrypted-chat) with
[Stream Chat](https://getstream.io/chat/) allows developers to integrate world-class
chat while protecting PHI to stay HIPAA compliant.

## What is end-to-end encryption?

End-to-end encryption means that messages sent between two people can only be read by them.
To do this the message is encrypted before it leaves a user's device and can only be decrypted
by the person you sent it to. 

That means we can safely use Stream Chat as a backend by preventing anyone except the intended parties
from reading those messages. No one in your company, nor any cloud provider you use can read these messages. 
Even if a malicious person gained access to the database containing the messages
all they would see is encrypted text, called ciphertext. Virgil Security is a vendor that allows us to accomplish
this via public/private key technology. 

# Let's build a HIPAA compliant chat application using React!

To build this application we're going to rely on three libraries, 
[Stream React Chat](https://www.npmjs.com/package/stream-chat-react), 
[Virgil SDK](https://www.npmjs.com/package/virgil-sdk) and
[Virgil Crypto](https://www.npmjs.com/package/virgil-crypto). We'll combine these
so encryption happens in the browser before sending a message and decryption and verification
happens in the receiver's browser. 

The application preforms following steps accomplish full end-to-end encryption:

1. A user authenticates with your backend.
2. User's app requests a Stream auth token and api key from the backend. The browser creates a [Stream Chat Client](https://getstream.io/chat/docs/#init_and_users) for that user.
3. User's app requests a Virgil auth token from the backend and registers with Virgil. This generates their private and public key. The private key is stored locally and the public key is stored in Virgil.
4. The user decides who they want to chat with and the app creates and joins a [Stream Chat Channel](https://getstream.io/chat/docs/#initialize_channel).
5. The app asks Virgil for receiver's public key.
6. The user types a message and sends it. Before sending, the app passes the receiver's public key to Virgil to encrypt the message.
7. The message is relayed through Stream Chat to the receiver. Stream only stores ciphertext, meaning they can never see what was typed. 
8. The other user receives and decrypts the message. When the message is received, app decrypts the message using using the Virgil SDK. Virgil SDK verifies the message is authentic by using the sender's public key.

This looks fairly involved but luckily Stream and Virgil do the heavy lifting for us. 
As a developer using these services, we just need to wire them up correctly. 

Let's walk through and look at the code needed for each step. 
All source code for this application is available on [GitHub](https://github.com/psylinse/stream-encrypted-chat)

# Prerequisites


# 1.


# 2.

# 3.

# 4.

# 5.

# 6.

# 7.

# 8.

# Where to go from here

* Backup user's private keys. Using Virgil's `eThree.backupPrivateKey(pwd)` will securely store the private key for restoration on any device.
* Build real user registration and protect identity registration. This tutorial simplified registration
and retrieving valid tokens to interact with Stream and Virgil.
* Integrate user image and file uploads. This functionality is turned off in this app via CSS. 
You can look at hooking into Stream React Chat's [MessageInput](https://getstream.github.io/stream-chat-react/#messageinput) 
or use as a jumping off point to build your own chat widget.

# ? Contact Stream ?

If you want to get started with Stream and Virgil, contact us here!