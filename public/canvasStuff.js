function init() {
    draw();
}

// ===================================
// =========DRAWING===================
// ===================================
player.locX = Math.floor(500*Math.random() + 10);
player.locY = Math.floor(500*Math.random() + 10);

function draw() {

    // reset the translation to the default b/c
    // context.translate() is cumulative
    context.setTransform(1,0,0,1,0,0);

    // clear the screen out tos the old stuff is gone from the last frame
    context.clearRect(0,0, canvas.width, canvas.height);

    // clamp the camera to the player
    const camX = -player.locX + canvas.width/2
    const camY = -player.locY + canvas.height/2;
    // moves the canvas and its origin x and y on the grid
    // translate allows us to move the canvas around
    context.translate(camX, camY);

    // context is a 2d thing to draw on the canvas
    // beginPath() tells the context that drawing is about ot begin
    context.beginPath();
    context.fillStyle = "rgb(255,0,0)";
    // arc() gives us the ability to draw an arc on the canvas
    // arg1,2 = x,y of the center of the arc
    // arg3 = radius of the arc/circle
    // arg4 = where to start on the circle in radians, 0 = 3:00
    // arg5 = where to stop in radians
    context.arc(player.locX, player.locY, 10, 0, Math.PI * 2);

    // fill() fills the circle in
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = 'rgb(0,255,0)';
    // this puts a border around the circle
    context.stroke();

    orbs.forEach((orb) => {
        context.beginPath();
        context.fillStyle = orb.color;
        context.arc(orb.locX, orb.locY, orb.radius, 0,Math.PI * 2);
        context.fill();
    })

    // this recursively calls the draw function forever at whatever framerate
    // the browser is capable of running at
    requestAnimationFrame(draw)
}

canvas.addEventListener('mousemove',(event)=>{

    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };
    const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;
    if(angleDeg >= 0 && angleDeg < 90){
        xVector = 1 - (angleDeg/90);
        yVector = -(angleDeg/90);
    }else if(angleDeg >= 90 && angleDeg <= 180){
        xVector = -(angleDeg-90)/90;
        yVector = -(1 - ((angleDeg-90)/90));
    }else if(angleDeg >= -180 && angleDeg < -90){
        xVector = (angleDeg+90)/90;
        yVector = (1 + ((angleDeg+90)/90));
    }else if(angleDeg < 0 && angleDeg >= -90){
        xVector = (angleDeg+90)/90;
        yVector = (1 - ((angleDeg+90)/90));
    }

    speed = 10
    xV = xVector;
    yV = yVector;

    if((player.locX < 5 && player.xVector < 0) || (player.locX > 500) && (xV > 0)){
        player.locY -= speed * yV;
    }else if((player.locY < 5 && yV > 0) || (player.locY > 500) && (yV < 0)){
        player.locX += speed * xV;
    }else{
        player.locX += speed * xV;
        player.locY -= speed * yV;
    }
});
