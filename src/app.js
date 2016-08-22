/**
 * Bootstrap application
 */

var Settings = require('settings');

var Vera = require('Vera');
var Main = require('Main');

var app = new Main.app();
app.show();


/**
 * App settings
 */
Settings.config(
    {url: 'http://phlag.github.io/VeraControl', autoSave: true },
    function(e)
    {
        console.log('closed configurable');

        // Show the parsed response
        console.log(JSON.stringify(e.options));

        // Show the raw response if parsing failed
        if (e.failed) {
            console.log(e.response);
        }else{
            //startapp();
            Vera.getUserToken(Settings.option('username'), Settings.option('password'), app.refresh);
        }
    }
);
