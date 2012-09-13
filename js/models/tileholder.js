function tileHolder (name,xpos,ypos) {
	this.name = name;
	this.Content = null;
	this.xPos = xpos;
	this.yPos = ypos;
	
	this.render = function (target) {
		var $tileObject = '<div class="tileholder">' + this.name + '</div>';
		target.append($tileObject);
	}
}
