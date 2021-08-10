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
    player.locX = data.playerX;
    player.locY = data.playerY;
});
