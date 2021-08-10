// This is where all of our main socket stuff will go
const io = require('../servers').io;
const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions;

// ==============CLASSES=================
const Player = require('./classes/Player');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');
const Orb = require('./classes/Orb');
let orbs = [];
let players = [];
let settings = {
    defaultOrbs: 5000,
    defaultSpeed: 6,
    defaultSize: 6,
    // as the player gets bigger, the zoom needs to go out
    defaultZoom: 1.5,
    worldWidth: 5000,
    worldHeight: 5000
}

initGame();

io.sockets.on('connect', (socket) => {
    let player = {};
    player.tickSent = false;

    // a player has connected
    socket.on('init', (data) => {
        // add the player to the game namespace
        socket.join('game');

        // maker a playerConfig object
        let playerConfig = new PlayerConfig(settings);

        // make a playerData object
        // This is the data that everyone needs to know about everyone
        let playerData = new PlayerData(data.playerName, settings);

        // The server manages this one object
        // make a master player object to hold both
        player = new Player(socket.id, playerConfig, playerData);

        // issue a message to EVERY connected socket at 30FPS
        setInterval(() => {
            if(player.tickSent) {
                io.to('game').emit('tock', {
                    players,
                    playerX: player.playerData.locX,
                    playerY: player.playerData.locY
                })
            }
        }, 33);

        socket.emit('initReturn', {
            orbs
        })

        // This will add will new player onto the Players[]
        players.push(playerData)

    }); // end socket.on('init', ...)

    // The client sent over a tick, so that means we know what direction
    // to move the socket/player
    socket.on('tick', (data) => {

        player.tickSent = true;

        let speed = player.playerConfig.speed;

        // update the playerConfig object with the new direction in data
        // and at the same time create a local variable with this callback
        // for readability
        let xV = player.playerConfig.xVector = data.xVector;
        let yV = player.playerConfig.yVector = data.yVector

        if(data.xVector && data.xVector) {
            if((player.playerData.locX < 5 && player.playerConfig.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)){
                player.playerData.locY -= speed * yV;
            }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)){
                player.playerData.locX += speed * xV;
            }else{
                player.playerData.locX += speed * xV;
                player.playerData.locY -= speed * yV;
            }
        }

        let capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings);
        capturedOrb.then((data) => {
            // A collision happened
            // emit to all sockets the orb to replace
            // This will send over the orb index as well as the orb data itself
            const orbData = {
                orbIndex: data,
                newOrb: orbs[data]
            }
            console.log(orbData);
            io.sockets.emit('orbSwitch', orbData);
        }).catch(() => {
            // No collision happened
        });
    });
})

// run at the beginning of a new game
function initGame(){
    for(let i = 0; i < settings.defaultOrbs; i++) {
        orbs.push(new Orb(settings));
    }
}
module.exports = io
