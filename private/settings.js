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

config.accessCodeEnabled = true

config.accessCode = "QWERTY"

config.rememberAccessCode = false

module.exports = config