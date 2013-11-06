/**
 * 
 */
$ = window.$ = window.jQuery;

function getApprovals() {
	$.getJSON('/approvals').done(function (data) {buildList(data)})
}

function buildList(data) {
	var rowType = "even_row"
	var table = $('#approvalsTable')
	var tablebody = $('#approvalBody')
	tablebody.empty();
	
	if (data.error) {
		var tr = $('<tr><td style="font-size: 25px; color: red">' + data.error + '</td></tr>')
		table.append(tr)
		return
	}
	
	for (var i = 0; i < data.length; i++) {
		if (i % 2 == 0) {
			rowType = "even_row"
		}
		else {
			rowType = "odd_row"
		
		}
		
		var tr = $('<tr class=' + rowType + '>')
		var idtd = $('<td>' + data[i].id + '</td>')
		var cbtd = $('<td/>')
		var cb = $('<label>' +  data[i].status + '</label>')
		if (data[i].status == 'Approved') {
			cb.prop('checked', true);
		}
		else {
			cb.prop('checked', false);
		}
		cb.appendTo(cbtd)
		
		var ttd = $('<td>' + data[i].title + '</td>')
		var dtd = $('<td>' + data[i].description + '</td>')
		
		var deltd = $('<td><a href="javascript:void(0)"><img onclick="deleteApproval(' + data[i].id + ')" width="25px" src="images/redx.jpg" id="' + data[i].id + '"></td>')
		
		tr.append(idtd)
		tr.append(ttd)
		tr.append(dtd)
		tr.append(cbtd)
		tr.append(deltd)
		table.append(tr)
	}
}

function submitApproval() {
    
    item = {}
    item["title"] = $("input[id=title]").val()
    item["description"] = $("input[id=description]").val()
    item["status"] = "Pending";
    data = JSON.stringify(item)
    
    $.post('/approvals', data, 'json').done(function(data) {buildList(JSON.parse(data))})
}

function deleteApproval(id) {
	$.ajax({
	    url: '/approvals/' + id,
	    type: 'DELETE',
	    success: function(result) {
	    	data = JSON.parse(result)
	        buildList(data)
		}
	});
}

function approve(id) {




}



