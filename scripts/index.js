function addRow() {
    
    var table = document.getElementById("invoice_table");
    var row = table.insertRow(11);
    row.className = "table_of_items";
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    var cell6 = row.insertCell(6);
    var cell7 = row.insertCell(7);
    var cell8 = row.insertCell(8);
    cell0.innerHTML = "";
    cell0.className = "serialNum"
    cell1.innerHTML = "<div name=\"invoice_product_sch[]\" contenteditable></div>";
    cell2.innerHTML = "<div name=\"invoice_product_com[]\" contenteditable></div>";
    cell3.innerHTML = "<div name=\"invoice_product_hsn[]\" contenteditable></div>";
    cell4.innerHTML = "<input type=\"number\" class=\"of-items\" name=\"invoice_product_price[]\">";
    cell5.innerHTML = "<input type=\"number\" class=\"of-items\" name=\"invoice_product_tax[]\">";
    cell6.innerHTML = "<input type=\"number\" class=\"of-items\" name=\"invoice_product_qty[]\">";
    cell7.innerHTML = "<span name=\"product_sub_total[]\" class=\"product_sub_total\">0.0</span>";
    cell8.innerHTML = '<button class="myButton" onclick="deleteRow(this)">DELETE</button>';
    cell8.className = "noprint";
    calculateTotal();
}

function deleteRow(r) {
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("invoice_table").deleteRow(i);
    calculateTotal();
}

function calculateTotal() {
    var grandtotal = 0,
    disc = 0,
    total_tax = 0,
    total = 0,
    sub_t = 0;
    $('.table_of_items').each(function () {
        var tax = $('[name="invoice_product_tax[]"]', this).val() || 0,
        quantity = $('[name="invoice_product_qty[]"]', this).val(),
        price = $('[name="invoice_product_price[]"]', this).val();
        sub_t = parseInt(quantity)*parseFloat(price);
        total_tax += sub_t*parseFloat(tax)/100;
        total += sub_t; 
    });
    disc = $("#disc").val() || 0;
    grandtotal = parseFloat(total) + parseFloat(total_tax) - parseFloat(disc);
    var in_words = "Grand Total in words:\n"+number2text(grandtotal);



    //Binding variables to text
    $("#total").text(total);
    $("#total_tax").text(total_tax);
    $("#grand_total_words").text(in_words);
    $("#grand_total").text(grandtotal);
}

function number2text(value) {
    var fraction = Math.round(frac(value)*100);
    var f_text  = "";

    if(fraction > 0) {
        f_text = "AND "+convert_number(fraction)+" PAISE";
    }

    return convert_number(value)+" RUPEE "+f_text+" ONLY";
}

function frac(f) {
    return f % 1;
}

function convert_number(number)
{
    if ((number < 0) || (number > 999999999)) 
    { 
        return "NUMBER OUT OF RANGE!";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */ 
    number -= Gn * 10000000; 
    var kn = Math.floor(number / 100000);     /* lakhs */ 
    number -= kn * 100000; 
    var Hn = Math.floor(number / 1000);      /* thousand */ 
    number -= Hn * 1000; 
    var Dn = Math.floor(number / 100);       /* Tens (deca) */ 
    number = number % 100;               /* Ones */ 
    var tn= Math.floor(number / 10); 
    var one=Math.floor(number % 10); 
    var res = ""; 

    if (Gn>0) 
    { 
        res += (convert_number(Gn) + " CRORE"); 
    } 
    if (kn>0) 
    { 
            res += (((res=="") ? "" : " ") + 
            convert_number(kn) + " LAKH"); 
    } 
    if (Hn>0) 
    { 
        res += (((res=="") ? "" : " ") +
            convert_number(Hn) + " THOUSAND"); 
    } 

    if (Dn) 
    { 
        res += (((res=="") ? "" : " ") + 
            convert_number(Dn) + " HUNDRED"); 
    } 


    var ones = Array("", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX","SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN","FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN","NINETEEN"); 
var tens = Array("", "", "TWENTY", "THIRTY", "FOURTY", "FIFTY", "SIXTY","SEVENTY", "EIGHTY", "NINETY"); 

    if (tn>0 || one>0) 
    { 
        if (!(res=="")) 
        { 
            res += " AND "; 
        } 
        if (tn < 2) 
        { 
            res += ones[tn * 10 + one]; 
        } 
        else 
        { 

            res += tens[tn];
            if (one>0) 
            { 
                res += ("-" + ones[one]); 
            } 
        } 
    }

    if (res=="")
    { 
        res = "zero"; 
    } 
    return res;
}



$(document).ready(function(){
     var Datastore = require('./scripts/nedb.js')
      , db = new Datastore({ filename: 'db/data.db', autoload: true });



    //Update product totals on input 
    function updateTotals(elem) {
            var tr = $(elem).closest('tr'),
            quantity = $('[name="invoice_product_qty[]"]', tr).val(),
            price = $('[name="invoice_product_price[]"]', tr).val();
            var subtotal = parseInt(quantity)*parseInt(price);
            $('.product_sub_total', tr).text(subtotal.toFixed(2));
    }

    //Process on inputs 
    $('#invoice_table').on('input', '.of-items', function () {
        updateTotals(this);
        calculateTotal();
       
    });

    //Process on input in discounts
    $('#invoice_table').on('input','[name="disc"]',function() {
        calculateTotal();
    });

    $("#submitButton").click(function(){
        
        var arr = [];
        $('.table_of_items').each(function () {
            arr.push($("[name='invoice_product_sch[]']",this).text());
            arr.push($("[name='invoice_product_com[]']",this).text());
            arr.push($("[name='invoice_product_hsn[]']",this).text());
            arr.push($("[name='invoice_product_price[]']",this).val()) || 0;
            arr.push($("[name='invoice_product_tax[]']",this).val()) || 0;
            arr.push($("[name='invoice_product_qty[]']",this).val()) || 0;
            arr.push($("[name='product_sub_total[]']",this).text());
        });
        //Define document
        var doc = { 
            nameAddress : $("#nameAddress").text()
            , grandTotal : $("#grand_total").text()
            , invoiceDate : $("#invoice_date").val()
            , items : arr
        };
         

        db.insert(doc, function (err, newDoc) {   // Callback is optional
          // newDoc is the newly inserted document, including its _id
          
        });
        
    }); 
});
