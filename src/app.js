/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Settings = require('settings');
var ajax = require('ajax');

var card = new UI.Card({
    title:'Starting',
    subtitle:''
});

card.show();

Settings.config(
    { url: 'http://pebble.acolyte.ws', autoSave: true },
  function(e) {
    console.log('closed configurable');

    // Show the parsed response
    console.log(JSON.stringify(e.options));

    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    }else{
        startapp();
    }
  }
);

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

/*Pebble.addEventListener('ready', function() {
    console.log('PebbleKit JS ready');
});

Pebble.addEventListener('showConfiguration', function() {
    var url = 'http://pebble.acojo.ca';
    
    console.log('Showing configuration page: ' + url);
    
    Pebble.openURL(url);
});

Pebble.addEventListener('webviewclosed', function(e) {
    var configData = JSON.parse(decodeURIComponent(e.response));
    
    console.log('Configuration page returned: ' + JSON.stringify(configData));
    
    if (configData.username) {
       Pebble.sendAppMessage({
           username: configData.username,
           password: configData.password
       }, function() {
           console.log('Send successfully');
       }, function() {
           console.log('Send failed!');
       }); 
    }
});*/

var user = false;
var password = false;

var auth_server   = 'https://vera-us-oem-autha.mios.com';
var auth_url      = false;
var auth = false;
var identity = false;
var device_list = false;
var device_entry = false;
var device_session = false;
var device = false;
var relay_session = false;
var relay_session = false;
var resultsScenes = false;

function get_scenes()
{
  card.subtitle('Scenes time!');
  var server_relay    = device.Server_Relay;
  var pk_device       = device.PK_Device;

  var request_url     = "https://" + server_relay + "/relay/relay/relay/device/" + pk_device + "/port_3480/data_request?id=user_data";

  var headers = [
    "MMSSession: " + relay_session
  ];
  
  ajax(
    {
      url: request_url,
      headers: headers,
      type: 'json'
    },
    function(data) {
      console.log('Get USER DATA');
      if (data.scenes !== undefined) {
        var scenes = [];
        for (var i=0; i<data.scenes.length; i++) {
          scenes[i] = [];
          scenes[i].title = data.scenes[i].name;
          scenes[i].id = data.scenes[i].id;
        }
        
        resultsScenes = new UI.Menu({
          sections: [{
            title: 'Scenes',
            items: scenes
          }]
        });
        
        resultsScenes.show();
        card.hide();
        
        resultsScenes.on('select', function(e) {
          //e.itemIndex
          request_url     = "https://" + server_relay + "/relay/relay/relay/device/" + pk_device + "/port_3480/data_request?id=action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum=" + scenes[e.itemIndex].id;
          console.log(request_url);
          ajax(
            {
              url: request_url,
              headers: headers,
              type: 'json'
            },
            function(data) {
              console.log('Executed');
            },
            function(error, status, request) {
              console.log('Scenes ERROR');
              console.log(error);
            }
          );
        });
      }
    },
    function(error, status, request) {
      console.log('Error get user data');
      console.log(error);
    }
  );
}

function get_relay_session()
{
  var session_url   = "https://" + device.Server_Relay + "/info/session/token";
  var headers = [ 'MMSAuth: ' + auth.Identity, 'MMSAuthSig: ' + auth.IdentitySignature ];
  ajax(
    {
      url: session_url,
      headers: headers,
      type: 'json'
    },
    function(data) {
      console.log('Get relay session');
      relay_session = data;
      get_scenes();
    },
    function(error, status, request) {
      console.log('Get relay session');
      relay_session = error;
      get_scenes();
    }
  );
}

function set_device()
{
  var server_device   = device_entry.Server_Device;
  var pk_device       = device_entry.PK_Device;
  var headers = [
      "MMSSession: " + device_session
  ];
  var info_url    = "https://" + server_device + "/device/device/device/" + pk_device;
  ajax(
    {
      url: info_url,
      headers: headers,
      type: 'json'
    },
    function(data) {
      console.log('Set device');
      device = data;
      get_relay_session();
    },
    function(error, status, request) {
      console.log('Set device');
      device = error;
      get_relay_session();
    }
  );
}

function get_device()
{
  var session_url   = "https://" + device_entry.Server_Device + "/info/session/token";
  var headers = [ 'MMSAuth: ' + auth.Identity, 'MMSAuthSig: ' + auth.IdentitySignature ];

  ajax(
    {
      url: session_url,
      headers: headers,
      type: 'json'
    },
    function(data) {
      console.log('Get device session');
      device_session = data;
      set_device();
    },
    function(error, status, request) {
      console.log('Get device session');
      device_session = error;
      set_device();
    }
  );
}

function save_session(data)
{
  card.subtitle('Session!');
  var device_list_session = data;
  var headers = [
      "MMSSession: " + device_list_session
  ];
  var devices_url    = "https://" + auth.Server_Account + "/account/account/account/" + identity.PK_Account + "/devices";
  
  ajax(
    {
      url: devices_url,
      headers: headers,
      type: 'json'
    },
    function(data) {
      device_list = data;
      device_entry = device_list.Devices[0];
      get_device();
    },
    function(error, status, request) {
      console.log('Error Session');
      console.log(error);
    }
  );
  
}

function save_auth(data)
{
  auth = data;
  identity = JSON.parse(Base64.decode(data.Identity));
  card.subtitle('Authenticated!');
  var session_url   = "https://" + auth.Server_Account + "/info/session/token";
  var headers = [ 'MMSAuth: ' + auth.Identity, 'MMSAuthSig: ' + auth.IdentitySignature ];

  ajax(
    {
      url: session_url,
      headers: headers,
      type: 'json'
    },
    function(data) {
      console.log('session');
      save_session(data);
    },
    function(error, status, request) {
      save_session(error);
    }
  );
}

function startapp() {
    card.show();
    if (resultsScenes !== false) resultsScenes.hide();
    
    if (Settings.option('username')) {
        user = Settings.option('username');
    }
    
    if (Settings.option('password')) {
        password = Settings.option('password');
    }
    
    if (user === false || password === false) {
        console.log('Oh oh');
        card.title('Configuration needed');
        card.subtitle('Need vera username and password!');
        return false;
    }
    
    card.title('Vera scenes');
    card.subtitle('Fetching...');
    
    auth_url = auth_server + "/autha/auth/username/" + user + "?SHA1Password=" + password + "&PK_Oem=1";
    
    ajax(
      {
        url: auth_url,
        headers: [],
        type: 'json'
      },
      function(data) {
        save_auth(data);
      },
      function(error) {
        card.title('Authentication failed');
        card.subtitle('Username or password invalid.');
        return false;
      }
    );
}

startapp();

/*
// Construct URL
var cityName = 'London';
var URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName;

ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    // Success!
    console.log('Successfully fetched weather data!');
    
    // Extract data
    var location = data.name;
    var temperature = Math.round(data.main.temp - 273.15) + 'C';
  
    // Always upper-case first letter of description
    var description = data.weather[0].description;
    description = description.charAt(0).toUpperCase() + description.substring(1);
    card.subtitle(location + ', ' + temperature);
    card.body(description);
  },
  function(error) {
    // Failure!
    console.log('Failed fetching weather data: ' + error);
  }
);*/