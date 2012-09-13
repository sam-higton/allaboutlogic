function grid (name,width,height,target) {
	//variables
	this.name = name;
	this.width = width;
	this.height = height;
	this.target = target;
	this.gridLayout = Array();
	
	//functions
	this.buildGrid = function () {
		for (var i = 0; i < this.height; i++) {
			var row = Array();
			for (var j = 0; j < this.width; j++) {
				row[j] = new tileHolder(this.name + '_' + j + '-' + i,j,i);
			}
			this.gridLayout[i] = row;
		}		
	};
	
	this.render = function () {
		var $gridHolder = $('<div class="' + this.name + '-holder gridholder"></div>');
		for(var i in this.gridLayout) {
			var $row = $('<div class="row-' + i + '"></div>');
			for(var j in this.gridLayout[i]) {
				this.gridLayout[i][j].render($row);
			}
			$gridHolder.append($row); 
		}
		$(this.target).append($gridHolder);
	}
	
	//init
	this.buildGrid();
}
