/**
 * 
 */
 
 var page = 1
 var currentApp = '' 
 var connectionMap = {}
 var connPage = 0;
 
 jsPlumb.bind("connection", function(info) {
   console.log(info)
   
	connectionMap[info.connection.id] = page
	info.connection.bind("click", function(conn) {
	console.log(conn)
		//var page = connectionMap[conn.id]
    	//$('#mybook').booklet("gotopage", page)
    	explodeConnection(conn)
	});
	
 	var conndata = {}
 	conndata['_id'] = info.source.id + info.target.id
 	conndata['app'] = currentApp
 	conndata['source'] = info.source.id
 	conndata['target'] = info.target.id
 	conndata['page'] = page
 	conndata['notes'] = ''
 	
 	data = JSON.stringify(conndata)
 	
 	
 	$.post('/connection', data, 'json')
	
	page++
   
 });
 
 function saveimage(canvasId) {
 
 	var canvas = document.getElementById(canvasId);
 
 	var dataURL = canvas.toDataURL();
 	console.log(dataURL)
 	
 	var imagedata = {}
 	imagedata['app'] = currentApp
 	imagedata['image'] = dataURL
 	
 	data = JSON.stringify(imagedata)
 	
 	
 	$.post('/screen', data, 'json').done(function() { load(currentApp) })
 
 }
 
 function buildScreens(data, id) {
	//$('#mybook').booklet();
		
 	var imagepane = $('#imagepane')
 	
 	leftval = 0
 	topval = 0
 	
 	var screensTitle = "<h2> Screens </h2>"
 	$('#mybook').booklet("add", page, screensTitle);
 	page++
 
 	for (var i = 0; i < data.length; i++) {
 		//console.log(data[i].doc.image)
 		//  onclick="explode(\'div-' + data[i].doc._id + '\')">
 		
 		if (data[i].doc.position != undefined) {
 			leftval = data[i].doc.position.left
 			topval = data[i].doc.position.top
 			
 		}
 		else {
 			leftval = leftval + 50;
 		
 		}
 		
 		var imagediv = $('<div id="screen-' + data[i].doc._id + '" class="component window" style="left: ' + leftval + 'px; top: ' + topval + 'px" onclick="explodeScreen(\'' + data[i].doc._id + '\')"><img id="' + data[i].doc._id + '" width="125px" src="' + data[i].doc.image + '"></img></div>')
		imagepane.append(imagediv)
		
 		var bookletdiv = $('<div> <img width="400px" src="' + data[i].doc.image + '"></img></div>')
		
		notes = data[i].doc.notes
		
		if (notes == undefined) {
			notes = ""
		}
		
		addBookletPage(bookletdiv, data[i].doc._id, notes, page)
		
		page++
 	}
 	
 	var connectionsTitle = "<h2> Connections </h2>"
 	$('#mybook').booklet("add", page, connectionsTitle);
 	connPage = page
 	page++
 	
 	jsPlumb.draggable(jsPlumb.getSelector(".window"), { containment:".demo"}); 
 	
 	var exampleDropOptions = {
		tolerance:"touch",
		hoverClass:"dropHover",
		activeClass:"dragActive"
	};
 	var color2 = "#316b31";
	var exampleEndpoint2 = {
		endpoint:["Dot", { radius:11 }],
		paintStyle:{ fillStyle:color2 },
		isSource:true,
		scope:"green dot",
		connectorStyle:{ strokeStyle:color2, lineWidth:6 },
		connector: ["Bezier", { curviness:63 } ],
		maxConnections:50,
		isTarget:true,
		connectorOverlays:[ 
            [ "Arrow", { width:30, length:30, location:1, id:"arrow" } ], 
            [ "Label", { label:"", id:"label" } ]
        ],
		dropOptions : exampleDropOptions
	};
	
	jsPlumb.addEndpoint($(".window"), exampleEndpoint2);
	
	loadConnections(id)
 
 }
 
  function buildConnections(data) {
	//$('#mybook').booklet();
 	var color2 = "#316b31";
 	var exampleDropOptions = {
		tolerance:"touch",
		hoverClass:"dropHover",
		activeClass:"dragActive"
	};
	
 	for (var i = 0; i < data.length; i++) {
 		jsPlumb.connect({
		    source: data[i].doc.source, 
		    paintStyle:{ 
					lineWidth:6, 
					strokeStyle:color2, 
				},
		    target:data[i].doc.target,
			detachable:true,
			anchors:["Bottom", "Bottom"], 
			connector: ["Bezier", { curviness:63 } ],
		    endpointStyle:{fillStyle:color2 },
		    overlays:[ 
	            [ "Arrow", { width:30, length:30, location:1, id:"arrow" } ], 
	            [ "Label", { label:"", id:"label" } ]
	        ],
	        dropOptions : exampleDropOptions
		});
 	}
 
 }
 
 function load(id) {
 	$('#imagepane').empty()
 	currentApp = id
 	$.getJSON('/screens/' + id).done(function(data) {buildScreens(data, id); saveCurrentApp(id)})
 
 }
 
  function loadConnections(id) {
 	$.getJSON('/connections/' + id).done(function(data) {buildConnections(data)})
 
 }
 
 function explodeScreen(id) {
 
 	$.getJSON('/screen/' + id).done(function(data) {
 
	 	var explodediv = $('<div>')
	 	var imagediv = $('<img width="500px" src="' + data.image + '"></img>')
	 	var textdiv = $('<div> <textarea style="width: 650px; height: 300px" id="ta-' + data._id + '">' + data.notes + '</textarea></div>')
	 	var savebutton = $('<div> <input type="button" value="Save" onclick="saveNotes(\'screen\',\''+ data._id + '\')"/></div>')
	 	$('#ta-' + data._id).transformTextarea();
		
		// Use a custom slider	
		$("#slider").slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 100,
			slide: function( event, ui ) {
				// Top = 0
				var perc = 100 - ui.value;
				
				// Scroll textarea to given percentage
				$('#ta-' + id).transformTextarea("scrollToPercentage", perc);
			}
		});
	
		// Move the slider to the scrollHeight of the textarea
		$('#ta-' + id).bind("scrollToPx", function(e, px, percentage){
			$( "#slider" ).slider("option", "value", 100 - percentage);	
		});
	 		
 		$('#explode-pane').empty()
	 	explodediv.append(imagediv)
	 	explodediv.append(textdiv)
	 	explodediv.append(savebutton)
		$('#explode-pane').append(explodediv)
	})
 
 }
 
 function explodeConnection(conn) {
 
 console.log(conn)
 console.log(conn.id)
 
 	$.getJSON('/connection/' + conn.source.id + conn.target.id).done(function(data) {
    	
		var explodediv = $('<div>')
		
		var sourceimg = $('#' + conn.source.id).clone().find('img')
		var targetimg = $('#' + conn.target.id).clone().find('img')
		sourceimg.width(300)
		targetimg.width(300)
		
		var sourcediv = $('<div>')
		sourcediv.append(sourceimg)
		
		var targetdiv = $('<div>')
		targetdiv.append(targetimg)
		
		sourcediv.css("float", "left")
		targetdiv.css("float", "left")
		var arrow = "<div style='float: left; margin-top: 50px' width='50'><img width='50' src='/images/arrow-right.png'></div>"
		
		
	 	var textdiv = $('<div style="clear: both;"> <textarea style="width: 650px; height: 300px" id="ta-' + data._id + '">' + data.notes + '</textarea></div>')
	 	var savebutton = $('<div> <input type="button" value="Save" onclick="saveNotes(\'connection\',\''+ data._id + '\')"/></div>')
	 	$('#ta-' + data._id).transformTextarea();
		
		// Use a custom slider	
		$("#slider").slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 100,
			slide: function( event, ui ) {
				// Top = 0
				var perc = 100 - ui.value;
				
				// Scroll textarea to given percentage
				$('#ta-' + data._id).transformTextarea("scrollToPercentage", perc);
			}
		});
	
		// Move the slider to the scrollHeight of the textarea
		$('#ta-' + data._id).bind("scrollToPx", function(e, px, percentage){
			$( "#slider" ).slider("option", "value", 100 - percentage);	
		});
	 		
 		$('#explode-pane').empty()
	 	explodediv.append(sourcediv)
	 	explodediv.append(arrow)
	 	explodediv.append(targetdiv)
 		explodediv.append(textdiv)
	 	explodediv.append(savebutton)
		$('#explode-pane').append(explodediv)
		
 	})
 	
 }
 
 function turnPage(page) {
	 $('#mybook').booklet("gotopage", page)
 }

 
function addBookletPage(imagediv, id, notes, page) {
	var bookletdiv = $('<div>')
 	var textdiv = $('<div> <textarea style="width: 260px; height: 300px" id="ta-' + id + '">' + notes + '</textarea></div>')
 	var savebutton = $('<div> <input type="button" value="Save" onclick="saveNotes(\''+ id + '\')"/></div>')
 	$('#ta-' + id).transformTextarea();
	
	// Use a custom slider	
	$("#slider").slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 100,
		slide: function( event, ui ) {
			// Top = 0
			var perc = 100 - ui.value;
			
			// Scroll textarea to given percentage
			$('#ta-' + id).transformTextarea("scrollToPercentage", perc);
		}
	});

	// Move the slider to the scrollHeight of the textarea
	$('#ta-' + id).bind("scrollToPx", function(e, px, percentage){
		$( "#slider" ).slider("option", "value", 100 - percentage);	
	});
 		
 	bookletdiv.append(imagediv)
 	bookletdiv.append(textdiv)
 	bookletdiv.append(savebutton)
		
	$('#mybook').booklet("add", page, bookletdiv);
	leftval += 240
}

function saveNotes(type, id) {
	console.log($('#ta-' + id).val())
	var notesdata = {}
 	notesdata['id'] = id
 	notesdata['notes'] = $('#ta-' + id).val()
 	
 	data = JSON.stringify(notesdata)
 	
 	if (type == 'screen') {
 		$.post('/screen/' + id + '/notes', data, 'json')
 	}
 	else {
 		$.post('/connection/' + id + '/notes', data, 'json')
 	}
}

function showNewApp() {

	$( "#newapp-dialog" ).dialog();
	
}

function newApp() {

	$.post('/app').done(function(data) {
		console.log(data)
		currentApp = data.id
		load(data.id);
	})
	
	loadApps()
}



function loadApps() {
	$.getJSON('/apps').done(function(data) {
	
 		var applist = $('#myapps')
 		var select = $('<select>')
 		select.append($('<option class="label" value="">My Apps </option>' ))
 		applist.empty()
 		console.log(data)
 		currentApp = data[0]._id
 		for (var i = 0; i < data.length; i++) {
 			var selected = ''
 			if (data[i].name != undefined) {
 				if (data[i]._id == currentApp) {
 					selected = 'selected';
 					load(data[i]._id)
 				}
				var app = $('<option ' + selected + ' class="label" value="' + data[i]._id + '" onclick="load(\'' + data[i]._id + '\')">' + data[i].name + '</option>')
				select.append(app)
			}
 		}
 		applist.append(select)
 	})
}

function logout() {
	$.post('/logout').done(function(url) {window.location = url; })
}

function publish() {
	//$.post('/app/publish/' + currentApp, 'json')
	
	saveScreenPositions();
	
	function debug(str){ $("#debug").append("<p>"+str+"</p>"); };
	  var addr = "ws://localhost/app/publish/" + currentApp
	  ws = new WebSocket(addr);
	  ws.onmessage = function(evt) { $( "#publish-dialog" ).append("<p>"+evt.data+"</p>"); };
	  ws.onclose = function() { debug("socket closed"); };
	  ws.onopen = function() {
 	 };
 	$( "#publish-dialog" ).empty();
	$( "#publish-dialog" ).dialog();
}

function update() {
	//$.post('/app/publish/' + currentApp, 'json')
	console.log('ekm: currentApp: ' + currentApp)
	saveScreenPositions();
	
	$( "#update-dialog" ).empty()
	$( "#update-dialog" ).dialog();
	function debug(str){ $("#debug").append("<p>"+str+"</p>"); };
	  var addr = "ws://localhost/app/update/" + currentApp
	  ws = new WebSocket(addr);
	  ws.onmessage = function(evt) {$("#update-dialog").append("<p>"+evt.data+"</p>"); };
	  ws.onclose = function() { debug("socket closed"); };
	  ws.onopen = function() {
 	 };
 	
}

function repo() {

	$.getJSON('/app/' + currentApp).done(function(app) {
		$.getJSON('/user').done(function(data) {
			window.open('http://' + data.rows[0].doc.businesses[0].server + '/' + data.rows[0].doc.username + '/' + app.name + '/tree/master');
		})
	})
}

function issues() {
	$.getJSON('/issues/' + currentApp).done(function(data) {
		var issues = $( "#issues-dialog" )
		issues.empty()
		
	 	for (var i = 0; i < data.length; i++) {
	 		issues.append($('<div>Title: ' + data[i].title + '</div>'))
			issues.append($('<div>Description: ' + data[i].description + '</div>'))
			var notes = $('<div id="notes">Notes: </div>')
			issues.append(notes)
			issues.append($('<textarea id="' + data[i].id + '" placeholder="Your response"></textarea>'))
			issues.append($('<input type="submit" onclick="updateIssue(\'' + currentApp + '\', \'' + data[i].id + '\')" value="Update"></input>'))
			$.getJSON('/issues/' + currentApp + '/' + data[i].id + '/notes').done(function(notes) {
			console.log(notes)
				var notesdiv = $('#notes')
				for (var i = 0; i < notes.length; i++) {
					notesdiv.append($('<div>' + notes[i].body + '</div>'))
				}
			})
		}
		$( "#issues-dialog" ).dialog();
		
	})
}

function updateIssue(app, issue) {
 	var issuedata = {}
 	issuedata['id'] = app
 	issuedata['issue_id'] = issue
 	issuedata['body'] = $('#' + issue).val()
 	
 	data = JSON.stringify(issuedata)
 	
 	$.post('/issues/' + app + '/' + issue, data, 'json')

}

function saveScreenPositions() {
	var screens = $('[id^="screen-"]')
 	for (var i = 0; i < screens.length; i++) {
	 	var posdata = {}
	 	posdata['left'] = screens[i].style.left.split('px')[0]
	 	posdata['top'] = screens[i].style.top.split('px')[0]
	 	
	 	data = JSON.stringify(posdata)
 		var id =screens[i].id.split("screen-")[1]
 		console.log(id)
 		$.post('/screen/' + id + '/position', data, 'json')
		
	}

}

function deleteApp() {
	$.ajax({
	    url: '/app/' + currentApp,
	    type: 'DELETE',
	    success: function(result) {
	        // Do something with the result
    	}
	});
}

function saveCurrentApp(id) {
console.log('inside save: ' + id)
	$.ajax({
	    url: '/app/' + id + '/current',
	    type: 'PUT',
	    success: function(result) {
	        // Do something with the result
    }
	});
}

(function ($) {
    // Detect touch support
    $.support.touch = 'ontouchend' in document;
    // Ignore browsers without touch support
    if (!$.support.touch) {
    return;
    }
    var mouseProto = $.ui.mouse.prototype,
        _mouseInit = mouseProto._mouseInit,
        touchHandled;

    function simulateMouseEvent (event, simulatedType) { //use this function to simulate mouse event
    // Ignore multi-touch events
        if (event.originalEvent.touches.length > 1) {
        return;
        }
    event.preventDefault(); //use this to prevent scrolling during ui use

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
        simulatedType,    // type
        true,             // bubbles                    
        true,             // cancelable                 
        window,           // view                       
        1,                // detail                     
        touch.screenX,    // screenX                    
        touch.screenY,    // screenY                    
        touch.clientX,    // clientX                    
        touch.clientY,    // clientY                    
        false,            // ctrlKey                    
        false,            // altKey                     
        false,            // shiftKey                   
        false,            // metaKey                    
        0,                // button                     
        null              // relatedTarget              
        );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
    }
    mouseProto._touchStart = function (event) {
    var self = this;
    // Ignore the event if another widget is already being handled
    if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
        return;
        }
    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;
    // Track movement to determine if interaction was a click
    self._touchMoved = false;
    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');
    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');
    };

    mouseProto._touchMove = function (event) {
    // Ignore event if not handled
    if (!touchHandled) {
        return;
        }
    // Interaction was not a click
    this._touchMoved = true;
    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
    };
    mouseProto._touchEnd = function (event) {
    // Ignore event if not handled
    if (!touchHandled) {
        return;
    }
    // Simulate the mouseup event
    simulateMouseEvent(event, 'mouseup');
    // Simulate the mouseout event
    simulateMouseEvent(event, 'mouseout');
    // If the touch interaction did not move, it should trigger a click
    if (!this._touchMoved) {
      // Simulate the click event
      simulateMouseEvent(event, 'click');
    }
    // Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false;
    };
    mouseProto._mouseInit = function () {
    var self = this;
    // Delegate the touch handlers to the widget's element
    self.element
        .on('touchstart', $.proxy(self, '_touchStart'))
        .on('touchmove', $.proxy(self, '_touchMove'))
        .on('touchend', $.proxy(self, '_touchEnd'));

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
    };
})(jQuery);