/**
 * 
 */
 
 
   function loadCategories() {
  	$.getJSON('/items').done(function(items) {
  		var navpane = $('#nav-pane')
  		for (var i = 0; i < items.length; i++) {
  			var link = $('<div><a href="javascript:void(0)" onclick="showItem(' + items[i].id + ')" >' + items[i].name + '</a></div>')
  			navpane.append(link)
  		}
  	})
  }
  
function showItem(id) {
  	$.getJSON('/item/' + id).done(function(wmitems) {
  	
  		
  		$.getJSON('/competitor/item/' + id).done(function(bbitems) {
  			
  			if (wmitems.customerRating == undefined) {
  				wmitems.customerRating = 0
  			}
  		
	  		if (wmitems.numReviews == undefined) {
	  			wmitems.numReviews = 0
	  		}
	  		
	  		if (bbitems.customerReviewAverage == null) {
	  			bbitems.customerReviewAverage = 0
	  		}
	  		
	  		if (bbitems.customerReviewCount == null) {
	  			bbitems.customerReviewCount = 0
	  		}
	  		
	  		var pricecolor = 'green'
	  		var ratingcolor = 'green'
	  		var reviewscolor = 'green'
	  		
	  		if (wmitems.salePrice > bbitems.salePrice) {
	  			 pricecolor = 'red' 
	  		}
	  		
	  		if (parseFloat(wmitems.customerRating) < parseFloat(bbitems.customerReviewAverage)) {
	  			 ratingcolor = 'red' 
	  		}
	  		
	  		if (wmitems.numReviews < bbitems.customerReviewCount) {
	  			 reviewscolor = 'red' 
	  		}
	  		
	  		showIcons('wmItemlist', pricecolor, ratingcolor, reviewscolor)
  			showVals('wmItemlist', wmitems.salePrice, wmitems.customerRating, wmitems.numReviews)
  			
  			showIcons('bbItemlist', 'black', 'black', 'black')
  			showVals('bbItemlist', bbitems.salePrice, bbitems.customerReviewAverage, bbitems.customerReviewCount)
  	
  		})
  	
  	})
  } 
  
  function showIcons(itemlist, pricecolor, ratingcolor, reviewscolor) {
  		var wmItemList = $('#' + itemlist)
  		wmItemList.empty()
  		
  		var icondiv = $('<div style="clear:both"></div>')
  		
  		var priceicon = $('<div style="float:left; width: 130px"><img width="50px" src="/images/icons/' + pricecolor + 'dollar.jpg"></div>')
  		var ratingicon = $('<div style="float:left; width: 130px"><img width="50px" src="/images/icons/' + ratingcolor + 'star.jpg"></div>')
  		var reviewsicon = $('<div style="float:left; width: 130px"><img width="50px" src="/images/icons/' + reviewscolor + 'page.jpg"></div>')
  		
  		icondiv.append(priceicon)
  		icondiv.append(ratingicon)
  		icondiv.append(reviewsicon)
  		wmItemList.append(icondiv)
}
  
  function showVals(itemlist, price, rating, reviews) {
  		var wmItemList = $('#' + itemlist)
  		var rowdiv = $('<div style="clear:both"></div>')
  		
  		var price = $('<div style="float:left; width: 130px; font-size: 30px">' + price + '</div>')
  		var rating = $('<div style="float:left; width: 130px; font-size: 30px">' + rating + '</div>')
  		var reviews = $('<div style="float:left; width: 130px; font-size: 30px">' + reviews + '</div>')
  	//	var shipping = $('<div style="float:left">' + wmitems.salePrice + '</div>')
  		
  		rowdiv.append(price)
  		rowdiv.append(rating)
  		rowdiv.append(reviews)
  		wmItemList.append(rowdiv)
  
  }
  
  function showEmail() {
  	var dialog = $('#email-dialog')
  	dialog.empty()
  	dialog.append($('<div style="float:left; font-size: 20px"><label>email address: </label></div>'))
	dialog.append($('<div style="float:left; padding-left: 10px"><input id="emailaddr" type="text" placeholder="enter email address"></input></div>'))
	dialog.append($('<div style="float:left; padding-left: 10px"><input class="app-control-button" style= "height: 30px; width: 75px" type="submit" id="newapp-button" value="Send" onclick="send()"></input></div>'))
	
	dialog.dialog({ width: 525, height: 150})
  }
  
  function send() {
  	$('#email-dialog').dialog('close');
  
  }