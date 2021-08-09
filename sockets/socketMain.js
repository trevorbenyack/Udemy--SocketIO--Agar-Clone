// This is where all of our main socket stuff will go
const io = require('../servers').io;

// ==============CLASSES=================
const Player = require('./classes/Player');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');
const Orb = require('./classes/Orb');
let orbs = [];
let players = [];
let settings = {
    defaultOrbs: 500,
    defaultSpeed: 6,
    defaultSize: 6,
    // as the player gets bigger, the zoom needs to go out
    defaultZoom: 1.5,
    worldWidth: 500,
    worldHeight: 500
}

initGame();

io.sockets.on('connect', (socket) => {
    // a player has connected
    socket.on('init', (data) => {
        // maker a playerConfig object
        let playerConfig = new PlayerConfig(settings);

        // make a playerData object
        // This is the data that everyone needs to know about everyone
        let playerData = new PlayerData(data.playerName, settings);

        // The server manages this one object
        // make a master player object to hold both
        let player = new Player(socket.id, playerConfig, playerData);

        socket.emit('initReturn', {
            orbs
        })

        // This will add will new player onto the Players[]
        players.push(playerData);
    }); // end socket.on('init', ...)

})

// run at the beginning of a new game
function initGame(){
    for(let i = 0; i < settings.defaultOrbs; i++) {
        orbs.push(new Orb(settings));
    }
}
module.exports = io;
