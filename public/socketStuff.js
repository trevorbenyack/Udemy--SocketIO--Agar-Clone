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
    orbs = data.orbs;
});
