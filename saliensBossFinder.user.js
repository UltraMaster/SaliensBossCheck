// ==UserScript==
// @name         Boss Finder
// @description  Saliens Boss Finder
// @author       UltraMaster
// @namespace    https://github.com/UltraMaster
// @downloadURL  https://github.com/UltraMaster/SaliensBossCheck/raw/master/saliensBossFinder.user.js
// @license      MIT License
// @copyright    Copyright (C) 2018, by UltraMaster
// @version      1.0
// @updateURL    https://github.com/UltraMaster/SaliensBossCheck/raw/master/saliensBossFinder.user.js
// @match        https://community.steam-api.com/ITerritoryControlMinigameService/GetPlanets/v0001/?active_only=1&language=english
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @run-at document-idle
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    var foundBoss = false;
    var timeToReload = 1*60;
    var timerUpdate = 1;
    var bossOnPlanet = [];
    var bossOnZone = [];
    var bf_Planets = JSON.parse($("html")[0].innerText);
    $.each(bf_Planets.response.planets, function(i,planet){
        if (planet.state.boss_zone_position !== undefined){
            console.log('Found boss on planet '+planet.state.name+' on zone number '+planet.state.boss_zone_position);
            bossOnPlanet[bossOnPlanet.length] = planet.state.name;
            bossOnZone[bossOnZone.length] = planet.state.boss_zone_position;
            foundBoss = true;
        }
    });
    $('body').html('');
    $('<div>').attr('id', 'bf_timer').css({'font-family': 'Helvetica','background': 'blue','top': '40%','left': '30%','width': '40%','text-align': 'center','position': 'absolute','font-size': '3em'}).html('Boss not found.<br/>Recheck in '+timeToReload+' seconds.').appendTo($('<div>').css({'position': 'absolute','width': '100%','height': '100%','top': '0'}).appendTo('body'));
    if (!foundBoss){
        setTimeout(function(){ location.reload(); }, timeToReload*1000);
        setInterval(function(){
            timeToReload -= timerUpdate;
            $('#bf_timer').html('Boss not found.<br/>Recheck in '+timeToReload+' seconds.');
        }, timerUpdate*1000);
        $('html').css({'background': 'red','color': 'white'});
    }else{
        $('html').css({'background': 'green','color': 'white'});
        setTimeout(function(){ location.reload(); }, timeToReload*1000);
        setInterval(function(){
            timeToReload -= timerUpdate;
            var bossesOn = '';
            $.each(bossOnPlanet, function(i,v){bossesOn = '<br/>Planet: '+v+', zone: '+bossOnZone[i];});
            $('#bf_timer').html('Boss found on:'+bossesOn+'<br/>Recheck in '+timeToReload+' seconds.');
        }, timerUpdate*1000);
    }
})();
