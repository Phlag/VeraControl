/* jshint node:true *//* global define, escape, unescape */
'use strict';

var UI = require('ui');
var Settings = require('settings');

var Scene = require('Scene');
var Light = require('Light');
var Vera = require('Vera');

var Main = {};

Main.app = function ()
{
    /** Scenes. */
    var Scene = new Scene.Scene();
    /** Lights. */
    var Light = new Light.card();

    /** Menu */
    this.menu = new UI.Menu({
        sections: [{
            items: [{
                title: 'Scenes'
            }, {
                title: 'Lights'
            }]
        }]
    });

    /**
    * Handler
    */
    this.menu.on('select', function(e)
    {
        if (e.item.title == "Lights") {
            Light.show();
        } else if (e.item.title == "Scenes") {
            Scene.show();
        } else if(e.item.title == "Refresh") {
            Vera.getUserToken(Settings.option('username'), Settings.option('password'), this.refresh);
        }
    });

    /**
    * Main screen.
    */
    this.show = function()
    {
        this.menu.show();
    }

    /**
    * Refreshes all data/menus in the application.
    */
    this.refresh = function()
    {
        // Clear all the menus...
        Light.clear();
        Scene.clear();

        // Get data
        var data = Settings.data('data');

        // Get Scenes
        var scenes = data.scenes;
        for(var i = 0; i < scenes.length; i++) {
            Scene.addItem(scenes[i].name, scenes[i].id);
        }

        // Get Devices
        var devices = data.devices;
        for(i = 0; i < devices.length; i++) {
            switch (devices[i].category) {
                case 3:  //Binary Light
                    Light.addItem(devices[i].name, devices[i].id, devices[i].category);
                    break;
                case 2:  //Dimmable Light
                    Light.addItem(devices[i].name, devices[i].id, devices[i].category);
                    break;
            }
        }
    }

    Vera.getUserToken(Settings.option('username'), Settings.option('password'), this.refresh);
}

/* Export javascript module for other files to access.  */
if (typeof module != 'undefined' && module.exports) module.exports = Main; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return Main; }); // AMD
