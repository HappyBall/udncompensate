var data_money;

var x_init = 50;
var y_init = 50;
var x_dis = 50;
var y_dis = 90;
var x = x_init;
var y = y_init;
var y_count = 0;

var org_list = ['交通部', '國防部', '財政部', '經濟部', '法務部', '教育部', '內政部', '行政院海巡署', '司法院', '行政院農委會', '外交部', '銓敘部', '考選部', '科技部', '衛生福利部', '國軍退除役官兵輔導委員會', '原住民族委員會'];

var date_x_list = [];
var date_y_list = [];
var money_x_list = [];
var money_y_list = [];
var class_x_list = [];
var class_y_list = [];
var class_list = {};
var class_count = 1;

//-----------------------------------------------------------------------------------------//
for(var i = 0; i < org_list.length; i++)
	class_list[org_list[i]] = [];


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

	var svg = d3.select(".main-chart").append("svg").attr({'class': 'main-svg', 'width': 1200, 'height': 2000})	;

	tip = d3.tip().attr('class', 'd3-tip')
			.offset([0,10])
			.direction(function(d){ return 'e'; })
			.html(function(d) { return d.org });

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
				if(y_count > 20){
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

			if(i%20 != 0){
				money_x = x_init + ((i%20) - 1)*x_dis;
				money_y = y_init + Math.floor(i/20) * y_dis;
			}
			else{
				money_x = x_init + 19*x_dis;
				money_y = y_init + (Math.floor(i/20) - 1) * y_dis;
			}

			money_x_list[data_money[i-1]['id']] = money_x;
			money_y_list[data_money[i-1]['id']] = money_y;

			class_list[data[i - 1]['org']].push(data[i - 1]);
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

				if(class_count%20 != 0){
					class_x = x_init + ((class_count%20) - 1)*x_dis;
					class_y = y_now + Math.floor(class_count/20) * y_dis;
				}
				else{
					class_x = x_init + 19*x_dis;
					class_y = y_now + (Math.floor(class_count/20) - 1) * y_dis;
				}

				// console.log(class_list[org_list[i]][j]);

				class_x_list[class_list[org_list[i]][j]['id']] = class_x;
				class_y_list[class_list[org_list[i]][j]['id']] = class_y;

				class_count = class_count+1;

				/*if(j == class_list[org_list[i]].length - 1)
					y_now = class_y + y_dis;
*/			}

			// class_count = 1;
		}

		console.log(class_x_list);
		console.log(class_y_list);

});

$("#sort-by-date").click(function(){
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
	for(var i = 1; i <= class_x_list.length; i++){
		d3.select('#circle-id-' + i)
		.transition().duration(1000)
		.attr({
			'cx': class_x_list[i],
			'cy': class_y_list[i]
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