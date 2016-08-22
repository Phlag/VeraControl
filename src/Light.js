/* jshint node:true *//* global define, escape, unescape */
'use strict';

var UI = require('ui');
var LightWindow = require('LightWindow');

var Light = {};

Light.menu = function()
{
    this.menu = new UI.Menu();
    this.itemCount = 0;

    /**
    * Adds an item to the light menu.
    * @param name - Name of the scene
    * @param id - ID of the scene
    */
    this.addItem = function(name, id, category)
    {
        this.menu.item(0, this.itemCount, { title: name, id: id, category: category });
        this.itemCount++;
    }

    /**
    * Shows this menu.
    */
    this.show = function()
    {
        this.menu.show();
    }

    /**
    * Handler for a user selecting a light in the list.
    * Creates a new light window to show details about the light and allow
    * the user to control it.
    */
    this.menu.on('select', function(e)
    {
        var lightWindow = new LightWindow.card(e.item.id, e.item.title, e.item.category);
        lightWindow.show();
    });

    /**
    * Clears the menu.
    */
    this.clear = function()
    {
        this.menu.items(0, []);
        this.itemCount = 0;
    }
}

/** Export javascript module for other files to use. */
if (typeof module != 'undefined' && module.exports) module.exports = LightMenu; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return LightMenu; }); // AMD
