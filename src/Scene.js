/* jshint node:true *//* global define, escape, unescape */
'use strict';

var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

var Scene = {};

Scene.card = function()
{
    this.menu = new UI.Menu();
    this.itemCount = 0;

    /**
    * Adds an item to the scene menu.
    * @param name - Name of the scene
    * @param id - ID of the scene
    */
    this.addItem = function(name, id)
    {
        this.menu.item(0, this.itemCount, { title: name, id: id });
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
    * Handler for a user selecting an item in the list
    */
    this.menu.on('select', function(e)
    {
        var url = Settings.option('url');

        ajax(
        {
            url: url + "id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum=" + e.item.id,
            type: "GET",
            dataType: "json",
            headers: Settings.option('headers')
        },
        function(data)
        {
            console.log("Successfully ran scene.");
        },
        function(error)
        {
            console.log('Failed to run scene: ' + error);
        });
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

/** Exporting module for use in other files. */
if (typeof module != 'undefined' && module.exports) module.exports = Scene; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return Scene; }); // AMD
