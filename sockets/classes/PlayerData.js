// Use uuid module to create a massive random string to id this player
// There are security implications with a client's socket id being known
const { v4: uuidv4 } = require('uuid');


// This is where all the data that EVERYONE needs to know about will live
class PlayerData {
    constructor(playerName, settings) {
        this.uid = uuidv4(); // this will generate crazy string to id this player
        this.name = playerName;

        // where the player is
        this.locX = Math.floor(settings.worldWidth*Math.random() + 10);
        this.locY = Math.floor(settings.worldHeight*Math.random() + 10);

        this.radius = settings.defaultSize;
        this.color = this.getRandomColor();
        this.score = 0;
        this.orbsAbsorbed = 0;
    }

    getRandomColor() {
        const r = Math.floor(Math.random() * 200 + 50);
        const g = Math.floor(Math.random() * 200 + 50);
        const b = Math.floor(Math.random() * 200 + 50);
        return `rgb(${r},${g},${b})`;
    }
};

module.exports = PlayerData;
