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
    defaultOrbs: 50,
    defaultSpeed: 6,
    defaultSize: 6,
    // as the player gets bigger, the zoom needs to go out
    defaultZoom: 1.5,
    worldWidth: 500,
    worldHeight: 500
}

initGame();

// issue a message to EVERY connected socket at 30FPS
setInterval(() => {
    if(players.length > 0) {
        io.to('game').emit('tock', {
            players
        });
    }
}, 33);

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
            socket.emit('tickTock', {
                playerX: player.playerData.locX,
                playerY: player.playerData.locY
            });
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

        // ORB COLLISION!!!!
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

            // every socket needs to know the leaderBoard has changed
            io.sockets.emit('updateLeaderBoard', getLeaderBoard());
            io.sockets.emit('orbSwitch', orbData);
        }).catch(() => {
            // No collision happened
        });

        // PLAYER COLLISION!!!
        let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, player.socketId);
        playerDeath.then((data) => {
            console.log("Player Collision!!!");
            // every socket needs to know the leaderBoard has changed
            io.sockets.emit('updateLeaderBoard', getLeaderBoard());
            // a player was absorbed, let everyone know!
            io.sockets.emit('playerDeath', data);
        }).catch(() => {

        })
    });

    socket.on('disconnect', (data) => {
        // find out who just left.... which player in players
        // make sure the player exists
        if(player.playerData) {
            players.forEach((currPlayer, i) => {
                if (currPlayer.uid === player.playerData.uid) {
                    players.splice(i, 1);
                    io.sockets.emit('updateLeaderBoard', getLeaderBoard());
                }
            });
            const updateStats = `
            UPDATE stats
                SET highScore = CASE WHEN highScore < ? THEN ? ELSE highScore END,
                mostOrbs = CASE WHEN mostOrbs < ? THEN ? ELSE mostOrbs END,
                mostPlayers = CASE WHEN mostPlayers < ? THEN ? ELSE mostPlayers END
            WHERE username = ?
        `
        }
    })
});

function getLeaderBoard() {
    // sort players in desc order
    players.sort((a,b) => {
       return b.score - a.score;
    });

    let leaderBoard = players.map((curPlayer) => {
        return {
            name: curPlayer.name,
            score: curPlayer.score
        }
    })
    return leaderBoard;
}

// run at the beginning of a new game
function initGame(){
    for(let i = 0; i < settings.defaultOrbs; i++) {
        orbs.push(new Orb(settings));
    }
}
module.exports = io
