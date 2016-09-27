$(document).ready(function(){
     var Datastore = require('./scripts/nedb.js')
      , db = new Datastore({ filename: 'db/data.db', autoload: true });
    var k;
      // Find all documents in the collection
	$('#pagination').twbsPagination({
        totalPages: 50,
        visiblePages: 7,
        onPageClick: function (event, page) {
        	$('#records tbody').empty();
            db.find({}).limit(page*10).exec(function (err, docs) {
            	for(i=(page*10-10);i<docs.length;i++) {
                k = 1;
            		var nameAddress = docs[i].nameAddress;
            		var grandTotal = docs[i].grandTotal;
            		var invoiceDate = docs[i].invoiceDate;
                var items = docs[i].items;
              		$('#records').append("<tr><td>"+nameAddress+"</td><td>"+grandTotal+"</td><td>"+invoiceDate+"</td></tr>");
                  for(j=0;j<items.length;j++) {
                    if(j!=0&&j%7==0) {
                      $("#products").append("</tr>");
                    }
                    if(j%7==0) {
                      $('#products').append("<tr><td>"+k+++"</td>");
                    }
                    $("#products").append("<td>"+items[j]+"</td>");
                  }
            	}
            });
        }
    });

});