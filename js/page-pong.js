
function Paddle (name,axis,startPos) {
    
    //vars
    this.axis = axis;
    this.pos = startPos;
    this.name = name;
    this.size = 3;
    
    //functions
    this.moveUp = function () {
        this.pos -= 1;    
    }
    
    this.moveDown = function () {
        this.pos += 1;    
    }
    
    this.draw = function (grid) {
        for(var i = 0; i < this.size; i++) {
            grid.setTileStatus(true,this.axis,this.pos + i);    
        }
    }
    
}

function PongGame (paddle1,paddle2,ball,grid, actionMonitor) {
    
    this.paddle1 = paddle1;
    this.paddle2 = paddle2;
    this.ball = ball;
    this.grid = grid;
    this.active = true;
    this.interval = 100;
    this.actionMonitor = actionMonitor;
    
    this.iterate = function () {
        if(this.active) {
            this.grid.clear();
            
            this.paddle1.draw(this.grid);
            this.paddle2.draw(this.grid);
            
            this.grid.update();
        }
    }
    
}

function ActionMonitor () {
    this.activeActions = [];
    
    this.activateAction = function (actionName) {
        
    }
    
    this.deactivateAction = function (actionName) {
        
    }
    
    this.checkAction = function (actionName) {
        
    }
    
}

$(document).ready(function () {
    
    var bigGrid = new grid('bigGrid',50,40,'div.left-col');
	bigGrid.render();
    
    var paddle1 = new Paddle('paddle1',0,23);
    var paddle2 = new Paddle('paddle2',49,15);
    var actionMonitor = new ActionMonitor();
    var gameEngine = new PongGame(paddle1,paddle2,false,bigGrid,actionMonitor);
    gameEngine.iterate();
    
    function mainLoop() {
      gameEngine.iterate();  
    }
    
    setInterval(mainLoop,gameEngine.interval);
});