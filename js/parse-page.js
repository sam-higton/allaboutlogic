$(document).ready(function () {
    
    //initialize parse
    Parse.initialize("Noe0ZvEb21KdGTMh4cyT58MNF220MzY83XjvLfPz", "VKIQRl2KZytec4F38kmM95jcQLzh1ymCm5psxQ1r");
    
    //set up message object
    var parseMessage = Parse.Object.extend('parseMessage');
    
    //fetch existing messages
    fetchMessages(parseMessage);
    
    $('#send-message').live('click',function () {
       var $messageBox = $('#message-box');
       if($messageBox.val() !== "") {
            var parseInstance = new parseMessage();
            parseInstance.save({
                message: $messageBox.val()    
            }, {
                    success: function () {
                        fetchMessages(parseMessage);       
                    }
            });
       } else {
            alert('write something');   
       }
    });
    
});


function testParse () {
    
    var TestObject = Parse.Object.extend("TestObject");
    var testObject = new TestObject();
    testObject.save({foo: "bar"}, {
      success: function(object) {
        alert("yay! it worked");
      }
    });

}

function fetchMessages(messageObject) {
    var messageQuery = new Parse.Query(messageObject);
    messageQuery.descending('createdAt');
    messageQuery.find({
        success: function(results) {
            var $messageList =  $('#message-list');
            $messageList.html('');
            for(var i in results) {
                var message = results[i].attributes.message;
                var dateStamp = results[i].createdAt;
                var $messageElement = $('<li></li>');
                $messageElement.append(message);
                $messageElement.append('<span class="date">' + dateStamp + '</span>');
                $messageList.append($messageElement);
            }
            
        }
    });
}