var data_money;
var sort_mode = 1;

var row_contain = 20;

var x_init = 50;
var y_init = 50;
var x_dis = 50;
var y_dis = 90;
var x = x_init;
var y = y_init;
var y_count = 0;

var org_list = ['交通部', '國防部', '財政部', '經濟部', '法務部', '教育部', '內政部', '行政院海巡署', '司法院', '行政院農委會', '外交部', '銓敘部', '考選部', '科技部', '衛生福利部', '國軍退除役官兵輔導委員會', '原住民族委員會'];
var reason_list = ['交通意外', '天災', '軍訓事故', '行政疏失', '校園管教不當', '工程意外'];
var sort_btn_list = ['date', 'money', 'class', 'reason'];

var date_x_list = [];
var date_y_list = [];
var money_x_list = [];
var money_y_list = [];
var class_x_list = [];
var class_y_list = [];
var reason_class_x_list = [];
var reason_class_y_list = [];
var reason_text_y_list = [];
var class_list = {};
var reason_class_list = {};
var class_count = 1;
var reason_class_count = 1;

var all_org_event = [];
var all_org_money = [];

//-----------------------------------------------------------------------------------------//
for(var i = 0; i < org_list.length; i++)
	class_list[org_list[i]] = [];

for(var i = 0; i < reason_list.length; i++)
	reason_class_list[reason_list[i]] = [];

d3.csv("data/events_and_money.csv",function(data_event_money){
	for ( var i = 0; i < data_event_money.length; i++ ){
		var temp_event = {};
		var temp_money = {};

		temp_event['name'] = data_event_money[i]['org'];
		temp_event['data'] = [];
		temp_event['data'].push(parseInt(data_event_money[i]['events']));
		all_org_event.push(temp_event);

		temp_money['name'] = data_event_money[i]['org'];
		temp_money['data'] = [];
		temp_money['data'].push(parseInt(data_event_money[i]['money']));
		all_org_money.push(temp_money);
		
	}

	console.log(all_org_money);

	$(function () { 
    $('#all-money-chart').highcharts({
        chart: {
            type: 'column'
        },
        credits:{
        	enabled: false
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['十年賠償總金額']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: all_org_money
    });
});
});

d3.csv("data/compensate_merge.csv", function(data){
	/*console.log(data);
	for (var i = 0; i < data.length; i++){
		console.log(parseInt(data[i]['money']))
	}*/
	data_money = data.slice();

	var maxValue = d3.max(data, function(d){return parseInt(d.money)});
	var minValue = d3.min(data, function(d){return parseInt(d.money)});

	var rScale = d3.scale.linear()
				.range([5, 50])
				.domain([Math.sqrt(minValue), Math.sqrt(maxValue)]);

	var svg = d3.select(".main-chart").append("svg").attr({'class': 'main-svg', 'width': 1100, 'height': 1800})	;

	tip = d3.tip().attr('class', 'd3-tip')
			.offset(function(d){
				var this_x = 0;
				if(sort_mode == 1)
					this_x = date_x_list[d['id']];
				else if(sort_mode == 2)
					this_x = money_x_list[d['id']];
				else if(sort_mode == 3)
					this_x = class_x_list[d['id']];
				else
					this_x = reason_class_x_list[d['id']];


				if(this_x + $(".d3-tip").width() + 250 > $(window).width())
					return [200,-30];
				else
					return [200,10]; 
			})
			.direction(function(d){
				var this_x = 0;
				if(sort_mode == 1)
					this_x = date_x_list[d['id']];
				else if(sort_mode == 2)
					this_x = money_x_list[d['id']];
				else if(sort_mode == 3)
					this_x = class_x_list[d['id']];
				else
					this_x = reason_class_x_list[d['id']];


				if(this_x + $(".d3-tip").width() + 250 > $(window).width())
					return 'w';
				else
					return 'e'; 
			})
			.html(function(d) { 
				var tip_html = "<div class = 'tip-little-title'>主管機關</div><div class = 'tip-text'><span class = 'tip-org-" + org2Num(d.org) + "'>●</span>" + d.detail_org + "</div><div class = 'tip-little-title'>事件原因</div><div class = 'tip-text'>" + d.event_class + "</div><div class = 'tip-little-title'>死傷狀況</div><div class = 'tip-text'>"+ d['status'] +"</div><div class = 'tip-little-title'>撥款日期</div><div class = 'tip-text'>" + d.date + "</div><div class = 'tip-little-title'>賠償金額</div><div class = 'tip-text' id = 'tip-text-money'>" + modNum(d.money) + "</div><br><div class = 'tip-little-title'>案情摘要</div><div class = 'tip-text' id = 'tip-text-detail'>" + d.event_detail + "</div>";
				return tip_html;
			});
	

	svg.call(tip);

	svg.selectAll("circle").data(data).enter()
		.append('circle')
		.attr('class', function(d){return 'org-' + org2Num(d.org)})
		.attr({
			'id': function(d){
				return "circle-id-" + d['id'];
			},
			'cx': function(d){
				var now_x = x;
				x = x + x_dis;
				if(x > 1000){
					x = x_init;
				}
				date_x_list[d['id']] = now_x;
				return now_x;
			},

			'cy': function(d){
				y_count = y_count + 1;
				if(y_count > row_contain){
					y_count = 1;
					y = y + y_dis;
				}
				date_y_list[d['id']] = y;
				return y;
			},

			'r': function(d){
				return rScale(Math.sqrt(parseInt(d.money)));
			}
		})
		.style({
			'opacity': function(d){
				if(d.status == "受傷或受有損害")
					return 0.3;
			},

			'stroke': function(d){
				/*if(d.status == "受傷或受有損害")
					return "white";*/
			},

			'stroke-width': function(d){
				/*if(d.status == "受傷或受有損害")
					return "2px";*/
			}
		})
		.on("mouseover", function(d){
			// console.log(d.date);
			tip.show(d);

		})
		.on("mouseout", function(d){
			tip.hide(d);
		});		

		// console.log(date_x_list);
		// console.log(date_y_list);

		data_money.sort(function(a,b){return parseInt(b['money']) - parseInt(a['money']) });

		// console.log(data_money);

		for (var i = 1; i <= data.length; i++){
			var money_x = 0;
			var money_y = 0;

			if(i%row_contain != 0){
				money_x = x_init + ((i%row_contain) - 1)*x_dis;
				money_y = y_init + Math.floor(i/row_contain) * y_dis;
			}
			else{
				money_x = x_init + (row_contain - 1)*x_dis;
				money_y = y_init + (Math.floor(i/row_contain) - 1) * y_dis;
			}

			money_x_list[data_money[i-1]['id']] = money_x;
			money_y_list[data_money[i-1]['id']] = money_y;

			class_list[data[i - 1]['org']].push(data[i - 1]);
			reason_class_list[data[i - 1]['event_class']].push(data[i - 1]);
		}

		// console.log(money_x_list);
		// console.log(money_y_list);
		// console.log(class_list);

		var y_now = y_init;

		for (var i = 0; i < Object.keys(class_list).length; i ++){

			// console.log(class_list[org_list[i]]);

			for (var j = 0; j < class_list[org_list[i]].length; j++){
				var class_x = 0;
				var class_y = 0;

				if(class_count%row_contain != 0){
					class_x = x_init + ((class_count%row_contain) - 1)*x_dis;
					class_y = y_now + Math.floor(class_count/row_contain) * y_dis;
				}
				else{
					class_x = x_init + (row_contain - 1)*x_dis;
					class_y = y_now + (Math.floor(class_count/row_contain) - 1) * y_dis;
				}

				// console.log(class_list[org_list[i]][j]);

				class_x_list[class_list[org_list[i]][j]['id']] = class_x;
				class_y_list[class_list[org_list[i]][j]['id']] = class_y;

				class_count = class_count+1;

				/*if(j == class_list[org_list[i]].length - 1)
					y_now = class_y + y_dis;*/
			}

			// class_count = 1;
		}

		// console.log(class_x_list);
		// console.log(class_y_list);
		reason_text_y_list[0] = y_init;
		y_now = y_init + y_dis;

		for (var i = 0; i < Object.keys(reason_class_list).length; i++){
			for (var j = 0; j < reason_class_list[reason_list[i]].length; j++){
				var reason_class_x = 0;
				var reason_class_y = 0;

				if(reason_class_count%row_contain != 0){
					reason_class_x = x_init + ((reason_class_count%row_contain) - 1)*x_dis;
					reason_class_y = y_now + Math.floor(reason_class_count/row_contain) * y_dis;
				}
				else{
					reason_class_x = x_init + (row_contain - 1)*x_dis;
					reason_class_y = y_now + (Math.floor(reason_class_count/row_contain) - 1) * y_dis;
				}

				reason_class_x_list[reason_class_list[reason_list[i]][j]['id']] = reason_class_x;
				reason_class_y_list[reason_class_list[reason_list[i]][j]['id']] = reason_class_y;

				reason_class_count = reason_class_count + 1;

				if(j == reason_class_list[reason_list[i]].length - 1){
					if(i < Object.keys(reason_class_list).length - 1)
						reason_text_y_list[i + 1] = reason_class_y + y_dis + 30;
					y_now = reason_class_y + y_dis*2;
				}
			}

			reason_class_count = 1;

		}

		for (var i = 0; i < reason_list.length; i++){
			svg.append("text").text(reason_list[i])
			.attr({
				'class': "reason-text",
				'x': 30,
				'y': reason_text_y_list[i],
				'fill': "#ededed"
			});
		}
});

$("#sort-by-date").click(function(){
	if(sort_mode == 4){
		$("svg").attr("height", 1800);
		$("text").fadeOut(1000);
	}

	$("#sort-by-" + sort_btn_list[sort_mode - 1]).css("border-bottom", "none");

	sort_mode = 1;
	$("#sort-by-" + sort_btn_list[sort_mode - 1]).css("border-bottom", "2px solid #ededed");

	for(var i = 1; i <= date_x_list.length; i++){
		d3.select('#circle-id-' + i)
		.transition().duration(1000)
		.attr({
			'cx': date_x_list[i],
			'cy': date_y_list[i]
		});
	}
	
});

$("#sort-by-money").click(function(){
	if(sort_mode == 4){
		$("svg").attr("height", 1800);
		$("text").fadeOut(1000);
	}

	$("#sort-by-" + sort_btn_list[sort_mode - 1]).css("border-bottom", "none");

	sort_mode = 2;
	$("#sort-by-" + sort_btn_list[sort_mode - 1]).css("border-bottom", "2px solid #ededed");

	for(var i = 1; i <= money_x_list.length; i++){
		d3.select('#circle-id-' + i)
		.transition().duration(1000)
		.attr({
			'cx': money_x_list[i],
			'cy': money_y_list[i]
		});
	}
});

$("#sort-by-class").click(function(){
	if(sort_mode == 4){
		$("svg").attr("height", 1800);
		$("text").fadeOut(1000);
	}

	$("#sort-by-" + sort_btn_list[sort_mode - 1]).css("border-bottom", "none");

	sort_mode = 3;
	$("#sort-by-" + sort_btn_list[sort_mode - 1]).css("border-bottom", "2px solid #ededed");
	
	for(var i = 1; i <= class_x_list.length; i++){
		d3.select('#circle-id-' + i)
		.transition().duration(1000)
		.attr({
			'cx': class_x_list[i],
			'cy': class_y_list[i]
		});
	}
});

$("#sort-by-reason").click(function(){
	$("svg").attr("height", 2450);
	$("text").fadeIn(1000);

	$("#sort-by-" + sort_btn_list[sort_mode - 1]).css("border-bottom", "none");

	sort_mode = 4;
	$("#sort-by-" + sort_btn_list[sort_mode - 1]).css("border-bottom", "2px solid #ededed");

	for(var i = 1; i <= class_x_list.length; i++){
		d3.select('#circle-id-' + i)
		.transition().duration(1000)
		.attr({
			'cx': reason_class_x_list[i],
			'cy': reason_class_y_list[i]
		});
	}
});



function org2Num(str){
	switch(str){
		case "交通部":
			return 0;
		case "國防部":
			return 1;
		case "財政部":
			return 2;
		case "經濟部":
			return 3;
		case "法務部":
			return 4;
		case "教育部":
			return 5;
		case "內政部":
			return 6;
		case "行政院海巡署":
			return 7;
		case "司法院":
			return 8;
		case "行政院農委會":
			return 9;
		case "外交部":
			return 10;
		case "銓敘部":
			return 11;
		case "考選部":
			return 12;
		case "科技部":
			return 13;
		case "衛生福利部":
			return 14;
		case "國軍退除役官兵輔導委員會":
			return 15;
		case "原住民族委員會":
			return 16;
	}
}

function modNum(str){
  var str1, str2, str3;
  var finalStr;
  if(str.length > 6){
    str1 = str.substr(str.length - 3, 3);
    str2 = str.substr(str.length - 6, 3);
    str3 = str.substr(0, str.length - 6);
    finalStr = str3 + ',' + str2 + ',' + str1;
  }
  else if (str.length > 3){
    str1 = str.substr(str.length - 3, 3);
    str2 = str.substr(0, str.length - 3);
    finalStr = str2 + ',' + str1;
  }
  else{
    finalStr = str;
  } 

  return finalStr; 
}