var data_money;
var sort_mode = 1;

var row_contain = 30;

var x_dis = 1000/row_contain;
var y_dis = 50;
var x_init = x_dis + 25;
var y_init = 50;
var x = x_init;
var y = y_init;
var y_count = 0;

var svg_height = 750;
var svg_height_reason = 1350;

var debate_img_focused = 1;

var org_list = ['交通部', '國防部', '財政部', '經濟部', '法務部', '教育部', '內政部', '行政院海巡署', '司法院', '行政院農委會', '外交部', '銓敘部', '考選部', '科技部', '衛生福利部', '國軍退除役官兵輔導委員會', '原住民族委員會'];
var reason_list = ['道路意外', '天災', '軍訓事故', '行政疏失', '校園管教不當', '工程意外'];
var sort_btn_list = ['date', 'money', 'class', 'reason'];
var reson_littletext_event = ['191', '51', '53', '82', '7', '5'];
var reson_littletext_money = ['2.24億', '2.24億', '1.45億', '6687萬', '1470萬', '998萬'];
var color_list = ['#276fff','#a8ff00','#1FA05F','#5CE0FF','#EB75FF','#ED8700','#6EFFD1','#31A7FF','#FF709B','#AF3E81','#FCBD3F','#BFFF75','#6AA024','#8159C1','#EF5233','#931A11','#1873AA'];
var scroll_ID_list = ['sort-btn-block', 'debate-cases', 'last-highcharts', 'government-people'];

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

/*var rScale;
var rScale_linear;
var rScale_logarithm;
var all_rValue_list = [];
var scale_now = 1;*/

//-----------------------------------------------------------------------------------------//
for(var i = 0; i < org_list.length; i++)
	class_list[org_list[i]] = [];

for(var i = 0; i < reason_list.length; i++)
	reason_class_list[reason_list[i]] = [];

(function (H) {
    function deferRender (proceed) {
        var series = this, 
            $renderTo = $(this.chart.container.parentNode);
     
        // It is appeared, render it
        if ($renderTo.is(':appeared')) {
            proceed.call(series);
            
        // It is not appeared, halt renering until appear
        } else  {
            $renderTo.appear(); // Initialize appear plugin
            $renderTo.on('appear', function () {
                proceed.call(series);
            });
        }
    };
    
    H.wrap(H.Series.prototype, 'render', deferRender);
    
}(Highcharts));

$(document).ready(function(){

	d3.csv("data/events_and_money.csv",function(data_event_money){
		for ( var i = 0; i < data_event_money.length; i++ ){
			var temp_event = {};
			var temp_money = {};

			temp_event['name'] = data_event_money[i]['org'];
			temp_event['data'] = [];
			temp_event['data'].push(parseInt(data_event_money[i]['events']));
			temp_event['color'] = color_list[org2Num(data_event_money[i]['org'])];
			all_org_event.push(temp_event);

			temp_money['name'] = data_event_money[i]['org'];
			temp_money['data'] = [];
			temp_money['data'].push(parseInt(data_event_money[i]['money']));
			temp_money['color'] = color_list[org2Num(data_event_money[i]['org'])];

			all_org_money.push(temp_money);
			
		}

		all_org_money.sort(function(a,b) {return b['data'][0] - a['data'][0]});
		all_org_event.sort(function(a,b) {return b['data'][0] - a['data'][0]});
		// console.log(all_org_money);

		$(function () { 
			Highcharts.setOptions({
				chart: {
		            style: {
		                fontFamily: '微軟正黑體'
		                // color: '#ededed'
		            }
		        }
		        // colors: []
		    });

		     $('#all-event-chart').highcharts({
		        chart: {
		            type: 'bar',
		            backgroundColor: '#111111'
		        },
		        title: {
		            text: '各中央機關10年國賠件數',
		            style:{
		            	color: '#ededed'
		            }
		        },
		        credits:{
		        	enabled: false
		        },
		       
		        xAxis: {
		            type: 'category',
		            labels: {
		                rotation: 0,
		                style: {
		                    fontSize: '10px',
		                    fontFamily: '微軟正黑體',
		                    color:'#ededed'
		                }
		            }
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: '件',
		                style: {
		                	color: '#ededed'
		                }
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        tooltip: {
		            pointFormat: ' <b>{point.y:.0f} </b>件'
		        },
		        series: [{
		            color:'#CC9900',          
		            
		           /* name: 'Population',*/
		            data: [
		                ['交通部', 193],
		                ['國防部', 80],
		                ['財政部', 19],
		                ['法務部', 18],
		                ['教育部', 18],
		                ['經濟部', 17],
		                ['內政部', 13],
		                ['行政院海巡署', 11],
		                ['司法院', 9],
		                ['行政院農委會', 4],
		                ['科技部', 1],
		                ['原住民委員會', 1],
		                ['衛生福利部', 1],
		                ['外交部', 1],
		                ['考選部', 1],
		                ['銓敘部', 1],
		                ['國軍退除役官兵輔導委員會', 1]
		             
		            ],
		            dataLabels: {
		                enabled: true,
		                rotation: 0,
		                color: '#FFFFFF',
		                align: 'right',
		                format: '{point.y:.0f}', // one decimal
		                y: 0, // 10 pixels down from the top
		                style: {
		                    fontSize: '10px',
		                    fontFamily: '微軟正黑體'
		                }
		            }
		        }]
		    });

			$('#all-money-chart').highcharts({
		        chart: {
		            type: 'bar',
		            backgroundColor: '#111111'
		        },
		        title: {
		            text: '各中央機關10年國賠金額',
		            style:{
		            	color: '#ededed'
		            }
		        },
		        credits:{
		        	enabled: false
		        },
		        xAxis: {
		            type: 'category',
		            labels: {
		                rotation: 0,
		                style: {
		                    fontSize: '10px',
		                    fontFamily: '微軟正黑體',
		                    color:'#ededed'
		                }
		            }
		        },
		        yAxis: {
		            // min: 0,
		            title: {
		                text: '元',
		                style: {
		                	color: '#ededed'
		                },
		            },
		            type: 'logarithmic',
		            tickInterval: 1
		        },
		        legend: {
		            enabled: false
		        },
		        tooltip: {
		            pointFormat: ' <b>{point.y:.0f} </b>元'
		        },
		        series: [{
		            color:'#CC9900',          
		            
		           /* name: 'Population',*/
		            data: [
		                ['交通部', 389053740],
		                ['國防部', 189735448],
		                ['教育部', 21533721],
		                ['法務部', 19751182],
		                ['經濟部', 18351640],
		                ['行政院海巡署', 13956241],
		                ['財政部', 12971767],
		                ['內政部', 10158334],
		                ['司法院',4161554],
		                ['行政院農委會',2252801],
		                ['國軍退除役官兵輔導委員會', 1269934],
		                ['科技部', 1184266],
		                ['衛生福利部', 1167835],
		                ['原住民委員會', 424598],
		                ['銓敘部', 120000],
		                ['外交部', 20000],
		                ['考選部', 9000]
		               
		                
		             
		            ],
		            dataLabels: {
		                enabled: true,
		                rotation: 0,
		                color: '#FFFFFF',
		                align: 'right',
		                format: '{point.y:,.0f}', // one decimal
		                y: 0, // 10 pixels down from the top
		                style: {
		                    fontSize: '10px',
		                    fontFamily: '微軟正黑體'
		                }
		            }
		        }]
		    });

		    /*$('#all-event-chart').highcharts({
		        chart: {
		        	backgroundColor: '#111111',
		            type: 'column'
		        },
		        credits:{
		        	enabled: false
		        },
		        title: {
		            text: '各中央機關10年國賠件數',
		            style:{
		            	color: '#ededed'
		            }
		        },
		        xAxis: {
		            categories: ['各中央機關']
		        },
		        yAxis: {
		            title: {
		                text: '件',
		                style: {
		                	color: '#ededed'
		                },
		                rotation: 0
		            },
		            type: 'linear',
		            max: 200
		        },
		        series: all_org_event,
		        legend:{
		        	itemStyle:{
		        		color: '#ededed'
		        	},
		            itemHoverStyle: {
		                color: '#ededed'
		            },
		            itemMarginTop: 10
		        },
		         plotOptions: {
		            series: {
		                groupPadding: 0,
		                borderWidth: 0
		            }
		        }

		    });

		    $('#all-money-chart').highcharts({
		        chart: {
		        	backgroundColor: '#111111',
		            type: 'column'
		        },
		        credits:{
		        	enabled: false
		        },
		        title: {
		            text: '各中央機關10年國賠金額',
		            style:{
		            	color: '#ededed'
		            }
		        },
		        xAxis: {
		            categories: ['各中央機關']
		        },
		        yAxis: {
		            title: {
		                text: '元',
		                style: {
		                	color: '#ededed'
		                },
		                rotation: 0
		            },
		            type: 'logarithmic',
		            tickInterval: 1
		        },
		        series: all_org_money,
		        legend:{
		        	itemStyle:{
		        		color: '#ededed'
		        	},
		            itemHoverStyle: {
		                color: '#ededed'
		            },
		            itemMarginTop: 10
		        },
		         plotOptions: {
		            series: {
		                groupPadding: 0,
		                borderWidth: 0
		            }
		        }
		    });*/
		});

		$('#all-event-statistic').highcharts({
            chart: {
                backgroundColor: '#111111',
                plotBorderWidth: null,
                plotShadow: false
            },
            credits:{
		       	enabled: false
		    },
            title: {
                text: '',
		        style:{
		        	color: '#ededed'
		        }
            },
            tooltip: {
                pointFormat: '{point.y}件<br>{point.percentage:.1f}%</br>'
            },
            plotOptions: {
                pie: {
                    // allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
	                    format: '<b>{point.name}</b> {point.y} 件',
	                    style: {
	                        color: '#ededed',
	                        fontSize: '17px'
	                    }
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                // name: '',
                data: [
                    ['賠償件數',  721],
                    ['未賠償件數', 10205]
                ]
            }],
            legend:{
            	itemStyle:{
		           	'color':'#ededed'
		        },
		        itemHoverStyle: {
		            color: '#ededed'
		        }
            }
        });

		$('#government-people-compensate').highcharts({
	        chart: {
	            type: 'column',
	            backgroundColor: '#111111',
	        },
	        credits:{
		       	enabled: false
		    },
	        title: {
	            text: '向公務員求償比率',
	            style:{
		        	color: '#ededed'
		        }
	        },
	       
	        xAxis: {
	            type: 'category',
	            labels: {
	                rotation: 0,
	                style: {
	                    fontSize: '10px',
	                    fontFamily: '微軟正黑體'
	                   
	                }
	            }
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: '%'
	            }
	        },
	        legend: {
	            enabled: false
	        },
	        tooltip: {
	            pointFormat: '<b>{point.y:.2f}</b>%'
	        },
	        series: [{
	            name: 'Population',
	            color:'#CC9900',
	            data: [
	                ['民國97年', 7.19],
	                ['民國98年', 1.65],
	                ['民國99年', 0.83],
	                           ],
	            dataLabels: {
	                enabled: false,
	                rotation: -90,
	                color: '#FFFFFF',
	                align: 'right',
	                format: '{point.y:.1f}', // one decimal
	                y: 10, // 10 pixels down from the top
	                style: {
	                    fontSize: '13px',
	                    fontFamily: 'Verdana, sans-serif'
	                }
	            }
	        }]
	    });

		/*$(function () {
		    $('#all-event-statistic').highcharts({
		        chart: {
		            type: 'bar',
		            backgroundColor: '#111111'
		        },
		        credits:{
		        	enabled: false
		        },
		        title: {
		            text: '全國與中央機關歷年國賠情形',
		            style:{
		            	color: '#ededed'
		            }
		        },
		        xAxis: {
		            categories: ['全國', '中央機關']
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: '件',
		                style:{
		                	'color': "#ededed"
		                }
		            },
		            gridLineWidth: 0
		        },
		        legend: {
		            reversed: true,
		            itemStyle:{
		            	'color':'#ededed'
		            },
		            itemHoverStyle: {
		                color: '#ededed'
		            }
		        },
		        plotOptions: {
		            series: {
		                stacking: 'normal',
		                borderWidth: 0
		            }
		        },
		        series: [{
		            name: '賠償件數',
		            color: '#80ABE8',
		            data: [5618, 721]
		        }, {
		            name: '受理件數',
		            color: '#80E8B1',
		            data: [40845, 10926]
		        }],
		        labels: {
		        	items: [{
		        		html: '<div>成功比率</div><div>14%</div>',
		        		style:{
		        			left: '280px',
		        			top: '140px'
		        		}
		        	},
		        	{
		        		html: '<div>成功比率</div><div>7%</div>',
		        		style:{
		        			left: '140px',
		        			top: '210px'
		        		}
		        	}],
		        	style: {
		        		color: '#ededed',
		        		'font-size': '25px'
		        	}
		        }
		    });*/

		    /*$('#all-event-statistic-yr').highcharts({
		    	chart: {
		    		backgroundColor: '#111111'
		    	},
		    	credits:{
		        	enabled: false
		        },
		        title: {
		            text: '民國71~103年國賠受理件數與賠償件數',
		            style:{
		            	color: '#ededed'
		            }
		        },*/
		       /* subtitle: {
		            text: 'Source: WorldClimate.com',
		            x: -20
		        },*/
		        /*xAxis: {
		            categories: ['71', '72', '73', '74', '75', '76','77', '78', '79', '80', '81', '82','83', '84', '85', '86', '87', '88', '89', '90','91', '92', '93','94', '95', '96','97', '98', '99','100', '101', '102','103']
		        },
		        yAxis: {
		            title: {
		                text: '件',
		                style: {
		                	color: '#ededed'
		                },
		                rotation: 0
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }],
		            gridLineWidth: 0
		        },
		        tooltip: {
		            valueSuffix: '件'
		        },
		        legend: {
		            borderWidth: 0,
		            itemStyle:{
		            	color: '#ededed'
		            },
		            itemHoverStyle: {
		                color: '#ededed'
		            }
		        },
		        series: [{
		            color:'#9B5C32',
		            name: '全國新收案件數',
		            data: [405,324,455,382,366,345,430,528,457,464,667,687,912,881,1068,1242,1128,1305,2012,1728,1206,1883,2002,1794,1419,2344,1990,1886,2469,1719,2220,1951,2176]
		        }, {
		            name: '全國總賠償件數',
		             color:'#228B99',
		            data: [20,33,138,45,60,76,85,137,97,118,127,130,161,173,136,117,157,124,234,192,186,234,191,258,236,214,261,264,331,280,292,259,252]
		        }, {
		            name: '中央機關新收案件數',
		            color:'#FFBD48',
		            data: [89,48,43,44,38,50,61,68,61,66,45,85,115,97,186,138,163,174,647,618,400,425,442,544,438,1193,743,700,646,639,643,601,676]
		        }, {
		            name: '中央機關總賠償件數',
		             color:'#66CFDD',
		            data: [0,2,1,1,3,0,5,12,4,13,9,11,5,6,12,4,9,5,56,69,48,31,26,51,15,36,37,43,48,77,32,23,27]
		        }]
		    });*/

		// });

	});

	d3.csv("data/compensate_merge.csv", function(data){
		/*console.log(data);
		for (var i = 0; i < data.length; i++){
			console.log(parseInt(data[i]['money']))
		}*/
		data_money = data.slice();

		var maxValue = d3.max(data, function(d){return parseInt(d.money)});
		var minValue = d3.min(data, function(d){return parseInt(d.money)});

		rScale = d3.scale.sqrt()
					.range([5, 40])
					.domain([minValue, maxValue]);

		/*rScale_linear = d3.scale.linear()
					.range([5, 50])
					.domain([minValue, maxValue]); 	

		rScale_logarithm = d3.scale.log()
					.range([5, 50])
					.domain([minValue, maxValue]);*/		

		var svg = d3.select(".main-chart").append("svg").attr({'class': 'main-svg', 'width': 1100, 'height': svg_height})	;

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
						return [200,-20];
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
					var tip_html = "<div class = 'tip-little-title'>主管機關</div><div class = 'tip-text'><span class = 'tip-org-" + org2Num(d.org) + "'>●</span>" + d.org + "</div><div class = 'tip-little-title'>賠償機關</div><div class = 'tip-text'>"+ d.detail_org + "</div><div class = 'tip-little-title'>事件原因</div><div class = 'tip-text'>" + d.event_class + "</div><div class = 'tip-little-title'>死傷狀況</div><div class = 'tip-text'>"+ d['status'] +"</div><div class = 'tip-little-title'>撥款日期</div><div class = 'tip-text'>" + d.date + "</div><div class = 'tip-little-title'>賠償金額</div><div class = 'tip-text' id = 'tip-text-money'>" + modNum(d.money) + "</div><br><div class = 'tip-little-title'>案情摘要</div><div class = 'tip-text' id = 'tip-text-detail'>" + d.event_detail + "</div>";
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
					if(x > 1050){
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
					// all_rValue_list[d['id']] = parseInt(d.money);
					return rScale(parseInt(d.money));
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
				// console.log(data[i - 1]['event_class']);
				reason_class_list[data[i - 1]['event_class']].push(data[i - 1]);

			}

			/*for(var i = 0; i < Object.keys(reason_class_list).length; i++){
				var mm = 0;
				for(var j = 0; j < reason_class_list[reason_list[i]].length; j++){
					mm += parseInt(reason_class_list[reason_list[i]][j]['money']);
				}

				console.log(mm);
			}*/
				
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
							reason_text_y_list[i + 1] = reason_class_y + y_dis + 50;
						y_now = reason_class_y + y_dis*2.5;
					}
				}

				reason_class_count = 1;

			}

			for (var i = 0; i < reason_list.length; i++){
				svg.append("text").text(reason_list[i])
				.attr({
					'class': "reason-text",
					'x': 45,
					'y': reason_text_y_list[i] - 15,
					'fill': "#ededed"
				});

				svg.append("text").text(reson_littletext_event[i] + '件')
				.attr({
					'class': "reason-text",
					'x': 45 + reason_list[i].length*40 + 30,
					'y': reason_text_y_list[i] - 15,
					'fill': "#ededed"
				});

				svg.append("text").text('賠償金額' + reson_littletext_money[i] + '元')
				.attr({
					'class': "reason-text",
					'x': 45 + reason_list[i].length*40 + 30 + reson_littletext_event[i].length*25 + 70,
					'y': reason_text_y_list[i] - 15,
					'fill': "#ededed"
				});
			}

			// console.log(all_rValue_list);
	});

	$("#sort-by-date").click(function(){
		if(sort_mode == 4){
			$(".main-svg").attr("height", svg_height);
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
			$(".main-svg").attr("height", svg_height);
			$(".reason-text").fadeOut(1000);
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
			$(".main-svg").attr("height", svg_height);
			$(".reason-text").fadeOut(1000);
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
		$(".main-svg").attr("height", svg_height_reason);
		$(".reason-text").fadeIn(1000);

		$("#sort-by-" + sort_btn_list[sort_mode - 1]).css("border-bottom", "none");

		sort_mode = 4;
		$("#sort-by-" + sort_btn_list[sort_mode - 1]).css("border-bottom", "2px solid #ededed");

		for(var i = 1; i <= reason_class_x_list.length; i++){
			d3.select('#circle-id-' + i)
			.transition().duration(1000)
			.attr({
				'cx': reason_class_x_list[i],
				'cy': reason_class_y_list[i]
			});
		}
	});

	$("div.header-nav").click(function(){
		var s = parseInt($(this).attr('id').split('-')[2]);


		$('html, body').animate({
			scrollTop: ($("#" + scroll_ID_list[s - 1]).offset().top-90)
		}, 700);	    
	});

	window.onscroll = function(e){
		
		if(pic_focus(window.scrollY+320) == debate_img_focused)
			;
		else{
			$("#debate-img-" + debate_img_focused).css("opacity", 0.3);
			debate_img_focused = pic_focus(window.scrollY+320);
			$("#debate-img-" + debate_img_focused).css("opacity", 1);
		}
		// console.log(window.scrollY+320);
		// console.log($("#debate-img-1").offset().top)
	}

	/*$(".scale-btn").click(function(){
		var s = parseInt($(this).attr('id').split('-')[2]);
		$('#scale-btn-' + scale_now).css("border-bottom", "none");
		scale_now = s;
		$('#scale-btn-' + scale_now).css("border-bottom", "2px solid #ededed");

		if(scale_now == 1){
			for (var i = 1; i <= all_rValue_list.length; i++){
				d3.select('#circle-id-' + i)
				.transition().duration(1000)
				.attr({
					'r': rScale(all_rValue_list[i]),
				});
			}
		}
		else if(scale_now == 2){
			for (var i = 1; i <= all_rValue_list.length; i++){
				d3.select('#circle-id-' + i)
				.transition().duration(1000)
				.attr({
					'r': rScale_linear(all_rValue_list[i]),
				});
			}
		}
		else{
			for (var i = 1; i <= all_rValue_list.length; i++){
				d3.select('#circle-id-' + i)
				.transition().duration(1000)
				.attr({
					'r': rScale_logarithm(all_rValue_list[i]),
				});
			}
		}
	});*/


});

function pic_focus(yy){
	
	if (yy < $("#debate-img-2").offset().top)
		return 1;
	else if (yy >= $("#debate-img-2").offset().top && yy < $("#debate-img-3").offset().top)
		return 2;
	else if (yy >= $("#debate-img-3").offset().top && yy < $("#debate-img-4").offset().top)
		return 3;
	else if (yy >= $("#debate-img-4").offset().top && yy < $("#debate-img-5").offset().top)
		return 4;
	else if (yy >= $("#debate-img-5").offset().top)
		return 5;
	
}

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