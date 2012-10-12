function Conway (grid) {
    this.grid = grid;
    this.previousFrame = false;
    this.active = false;
    this.interval = 100;
    
    this.iterate = function () {
        if(this.active) {
            this.previousFrame = this.generateGridCopy();
            for(var ypos = 0; ypos < this.grid.height; ypos++) {
                for(var xpos = 0; xpos < this.grid.width; xpos++) {
                    var currentCell = this.previousFrame[ypos][xpos];
                    var neighbourCount = this.getNeighborCount(currentCell);
                    if(currentCell.getStatus()) {
                        //cell is alive
                        if(neighbourCount < 2) {
                            this.grid.setTileStatus(false,xpos,ypos);    
                        } else if (neighbourCount == 2 || neighbourCount == 3) {
                            //do nothing    
                        } else if (neighbourCount > 3) {
                            this.grid.setTileStatus(false,xpos,ypos);    
                        }
                        
                    } else {
                        //cell is dead
                        if(neighbourCount == 3) {
                            this.grid.setTileStatus(true,xpos,ypos);    
                        }
                    }
                }
            }
            this.grid.update();
        }
//        if(this.active) {
//            setTimeout($.proxy(this.iterate,this), this.interval);    
//        }
    };
    
    this.start = function () {
        this.active = true;
    };
    
    this.stop = function () {
        this.active = false;
    };
    
    this.getNeighborCount = function (cell) {
        var neighbourCount = 0;
        var xpos = cell.xPos;
        var ypos = cell.yPos;
        //topleft
        if (this.isPresent(this.previousFrame[ypos - 1]) && this.isPresent(this.previousFrame[ypos - 1][xpos - 1])) {
            if (this.previousFrame[ypos - 1][xpos - 1].getStatus()) {
                neighbourCount += 1;    
            }
        }
        
        //top
        if (this.isPresent(this.previousFrame[ypos - 1]) && this.isPresent(this.previousFrame[ypos - 1][xpos])) {
            if (this.previousFrame[ypos - 1][xpos].getStatus()) {
                neighbourCount += 1;    
            }
        }
        
        //topright
        if (this.isPresent(this.previousFrame[ypos - 1]) && this.isPresent(this.previousFrame[ypos - 1][xpos + 1])) {
            if (this.previousFrame[ypos - 1][xpos + 1].getStatus()) {
                neighbourCount += 1;    
            }
        }
        
        //middleLeft
        if (this.isPresent(this.previousFrame[ypos]) && this.isPresent(this.previousFrame[ypos][xpos - 1])) {
            if (this.previousFrame[ypos][xpos - 1].getStatus()) {
                neighbourCount += 1;    
            }
        }
        
        //middleright
        if (this.isPresent(this.previousFrame[ypos]) && this.isPresent(this.previousFrame[ypos][xpos + 1])) {
            if (this.previousFrame[ypos][xpos + 1].getStatus()) {
                neighbourCount += 1;    
            }
        }
        
        //bottomleft
        if (this.isPresent(this.previousFrame[ypos + 1]) && this.isPresent(this.previousFrame[ypos + 1][xpos - 1])) {
            if (this.previousFrame[ypos + 1][xpos - 1].getStatus()) {
                neighbourCount += 1;    
            }
        }
        
        //bottom
        if (this.isPresent(this.previousFrame[ypos + 1]) && this.isPresent(this.previousFrame[ypos + 1][xpos])) {
            if (this.previousFrame[ypos + 1][xpos].getStatus()) {
                neighbourCount += 1;    
            }
        }
        
        //bottomright
        if (this.isPresent(this.previousFrame[ypos + 1]) && this.isPresent(this.previousFrame[ypos + 1][xpos + 1])) {
            if (this.previousFrame[ypos + 1][xpos + 1].getStatus()) {
                neighbourCount += 1;    
            }
        }
        
        return neighbourCount;
    };
    
    this.generateGridCopy = function () {
        //todo: find a better way of cloning an object in javascript
        var newGrid = Array();
        for(var i = 0; i < this.grid.height; i++) {
            var newRow = Array();
            for(var j = 0; j < this.grid.width; j++) {
                var newCell = new tileHolder('old',j,i);
                newCell.setStatus(this.grid.getTileStatus(j,i));
                newRow[j] = newCell;
            }
            newGrid[i] = newRow;
        }
        return newGrid;
    }
    
    this.isPresent = function (cell) {
        if (typeof cell != 'undefined') {
            return true;
        } else {
            return false;    
        }
    }
    
}