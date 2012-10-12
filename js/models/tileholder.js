function tileHolder (name,xpos,ypos) {
	this.name = name;
	this.Content = null;
	this.xPos = xpos;
	this.yPos = ypos;
    this.status = false;
	
	this.render = function (target) {
        var statusClass;
        if(this.status) {
            statusClass = "on";    
        } else {
            statusClass = "off";    
        }
		var $tileObject = '<div class="tileholder ' + statusClass + '" data-xpos="' + this.xPos + '" data-ypos="' + this.yPos + '">&nbsp;</div>';
		target.append($tileObject);
	}
    
    this.getStatus = function () {
        return this.status; 
    };
    
    this.setStatus = function (status) {
        this.status = status;    
    };
}
