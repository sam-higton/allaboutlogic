$(document).ready(function () {
	//main
	var bigGrid = new grid('bigGrid',50,40,'div.left-col');
	bigGrid.render();
    
    var conway = new Conway(bigGrid);
    
    //really lazy event handling
    //todo: proper object level events handling
    $('div.tileholder').live('click',function () {
       var $this = $(this);
       var xpos = $this.data('xpos');
       var ypos = $this.data('ypos');
       if(bigGrid.getTileStatus(xpos,ypos)) {
            bigGrid.setTileStatus(false,xpos,ypos);   
       } else {
            bigGrid.setTileStatus(true,xpos,ypos);   
       }
       bigGrid.update();
       
       
    });
    
    $('input.iterate').live('click',function () {
        conway.iterate();    
    });
    
    $('input.start').live('click',function () {
       conway.start();
    });
    
    $('input.stop').live('click',function () {
       conway.stop(); 
    });
    
    function mainLoop() {
      conway.iterate();  
    }
    
    setInterval(mainLoop,conway.interval);
	
});
