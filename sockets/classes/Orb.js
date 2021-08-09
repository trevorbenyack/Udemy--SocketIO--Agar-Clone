class Orb {
    constructor(settings) {
        // tells the orb what color to be
        this.color = this.getRandomColor();
        // tells the orb where it needs to be
        this.locX = Math.floor(Math.random() * settings.worldWidth);
        this.locY = Math.floor(Math.random() * settings.worldHeight);
        // tells the orb how big to be
        this.radius = 5;
    }

    getRandomColor() {
        const r = Math.floor(Math.random() * 200 + 50);
        const g = Math.floor(Math.random() * 200 + 50);
        const b = Math.floor(Math.random() * 200 + 50);
        return `rgb(${r},${g},${b})`;
    }
}

// anyone who requires this file will get the orb class
module.exports = Orb;
