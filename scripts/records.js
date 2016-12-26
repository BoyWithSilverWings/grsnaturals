$(document).ready(function () {
	var Datastore = require('./scripts/nedb.js'),
		db = new Datastore({ filename: 'db/data.db', autoload: true });
	var entry;
	// Find all documents in the collection
	$('#pagination').twbsPagination({
		totalPages: 50,
		visiblePages: 7,
		onPageClick: function (event, page) {
			$('#tables').empty();
			db.find({}).limit(page * 10).exec(function (err, docs) {
				for (i = (page * 10 - 10); i < docs.length; i++) {
					entry = "<table class='entry'>" +
							"<tr><th>Invoice Number</th><th>Name & Address</th><th>Invoice Date</th><th>Grand Total</th></tr><tr>";
					entry += "<td class='num'>"+docs[i].num+"</td>" + 
							"<td class='name'>"+docs[i].name+"</td>" +
							"<td class='date'>"+docs[i].date+"</td>" +
							"<td class='total'>"+docs[i].grand_total+"</td>"+
							"<td><button class='deleteRow' id='"+docs[i]._id+"'>Delete</button></td></tr>"+
							"<tr><th>Product SCH</th><th>Product com</th><th>HSN</th><th>Price</th><th>Tax</th><th>Quantity</th><th>Total</th></tr><tr>";
					for(j=0; j < docs[i].items.length; j++) {
						entry += "<tr>";
						for(k=0;k<docs[i].items[j].length;k++) {
							entry += "<td>"+docs[i].items[j][k]+"</td>";
						}
						entry += "</tr>"; 
					}
					entry += "</table>";
					$("#tables").append(entry);
				}
			});
		}
	});
	$('#tables').on('click','button.deleteRow',function(event) {
		event.preventDefault();
		var id = $ ( this ).attr('id');
		db.remove({ _id: id }, {}, function (err, numRemoved) {
			console.log(err);
		});
		$(this).parents('.entry').hide();
	});
});