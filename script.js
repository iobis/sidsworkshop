$(document).ready(function() {
	$.ajax({
		type: "GET",
		url: "Participants SIDS-BBNJ workshop.csv",
		dataType: "text",
		success: function(data) {
			processParticipants(data);
		}
	});
	$.ajax({
		type: "GET",
		url: "programme-for-web.csv",
		dataType: "text",
		success: function(data) {
			processProgramme(data);
		}
	});
});

var processProgramme = function(csv) {
	var data = $.csv.toArrays(csv);

	var o = {};
	var block = [];
	var previous = "dummy";

	for (var i = 1; i < data.length; i++) {

		var datetime = data[i][0];
		var endHour = null;
		var endMinutes = null;
		var startMonth = datetime.substr(5, 2);
		var startDay = datetime.substr(8, 2);
		var startHour = datetime.substr(11, 2);
		var startMinutes = datetime.substr(14, 2);
		if (datetime.length > 16) {
			endHour = datetime.substr(17, 2);
			endMinutes = datetime.substr(20, 2);
		}
		var type = data[i][1];
		var place = data[i][2];
		var title = data[i][3];
		var speaker = data[i][4];
		var name = data[i][5];
		var link = data[i][6];
		var timeString = timeString = startHour + ":" + startMinutes;
		if (endHour) {
			timeString = timeString + " - " + endHour + ":" + endMinutes;
		}
		var dateString = startDay + "/" + startMonth;

		if (dateString == "07/03") {
			dateString = "Tuesday 07/03";
		} else if (dateString == "08/03") {
			dateString = "Wednesday 08/03";
		} else if (dateString == "09/03") {
			dateString = "Thursday 09/03";
		} else if (dateString == "10/03") {
			dateString = "Friday 10/03";
		}

		var item = {
			time: timeString,
			type: type,
			place: place,
			title: title,
			speaker: speaker,
			name: name,
			link: link
		};

		// check if date is present
		if (!o.hasOwnProperty(dateString)) {
			o[dateString] = []
		}

		// check if item belongs to latest block
		if (o[dateString].length > 0 && o[dateString][o[dateString].length - 1].type == item.type && o[dateString][o[dateString].length - 1].location == item.location) {
			o[dateString][o[dateString].length - 1].items.push(item);
		} else {
			o[dateString].push({
				type: item.type,
				location: item.location,
				items: [ item ]
			});
		}

	}

	for (d in o) {

		var el = $("<h3>" + d + "</h3><table class=\"table\"><tbody></tbody></table>");
		$("#programme").append(el);
		var tbody = el.find("tbody");

		for (b in o[d]) {
			var first = true;
			for (p in o[d][b].items) {

				var cl = "";
				if (o[d][b].type == "transport") {
					cl = "pr-transport";
				} else if (o[d][b].type == "break") {
					cl = "pr-break";
				}

				var cl2 = "";
				if (o[d][b].items[p].speaker == "moderator") {
					cl2 = "pr-moderator";
				}

				if (first) {
					tbody.append(
						"<tr class=\"" + cl + "\">" +
						"<td width=\"15%\" rowspan=\"" + o[d][b].items.length + "\" class=\"break " + cl2 + "\">" + o[d][b].items[p].place + "</td>" +
						"<td width=\"15%\" class=\"" + cl2 + "\">" + o[d][b].items[p].time + "</td>" +
						"<td width=\"40%\" class=\"" + cl2 + "\">" + o[d][b].items[p].title + "</td>" +
						"<td width=\"30%\" class=\"" + cl2 + "\">" + o[d][b].items[p].name + "</td>" +
						"</tr>"
					);
					first = false;
				} else {
					tbody.append(
						"<tr class=\"" + cl + "\">" +
						"<td class=\"" + cl2 + "\">" + o[d][b].items[p].time + "</td>" +
						"<td class=\"" + cl2 + "\">" + o[d][b].items[p].title + "</td>" +
						"<td class=\"" + cl2 + "\">" + o[d][b].items[p].name + "</td>" +
						"</tr>"
					);
				}

			}
		}
	}

};

var processParticipants = function(csv) {
	var data = $.csv.toArrays(csv);
	var o = {};
	for (var i = 1; i < data.length; i++) {
		var group = data[i][1];
		if (group == "") {
			break;
		}
		var country = data[i][2];
		var name = data[i][3];
		var fun = data[i][4];
		if (!o.hasOwnProperty(group)) {
			o[group] = {};
		}
		if (!o[group].hasOwnProperty(country)) {
			o[group][country] = {};
		}
		o[group][country][name] = fun;
	}
	for (g in o) {
		var el = $("<h3>" + g + "</h3><table class=\"table\"><tbody></tbody></table>");
		$("#participants").append(el);
		for (c in o[g]) {
			var rows = Object.keys(o[g][c]).length
			var first = true;
			for (n in o[g][c]) {
				if (first) {
					el.find("tbody").append("<tr><td rowspan=\"" + rows + "\" width=\"20%\">" + c + "</td><td width=\"30%\">" + n + "</td><td width=\"50%\">" + o[g][c][n] + "</td></tr>")
					first = false;
				} else {
					el.find("tbody").append("<tr><td>" + n + "</td><td>" + o[g][c][n] + "</td></tr>")
				}
			}
		}
	}
};