let socket = io.connect('http://localhost:8080');

// This function is called when the user clicks on the start button
function init() {

    // start drawing the screen
    draw();

    // call the init event when the client is ready for the data
    socket.emit('init', {
        playerName: player.name
    })
}

socket.on('initReturn', (data) => {

    // get all the orbs to display on screen
    orbs = data.orbs;

    // send the server the data w/ where the user wants to go
    setInterval(() => {
        socket.emit(('tick'), {
            xVector: player.xVector,
            yVector: player.yVector
        })
    }, 33);

});

// receives the location of the players
socket.on('tock', (data) => {
    players = data.players;
});

socket.on('orbSwitch', (data) => {
    orbs.splice(data.orbIndex, 1, data.newOrb);
});

socket.on('tickTock', (data) => {
    player.locX = data.playerX;
    player.locY = data.playerY;
});

socket.on('updateLeaderBoard', (data) => {
    document.querySelector('.leader-board').innerHTML = "";
    data.forEach((curPlayer) => {
        document.querySelector('.leader-board').innerHTML += `
        <li class="leaderboard-player">${curPlayer.name} - ${curPlayer.score}</li>`
    });
});

socket.on('playerDeath', (data) => {
    document.querySelector('#game-message').innerHTML = `${data.died.name} absorbed by ${data.killedBy.name}`;
    $("#game-message").css({
        "background-color": "#00e6e6",
        "opacity": 1
    });
    $("#game-message").show();
    $("#game-message").fadeOut(5000);
})
