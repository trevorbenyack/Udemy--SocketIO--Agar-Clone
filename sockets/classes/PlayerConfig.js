// This is where all the data that no other player needs to know about

class PlayerConfig {
    constructor(settings) {

        // Where the user wants to go
        this.xVector = 0;
        this.yVector = 0;

        // The user's speed
        this.speed = settings.defaultSpeed;
        this.zoom = settings.defaultZoom
    }
}

module.exports = PlayerConfig;
