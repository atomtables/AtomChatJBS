# AtomChatJBS

A lightweight chatting application designed to be portable, instantly deployable, and reliable for all of your communication purposes. Mainly used for ***chatting during classes*** (still a high schooler man)

Though AtomChat is in the name of this app, this app is separate from AtomChat. AtomChat is a unified server with indivdual client apps that connects with atom-stack, whereas AtomChatJBS runs on Javascript, is the Bare Minimum, and is a Server and Client combination.

AtomChatJBS was mainly made to be self-hosted on a computer and for everyone to connect to that IP (for example, server and one of the users is on 10.12.34.5). However, it can be hosted on any platform, such as Glitch, Heroku, or ~~Github Pages~~ (no static hosting). 

### Features so far:
- [X] Messaging
- [x] User went online/offline detection
- [X] User list on the client side
- [X] Automatic reload when user/client is no longer active
- [x] Notifications
- [x] typing indicators
- [X] access code to access chatroom server
- [ ] user account system for protection
- [X] encryption for sent and received messages 
  - Encryption is done client side, using a key that the
  server has. The server can decrypt the message, making 
  it possible to read the message.
  - To combat this, E2E encryption, where the key is
  shared between all users without knowledge of
  the server, will also be implemented side-by-side to
  this in the future.
