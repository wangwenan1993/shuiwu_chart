/**
 * Created by Administrator on 2017/6/12.
 */
var variable_name_map = {
    /** 鼓风机相关变量*/
    "AI0": "东好氧区DO",
    "AI1": "东好氧区OPR",
    "AI8": "西好氧区DO",
    "AI9": "西好氧区OPR",
    "AI17": "1#鼓风机电流",
    "AI18": "1#鼓风机频率",
    "AI20": "2#鼓风机电流",
    "AI21": "2#鼓风机频率",
    "AI23": "3#鼓风机电流",
    "AI24": "3#鼓风机频率",
    "AI26": "4#鼓风机电流",
    "AI27": "4#鼓风机频率",
    "AI29": "5#鼓风机电流",
    "AI30": "5#鼓风机频率",

    /** 污泥回流相关 除磷*/
    "AI2": "东好氧区MLSS",
    "AI10": "西好氧区MLSS",
    "AI32": "中间泵房液位",

    /** 混合液回流 除氮 */


    /** 打药量相关 */
    "AI56": "加药实时流量",
    "AI57": "出厂水流量",
    "AI59": "出口COD",
    "AI60": "出口氨氮",
    "AI61": "出口PH",
    "AI62": "出口总磷",
    "AI63": "出口总氮",

    "AI49": "进厂水流量",
    "AI35": "进水COD",
    "AI36": "进水氨氮",
    "AI37": "进水PH"
}

var default_chart_color = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];

var base_query_url = "http://222.132.88.146:8081/sensor/query";
var deviceId = "93D7E45C809B1D3E9C30426AD94D8FFC"
var time_sort = "desc"
var data_size = 20;

//Result1=[{name:XXX,value:XXX},{name:XXX,value:XXX}, ...]
//Result2=[{name:XXX,group:XXX,value:XXX},{name:XXX,group:XXX,value:XXX}, ...]
var chartDataFormate = {

    formateNoGroupData: function (data) {//data的格式如上的Result1，这种格式的数据，多用于饼图、单一的柱形图的数据源
        var categories = [];
        var datas = [];
        for (var i = 0; i < data.length; i++) {
            categories.push(data[i].name || "");
            datas.push({name: data[i].name, value: data[i].value || 0});
        }
        return {category: categories, data: datas};
    },

    formateGroupData: function (data, type, is_stack, _markline) {//data的格式如上的Result2，type为要渲染的图表类型：可以为line，bar，is_stack表示为是否是堆积图，这种格式的数据多用于展示多条折线图、分组的柱图
        var chart_type = 'line';
        if (type)
            chart_type = type || 'line';
        var xAxis = [];
        var group = [];
        var series = [];
        for (var i = 0; i < data.length; i++) {
            if (!this.contains(data[i]["name"], xAxis))
                xAxis.push(data[i]["name"]);
            if (!this.contains(data[i]["group"], group))
                group.push(data[i]["group"]);
        }

        for (var i = 0; i < group.length; i++) {
            var temp = [];
            for (var j = 0; j < data.length; j++) {
                if (group[i] == data[j].group) {
                    if (type == "map")
                        temp.push({name: data[j].name, value: data[i].value});
                    else
                        temp.push(data[j].value);

                }
            }
            switch (type) {
                case 'bar':
                    var series_temp = {name: group[i], data: temp, type: chart_type};
                    if (is_stack)
                        series_temp = $.extend({}, {stack: 'stack'}, series_temp);
                    break;
                case 'map':
                    var series_temp = {
                        name: group[i], type: chart_type, mapType: 'china', selectedMode: 'single',
                        itemStyle: {
                            normal: {label: {show: true}},
                            emphasis: {label: {show: true}}
                        },
                        data: temp
                    };
                    break;
                case 'line':
                    var series_temp = {name: group[i], data: temp, type: chart_type};
                    if (is_stack)
                        series_temp = $.extend({}, {stack: 'stack'}, series_temp);
                    break;
                default:
                    var series_temp = {name: group[i], data: temp, type: chart_type};
            }
            series.push(series_temp);
        }
        if(_markline && _markline.length > 0) {
            //var mark_data = [];
            //for(var i = 0; i < parseInt(data.length/group.length); i++) {
            //    mark_data.push(_markline);
            //}
            //group.push('临界值');
            //var series_temp = {name: '临界值', data: mark_data, type: 'line', markLine: {data: [{type: 'average', name: '平均值'}]}};
            //series.push(series_temp);
            var m_data = [];
            for(var j = 0; j < _markline.length; j++) {
                if(_markline[j] > 0) {
                    var tmp = {
                        yAxis: _markline[j],
                        name: '临界值' + j
                    };
                    m_data.push(tmp);
                }
            }
            var mark_line = {
                markLine: {
                    data: m_data
                }
            };
            var v_pieces = [];
            if(_markline[0] > 0) {
                v_pieces.push({
                    lt: _markline[0],
                    color: '#F00',
                    label: '<' + _markline[0] + '：指标不合格'
                });
                v_pieces.push({
                    gte: _markline[0],
                    lte: _markline[1],
                    //color: default_chart_color[Math.ceil((11*Math.random()) - 1)]
                });
                v_pieces.push({
                    gt: _markline[1],
                    color: '#F00',
                    label: '>' + _markline[1] + '：指标不合格'
                });
            }
            else {
                v_pieces.push({
                    lte: _markline[1]
                    //color: default_chart_color[Math.ceil((11*Math.random()) - 1)]
                });
                v_pieces.push({
                    gt: _markline[1],
                    color: '#F00',
                    label: '>' + _markline[1] + '：指标不合格'
                });
            }
            var visual_Map =  {
                show: true,
                top: 10,
                right: 10,
                type: 'piecewise',
                pieces: [{
                    lt: _markline[0],
                    color: '#F00',
                    label: '<' + _markline[0] + '：指标不合格'
                },{
                    gte: _markline[0],
                    lte: _markline[1],
                    label: _markline[0] + " - " + _markline[1],
                    color: "#003bb3"
                    //color: default_chart_color[Math.ceil((11*Math.random()) - 1)]
                }, {
                    gt: _markline[1],
                    color: '#F00',
                    label: '>' + _markline[1] + '：指标不合格'
                }],
                outOfRange: {
                    color: '#999'
                }
            };

            series[0] = $.extend({}, series[0], mark_line);
            return {category: group, xAxis: xAxis, _visualMap: visual_Map, series: series};
        }
        else {
            return {category: group, xAxis: xAxis, series: series};
        }

    },

    formateMixData: function (data, type, y_unit, _markline) {//data的格式如上的Result2，type为要渲染的图表类型：可以为line，bar，is_stack表示为是否是堆积图，这种格式的数据多用于展示多条折线图、分组的柱图
        var chart_type = 'line';
        var xAxis = [];
        var yAxis = [];
        var group = [];
        var series = [];
        for (var i = 0; i < data.length; i++) {
            if (!this.contains(data[i]["name"], xAxis))
                xAxis.push(data[i]["name"]);
            if (!this.contains(data[i]["group"], group))
                group.push(data[i]["group"]);
        }

        for (var i = 0; i < group.length; i++) {
            var temp = [];
            var y_tmp = {
                name: y_unit[i] || '',
                type: 'value',
                splitArea: { show: true }
            }
            yAxis.push(y_tmp);
            for (var j = 0; j < data.length; j++) {
                if (group[i] == data[j].group) {
                    temp.push(data[j].value);
                }
            }
            var series_temp = {name: group[i], xAxisIndex: 0, yAxisIndex: i, data: temp, type: type[i]};
            series.push(series_temp);
        }
        for(var i = 0; _markline && i < _markline.length; i++) {
            var mark_line = {
                markLine: {
                    data: [{
                        yAxis: _markline[i],
                        name: '临界值'
                    }]
                }
            };
            series[i] = $.extend({}, series[i], mark_line);
        }
        return {category: group, xAxis: xAxis, yAxis: yAxis, series: series};
    },

    contains: function (obj, coll) {
        for(var index in coll) {
            if(obj === coll[index]) {
                return true;
            }
        }
        return false;
    }
}

var chartOptionTemplates = {
    commonOption: {//通用的图表基本配置
        tooltip: {
            trigger: 'item'//tooltip触发方式:axis以X轴线触发,item以每一个数据项触发
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
    },
    commonLineOption: {//通用的折线图表的基本配置
        backgroundColor: "#d3d3d3",
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            top: 75,
            right:10,
            orient: 'vertical',
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: { readOnly: false }, //数据预览
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: [
            {
                show: false,
                type: 'slider',
                xAxisIndex: 0
            },
            {
                show: false,
                type: 'inside',
                xAxisIndex: 0
            },
            {
                show: false,
                type: 'slider',
                yAxisIndex: 0
            },
            {
                show: false,
                type: 'inside',
                yAxisIndex: 0
            }
        ],
    },

    pie: function (data, name) {//data:数据格式：{name：xxx,value:xxx}...
        var pie_datas = chartDataFormate.formateNoGroupData(data);
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}/%)',
                show: true
            },
            legend: {
                top: 25,
                orient: 'vertical',
                x: 'left',
                data: name
            },
            series: [
                {
                    name: name || "",
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    data: pie_datas.data
                }
            ]
        };
        return $.extend({}, chartOptionTemplates.commonOption, option);
    },

    lines: function (title, data, name, is_stack, _markline) { //data:数据格式：{name：xxx,group:xxx,value:xxx}...
        var stackline_datas = chartDataFormate.formateGroupData(data, 'line', is_stack, _markline);
        var option = {
            title: {
                text: title
            },
            legend: {
                top: 25,
                data: stackline_datas.category
            },
            xAxis: [{
                type: 'category', //X轴均为category，Y轴均为value
                data: stackline_datas.xAxis,
                boundaryGap: false,//数值轴两端的空白策略
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    rotate: 0,
                    margin: 8
                }
            }],
            yAxis: [{
                name: name || '',
                type: 'value',
                splitArea: { show: true }
            }],
            series: stackline_datas.series
        };
        if(stackline_datas._visualMap) {
            return $.extend({}, chartOptionTemplates.commonLineOption, {visualMap: stackline_datas._visualMap}, option);
        }
        else {
            return $.extend({}, chartOptionTemplates.commonLineOption, option);
        }
    },

    bars: function (title, data, name, is_stack, _markline) {//data:数据格式：{name：xxx,group:xxx,value:xxx}...
        var bars_dates = chartDataFormate.formateGroupData(data, 'bar', is_stack, _markline);
        var option = {
            title: {
                text: title
            },
            legend: {
                top: 25,
                data: bars_dates.category
            },
            xAxis: [{
                type: 'category',
                data: bars_dates.xAxis,
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    rotate: 0,
                    margin: 8
                }

            }],
            yAxis: [{
                type: 'value',
                name: name || '',
                splitArea: { show: true }
            }],
            series: bars_dates.series
        };
        if(bars_dates._visualMap) {
            return $.extend({}, chartOptionTemplates.commonLineOption, {visualMap: bars_dates._visualMap}, option);
        }
        else {
            return $.extend({}, chartOptionTemplates.commonLineOption, option);
        }
    },
    //其他的图表配置，如柱图+折线
    /**
     * generate mix(line line , bar bar, bar line) chart(which hava different yAxis) option
     * @param title: chart title text
     * @param data: [{name: time, value:..., group: meaning of variable}, {...}] data of xAxis and series
     * @param l_type: [] charts type
     * @param l_name: [] chart yAxis name
     * @param _markline: [] markLine
     */
    mix: function(title, data, l_type, l_name, _markline) {
        var mix_datas = chartDataFormate.formateMixData(data, l_type, l_name, _markline);
        var option = {
            title: {
                text: title,
            },
            legend: {
                top: 25,
                data: mix_datas.category
            },
            xAxis: [{
                type: 'category', //X轴均为category，Y轴均为value
                data: mix_datas.xAxis,
                boundaryGap: false,//数值轴两端的空白策略
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    rotate: 0,
                    margin: 8
                }
            }],
            yAxis: mix_datas.yAxis,
            series: mix_datas.series
        };
        return $.extend({}, chartOptionTemplates.commonLineOption, option);
    }
}

var ChartDataProcess = {
    /**
     * parameters:
     *  total_data：[{data: [AI0: ... ,AI1: ...]},{data: [...]}] data from server database
     *  variables: [variable1, variable1, ...], variables want to display in chart
     *  smooth_data: whether if handwork smooth variable data, false: para 'divisor' and 'formater_num' should not give
     *  divisor: is useful when smooth_data is true, variable.value / divisor
     *  formater_num: is useful when smooth_data is true, mean keep #num of digit after decimal point.
     * return:
     *  []: [{name: time, value:..., group: meaning of variable}, {...}]
     */
    extractVariables: function (total_data, variables, smooth_data, divisor, formater_num) {
        var result = [];
        var now = new Date();
        for(var index in total_data) {
            //console.log(index, total_data[index].data);
            var date_preffix = echarts.format.formatTime('yyyy-MM-dd', now);
            var x_time = date_preffix + "\n" + now.toLocaleTimeString().replace(/^\D*/,'');
            now = new Date(now - 5000);
            for(var i in variables) {
                var v = variables[i];
                var tmp = {};
                tmp["name"] = x_time;
                tmp["value"] = total_data[index].data[v];
                tmp["group"] = variable_name_map[v];
                result.unshift(tmp);
            }
        }
        if(smooth_data) {
            return this.smoothData(result, divisor, formater_num);
        }
        return result;
    },

    smoothData: function(result, divisor, formater_num) {
        var _result = [];
        var scale = 0.03;
        for (var i = 0; i < result.length; i++) {
            _result.push(result[i]);
            var _tmp = result[i].value / divisor;
            _tmp = _tmp + _tmp * scale * (Math.ceil(Math.random() * 5) - 3);
            _result[i].value = _tmp.toFixed(formater_num);
        }
        return _result;
    },

    calDataScale: function (data1, data2, label) {
        var result = [];
        for(var i in data1) {
            result.push(data1[i]);
            result[i].value = (data1[i].value / data2[i].value).toFixed(2);
            result[i].group = label;
        }
        return result;
    }
}

var ChartInit = {
    addChartLoading:　function(charts) {
        for(var i = 0; i < charts.length; i++) {
            charts[i].showLoading();
        }
    },
    hideChartLoading: function(charts) {
        for(var i = 0; i < charts.length; i++) {
            charts[i].hideLoading();
        }
    },
    init: function(charts) {
        this.addChartLoading(charts);
    }
}



