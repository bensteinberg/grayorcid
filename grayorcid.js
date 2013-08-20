$(document).ready(function() {
    $("img").css('visibility', 'hidden');
    $("p#title").click(function() {
	$("p#text").fadeToggle();
    });
    $("input").val('Type an ORCID');
    $("input").focus(function() {
	if ($(this).val() == 'Type an ORCID') {
	    $(this).val('');
	}
    });
    hits = new Array();
    last = '';
    $("input").keyup(function() {
	input_string = $(this).val();
	if (input_string.length == 16) {
	    if (match = input_string.match(/^([0-9]{15}[0-9Xx])$/)) {
		segments = match[1].match(/.{1,4}/g);
		$(this).val(segments.join('-'));
	    }
	} 
	if (input_string.length == 19) {
	    if (input_string != last) {
		orcid = input_string;
		if (match = orcid.match(/^([0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9Xx])$/)) {
		    if (is_orcid(orcid)) {
			last = orcid;
			if (hits[orcid]) {
			    display(hits[orcid]);
			} else {
			    $("div#left").html('');
			    $("div#right").html('');
			    $("div#center").html('');
			    $("img#orcid").css('visibility', 'invisible');
			    //$("div#center").css('background-image', 'none');
			    $("img#throbber").css('visibility', 'visible');
			    $.ajax({
				url: 'grayorcid.php?orcid='+orcid,
				type: "GET",
				dataType: 'json',
				success: function(data) {
				    $("img#throbber").css('visibility', 'hidden');
				    hits[orcid] = data;				
				    display(data);
				}
			    });
			}
		    } else {
			$("div#left").html('');
			$("div#right").html('');
			$("div#center").html("<p>That is not an ORCID.</p>");
		    }
		}
	    }
	}
    });
});

function display(data) {
    if ($.isEmptyObject(data)) {
	$("div#center").html("<p>No matches</p>");
    } else {

	source = data[0];
	$("div#left").html('<p><a href="http://orcid.org/'+ source[0] + '">' + source[1] + '</a></p>');
	$("img#orcid").css('visibility', 'visible');
	$("div#center").html('<div id="share"><p>shares a gray ORCID with</p></div>');
	var output = '';
	if ($.isEmptyObject(data[1])) {
	    //$("div#center").css('background-image', 'none');
	    output = output + '<p>no one</p>';
	} else {
	    $("div#center").prepend('<div id="container">');
	    $("div#center").append('<div id="orchid"><img id="orchid" src="orchid2.jpg"></div></div>');
	    //$("div#center").css('background-image', 'url("orchid.png")');
	    output = output + '<p>';
	    for (var i = 1 ; i < data.length ; i++) {
		output = output + '<a href="http://orcid.org/' + data[i][0] + '">' + data[i][1] + '</a><br />';
	    }
	    output = output + '</p>'
	}
	$("div#right").html(output);
    }
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function is_orcid(orcid) {
    var base = orcid.replace(/-/g, '').slice(0, -1);
    var last = orcid[orcid.length - 1];
    if (check_digit(base) === last) {
	if ((orcid <= '0000-0003-5000-0001') && (orcid >= '0000-0001-5000-0007')) {
	    return 1;
	} else {
	    return 0;
	}
    } else {
	return 0;
    }
}

function check_digit(base) {
    var total = 0;
    for (var i = 0 ; i < base.length ; i++) {
	var digit = parseInt(base[i]);
	total = (total + digit) * 2;
    }
    var remainder = total % 11;
    var result = (12 - remainder) % 11;
    return result == 10 ? "X" : result.toString();
}
