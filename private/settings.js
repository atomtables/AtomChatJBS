/*
This is the settings file for the server.
===
DO NOT MODIFY THIS FILE UNLESS YOU KNOW WHAT YOU ARE DOING (which you should if you are in this repo)
All settings should be modified through the /settings page on the website.
===
The default username/password is admin/admin.
Please remove this user after you have created your own.
Make sure to set your user as an admin.
*/

let config = {}

config.port = 3000

config.serverName = "atomdev server"

/*
* config.encryptionMethod is the method of encryption used for the chat by the client.
* "ss" or server-side is the default method.
* "e2e" or end-to-end is the other method.
* "none" means no encryption/plaintext
*
* server-side encryption is less secure at keeping messages confidential from the server,
* but comes with the benefit of having the server be able to moderate the chat, and make
* sure that all users connecting to the server are using the same encryption key (in other words, are authorized).
*
* end-to-end encryption is more secure at keeping messages confidential from the server,
* as the server cannot decrypt messages without knowing the key which the clients are using.
* This has its benefits and downsides, but this means that the server cannot ensure that all users
* joining are allowed to access the chat. They will recieve encrypted messages, and only if they can
* decrypt them, they will be able to read the contents
* */
config.encryptionMethod = "e2e"

config.accessCode = "QWERTY"

config.rememberAccessCode = false

module.exports = config