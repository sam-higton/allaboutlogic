var GLOBAL_refreshRate = 50;
var GLOBAL_gameTime = 0;
var GLOBAL_screenWidth = 1000;
var GLOBAL_screenHeight = 600;

function SpaceShip (posX,posY,canvas) {
    
    //todo: implement ship components for upgrade system
    this.components = {};
    //todo: implement ship shield and hull strength
    this.shields = 100;
    this.armour = 100;
    this.hull = 100;
    this.pos = [posX,posY];
    this.pathString = "M " + Math.round(this.pos[0]) + " " + Math.round(this.pos[1]) + " l 10 30 l -10 -5 l -10 5 z";
    this.enginePathString
    this.canvas = canvas;
    this.element;
    this.rotation = 0; // 1 = clockwise, -1 = counter-clockwise
    this.thrust = 0;
    this.velocity = [0,0]; //[x,y]
    this.direction = 0;
    //todo: implement angular acceleration on turning, for better feel
    this.torque = 0;
    this.angularVelocity = 7; //degrees
    this.mass = 100 //non-descript units
    this.time = GLOBAL_refreshRate / 1000;
    this.bulletController = new bulletController(canvas);
    
    this.draw = function () {
        this.pathString = "M " + Math.round(this.pos[0]) + " " + Math.round(this.pos[1]) + " l 10 30 l -10 -5 l -10 5 z";
        var element = canvas.path(this.pathString); 
        this.element = element;
        this.element.rotate(this.direction);
        this.attr({
            fill: "#ccc",
            stroke: "#444",
            'stroke-width': 2,
        });

        
    };
    
    this.attr = function (attr) {
        this.element.attr(attr);    
    }
    
    this.update = function () {
        this.rotate(); 
        this.calculateVelocity();
        this.calculatePosition();
        this.bulletController.updateBullets();
        //console.log(this.pos);
        this.draw();
    }
    
    this.rotate = function () {
        switch (this.rotation) {
            case -1:
                //rotate left
                this.direction -= this.angularVelocity;
                break;
            case 1:
                //rotate right
                this.direction += this.angularVelocity;

                break;
        }
    }
    
    this.getAcceleration = function () {
    
        //break force down to component vectors
        var forceX = this.thrust * Math.sin(Raphael.rad(this.direction));
        var forceY = this.thrust * Math.cos(Raphael.rad(this.direction));
        
        //__DEBUG__\\ - DRAW FORCE
        //var forceLine = canvas.path("M " + Math.round(this.pos[0]) + " " + Math.round(this.pos[1]) + " l " +  -(forceX / 10) + " " + (forceY/10) + " z");
        
        //calculate X acceleration
        var accX = forceX / this.mass;
        var accY = forceY / this.mass;
        
        return [accX,accY];
    
    };
    
    this.calculateVelocity = function () {
        //get Acceleration values
        var acc = this.getAcceleration();
        var accX = acc[0];
        var accY = acc[1];
        
        //calculate new velocities: v = at + u
        var velX = (accX * this.time) + this.velocity[0];
        var velY = (accY * this.time) + this.velocity[1];
        
        this.velocity = [velX,velY];
    }
    
    this.calculatePosition = function () {
        //get Acceleration values
        var acc = this.getAcceleration();
        var accX = acc[0];
        var accY = acc[1];
        
        //get velocities
        var velX = this.velocity[0];
        var velY = this.velocity[1];
        
        //calculate displacement
        var disX = (velX * this.time) - ((accX * Math.pow(this.time,2)) / 2);
        var disY = (velY * this.time) - ((accY * Math.pow(this.time,2)) / 2);
        
        //calculate new positions
        this.pos[0] += disX;
        this.pos[1] -= disY;
        
        //update position to 'wrap-around' play area
        //for x
        if(this.pos[0] > GLOBAL_screenWidth) {
            this.pos[0] -= GLOBAL_screenWidth;    
        } else if (this.pos[0] < 0) {
            this.pos[0] += GLOBAL_screenWidth;    
        }
        //for y
        if(this.pos[1] > GLOBAL_screenHeight) {
            this.pos[1] -= GLOBAL_screenHeight;    
        } else if (this.pos[1] < 0) {
            this.pos[1] += GLOBAL_screenHeight;    
        }
    }
    
    this.fire = function () {
        console.log('firing');
        this.bulletController.addBullet(this.pos[0],this.pos[1],this.direction);    
    }
    
    this.init = function () {
        this.draw();
        
        //build events
        this.element.click(function () {
            alert('test');
        });
    }
}

function bullet (posX,posY,direction, canvas ) {

    this.pos = [posX,posY];
    this.direction = direction - 90; //offset by 90 degrees to fire in right direction
    this.speed = 80;
    
    this.time = GLOBAL_refreshRate / 1000;
    this.element = false;
    this.canvas = canvas;
    this.pathString = "l 0 10 z";
    this.destroy = false;
    
    this.calculateVelocity = function () {
        //break speed down into component velocities
        var vX = this.speed * Math.cos(Raphael.rad(this.direction));
        var vY = this.speed * Math.sin(Raphael.rad(this.direction));
        
        return [vX,vY];
    }
    
    this.velocity = this.calculateVelocity(); //I'm a rebel
    
    this.updatePosition = function () {
        
        //for x
        this.pos[0] += this.velocity[0] * this.time;
        
        //for y
        this.pos[1] += this.velocity[1] * this.time;
        
        
    }
    
    this.draw = function () {
        this.element =  this.canvas.path("M " + Math.round(this.pos[0]) + " " + Math.round(this.pos[1]) + " " + this.pathString);
        this.element.rotate(this.direction + 90); //remove direction offset for rendering;
        this.element.attr({stroke: "#fff", 'stroke-width': 2});
    }
    
    this.update = function () {
        this.updatePosition();
        this.draw();
    }

}

function bulletController (canvas) {
    this.bulletList = [];
    this.canvas = canvas;
    
    this.addBullet = function (posX,posY,direction) {
        var bulletTemp = new bullet(posX,posY,direction, this.canvas);
        this.bulletList.push(bulletTemp);
    }
    
    this.updateBullets = function () {
        for (var i in this.bulletList) {
            this.bulletList[i].update();    
        }
    }
    
}

function asteroid (posx,posy,direction,speed,size,canvas) {
    this.pos = [posx,posy];
    this.direction = direction;
    this.speed = speed;
    this.size = size;
    this.canvas = canvas;
    this.element = false;
    this.time = GLOBAL_refreshRate / 1000;
    
    this.calculateVelocity = function () {
        var vX = this.speed * Math.cos(Raphael.rad(this.direction));
        var vY = this.speed * Math.sin(Raphael.rad(this.direction));  
        return [vX,vY];
    }
    this.velocity = this.calculateVelocity();
    
    this.updatePosition = function () {
        
        //for x
        this.pos[0] += this.velocity[0] * this.time;
        
        //for y
        this.pos[1] += this.velocity[1] * this.time;
        
        //wrap-around screen
        //for x
        if(this.pos[0] > GLOBAL_screenWidth) {
            this.pos[0] -= GLOBAL_screenWidth;    
        } else if (this.pos[0] < 0) {
            this.pos[0] += GLOBAL_screenWidth;    
        }
        //for y
        if(this.pos[1] > GLOBAL_screenHeight) {
            this.pos[1] -= GLOBAL_screenHeight;    
        } else if (this.pos[1] < 0) {
            this.pos[1] += GLOBAL_screenHeight;    
        }
        
        
    }
    
    this.draw = function () {
        this.element = this.canvas.circle(this.pos[0],this.pos[1],this.size); 
        this.element.attr({
            fill: '#F00',
            'stroke-width': 3,
            stroke: '#ccc'
        });
        //todo: make these look like asteroids
    }
    
    this.update = function () {
        this.updatePosition();
        this.draw();
    }
    
}

function asteroidController (canvas) {
    this.asteroidList = [];
    this.canvas = canvas;
    this.posXRange = [0,GLOBAL_screenWidth];
    this.posYRange = [0,GLOBAL_screenHeight];
    this.sizeRange = [5,30];
    this.speedRange = [10,100];
    this.directionRange = [0,359];
    
    this.addAsteroid = function (posX,posY,direction,speed,size) {
    
        var tempAsteroid = new asteroid(posX,posY,direction,speed,size,this.canvas);
        this.asteroidList.push(tempAsteroid);
    
    }
    
    this.addRandomAsteroid = function () {
        var posX = this._getRandomInt(this.posXRange);
        var posY = this._getRandomInt(this.posYRange);
        var direction = this._getRandomInt(this.directionRange);
        var speed = this._getRandomInt(this.speedRange);
        var size = this._getRandomInt(this.sizeRange);
        
        this.addAsteroid(posX,posY,direction,speed,size);
        
    }
    
    this.buildAsteroidField = function (fieldSize) {
        for (var i = 0; i < fieldSize; i ++) {
            this.addRandomAsteroid();    
        }
    }
    
    this.updateAsteroids = function () {
        for(var i in this.asteroidList) {
            this.asteroidList[i].update();    
        }
        
        //calculate collisions with other asteroids
        for(var i in this.asteroidList) {
            for(var j in this.asteroidList) {
                if(i != j) {
                    //do rudimentary check to keep expensive collision checks to a minumum
                    var difX = this.asteroidList[i].pos[0] - this.asteroidList[j].pos[0];
                    var difY = this.asteroidList[i].pos[1] - this.asteroidList[j].pos[1];
                    if((difX < 60 && difX > -60) && (difY < 60 && difY > -60)) {
                        this.asteroidList[i].element.attr({fill: '#00F'});
                        //check for collision
                        var bBoxA = this.asteroidList[i].element.getBBox();
                        var bBoxB = this.asteroidList[j].element.getBBox();
                        if(Raphael.isBBoxIntersect(bBoxA,bBoxB)) {
                            //console.log('collision');
                            this.asteroidList[i].element.attr({fill: '#0F0'});    
                        }
                    }
                }
            }
        }
    }
    
    this._getRandomInt = function (range) {
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }
    
}

$(document).ready(function () {
   
   //init stuff
   var paper = Raphael(document.getElementById('raphael-container'), 1000, 600);
   var spaceShip = new SpaceShip(50,50,paper);
   spaceShip.init();
   var asteroids = new asteroidController(paper);
   asteroids.buildAsteroidField(10);
   
   //keydown listener
   $(document).live('keydown',function (event) {
       console.log(event.which);
        switch (event.which) {
            case 188: // '<' key
                spaceShip.rotation = -1;
                break;
            
            case 190: // '>' key
                spaceShip.rotation = 1;
                break;
                
            case 32: // spacebar
                spaceShip.thrust = 3000;
                break;
            
            case 70:
               spaceShip.fire();
               break;
            
        }
    });
    
    //keyup listener
    $(document).live('keyup',function (event) {
        switch (event.which) {
            case 188: // '<' key
                spaceShip.rotation = 0;
                break;
            
            case 190: // '>' key
                spaceShip.rotation = 0;
                break;
            
            case 32: // spacebar
                spaceShip.thrust = 0;
                
           
        }
    });
   
   //start main loop
   function mainLoop() {
       paper.clear();
       var background = paper.rect(0,0,GLOBAL_screenWidth,GLOBAL_screenHeight);
       background.attr({fill: "#000"});
        spaceShip.update(); 
        asteroids.updateAsteroids();
        GLOBAL_gameTime += GLOBAL_refreshRate;
    }
    
    setInterval(mainLoop,GLOBAL_refreshRate);

});

