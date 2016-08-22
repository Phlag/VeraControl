/**
 * Vera server helper.
 *
 * @namespace
 */
/* jshint node:true *//* global define, escape, unescape */
 'use strict';

var ajax = require('ajax');
var Settings = require('settings');

var base64 = require('base64');
var completedCallback;

var Vera = {};

Vera.PK_Device = 0;
Vera.defaultServer = "https://vera-us-oem-authd11.mios.com";
Vera.defaultTokenServer = Vera.defaultServer + "/info/session/token";
Vera.serverRelayURL = "";

/**
* Gets a user token from the vera servers.
*/
Vera.getUserToken = function(username, password, callback)
{
    completedCallback = callback;
    var urlString = Vera.defaultServer + "/autha/auth/username/" + username + "?SHA1Password=" + password + "&PK_Oem=1";

    ajax({
        url: urlString,
        type: 'GET',
        dataType: 'text'
    },
    function(data)
    {
        Vera.getSessionToken(JSON.parse(data));
    },
    function(error)
    {
        console.log('Failed getting user token: ' + error);
    });
};

/**
* Gets a session token from a server.
*/
Vera.getSessionToken = function(tokenData, server, callback)
{
    server = typeof server !== 'undefined' ? server : Vera.defaultTokenServer;
    callback = typeof callback !== 'undefined' ? callback : Vera.getServerDevice;

    ajax({
        url: server,
        type: "GET",
        dataType: "text",
        headers: { 'MMSAuth': tokenData.Identity, 'MMSAuthSig': tokenData.IdentitySignature }
    },
    function(data)
    {
        callback(tokenData, data);
    },
    function(error)
    {
        console.log('Failed getting session token: ' + error);
    });
};

if (typeof module != 'undefined' && module.exports) module.exports = Vera; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return Vera; }); // AMD
