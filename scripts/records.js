var Datastore = require('./scripts/nedb.js'),
	db = new Datastore({ filename: 'db/data.db', autoload: true });
var entry;

function appendToTable(docs) {
	for (i = 0; i < docs.length; i++) {
		entry = "<table class='entry'>" +
			"<tr><th>Invoice Number</th><th>Name & Address</th><th>Invoice Date</th><th>Grand Total</th></tr><tr>";
		entry += "<td class='num'>" + docs[i].num + "</td>" +
			"<td class='name'>" + docs[i].name + "</td>" +
			"<td class='date'>" + docs[i].date + "</td>" +
			"<td class='total'>" + docs[i].grand_total + "</td>" +
			"<td><button class='deleteRow' id='" + docs[i]._id + "'>Delete</button></td></tr>" +
			"<tr><th>SCH</th><th>Commodity</th><th>HSN</th><th>Price</th><th>Tax</th><th>Quantity</th><th>Total</th></tr><tr>";
		for (j = 0; j < docs[i].items.length; j++) {
			entry += "<tr>";
			for (k = 0; k < docs[i].items[j].length; k++) {
				entry += "<td>" + docs[i].items[j][k] + "</td>";
			}
			entry += "</tr>";
		}
		entry += "</table>";
		$("#tables").append(entry);
	}
	if(!docs.length) {
		$('#tables').append("<p style='text-align: center; padding: 150px;'>NO RESULTS FOUND</p>");
	} 
}
	
function paginate() {
	$('.sync-pagination').twbsPagination({
		totalPages: 50,
		visiblePages: 7,
		hideOnlyOnePage: true,
		onPageClick: function (event, page) {
			entry = "";
			$('#tables').empty();
			db.find({}).skip((page - 1)*10).limit(10).exec(function (err, docs) {
				appendToTable(docs);
			});
		}
	});
}

function forNum(num) {
	$('#tables').empty();
	db.find({num: num}).exec(function (err, docs) {
		appendToTable(docs);
	});
}

function forDate(invoiceDate) {
	$('#tables').empty();
	db.find({date: invoiceDate}).exec(function (err, docs) {
		appendToTable(docs);
	});
}

function forDateNum(num, invoiceDate) {
	$('#tables').empty();
	db.find({num: num, date: invoiceDate}).exec(function (err, docs) {
		appendToTable(docs);
	});
}

$(document).ready(function () {
	paginate();
	$('#tables').on('click','button.deleteRow',function(event) {
		event.preventDefault();
		var res = confirm('Delete this entry?');
		if(res) {
			var id = $ ( this ).attr('id');
			db.remove({ _id: id }, {}, function (err, numRemoved) {
				console.log(err);
			});
			$(this).parents('.entry').hide();
		} 
	});
	$("#filter").on('click',function(event){
		event.preventDefault();
		var num = $('#invoice_num').val() || 0,
			invoiceDate = $('#invoice_date').val() || null;
		if(!num&&!invoiceDate) {
			console.log("Here");
		} else if(!num&&invoiceDate) {
			forDate(invoiceDate);
		} else if(num&&!invoiceDate) {
			forNum(num);
		} else 
			forDateNum(num,invoiceDate);
	});
});
