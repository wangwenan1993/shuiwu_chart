/**
 * Created by Administrator on 2017/6/12.
 */

$(function(){
    var aeration = {
        $aeration_chart: null,
        $power_chart: null,
        $do_chart: null,
        $speed_chart: null,
        $opr_chart: null,
        $opts: null,
        $size: 0,
        $_context: null,

        init: function(){
            var opt = this.$opts = {}
            this.$aeration_chart = echarts.init(document.getElementById("electricity"), 'vintage', opt);
            this.$power_chart = echarts.init(document.getElementById("power"), 'vintage', opt);
            this.$do_chart = echarts.init(document.getElementById("sewage_DO"), 'vintage', opt);
            this.$speed_chart = echarts.init(document.getElementById("sewage_speed"), 'vintage', opt);
            //this.$opr_chart = echarts.init(document.getElementById("sewage_OPR"), 'vintage', opt);
            this.$size = data_size;
            this.$_context = this;
            this.getDataBySize(this.$size, this);
        },

        getDataBySize: function(size, context) {
            $.ajax({
                url: "service/loadData.php",
                type: "POST",
                data: {
                    "deviceId": deviceId,
                    "time_sort": time_sort,
                    "size": size
                },
                beforeSend: function(xhr) {
                    ChartInit.init([context.$aeration_chart, context.$power_chart, context.$do_chart, context.$speed_chart]);
                },
                success: function (result) {
                    ChartInit.hideChartLoading([context.$aeration_chart, context.$power_chart, context.$do_chart, context.$speed_chart]);
                    context.renderChart(context, result);
                },
                error: function(xhr, status, error) {
                    console.log("$$$$$$$$");
                    console.log(status);
                },
            });
            setInterval(function(){
                $.ajax({
                    url: "service/loadData.php",
                    type: "POST",
                    data: {
                        "deviceId": deviceId,
                        "time_sort": time_sort,
                        "size": size
                    },
                    // result: {total: 10,
                    //          data: [
                    //              {data: [
                    //                  AI0: ,
                    //                  AI1:
                    //              ]},
                    //              {data: []}
                    //          ]
                    //          }
                    success: function (result) {
                        context.renderChart(context, result);
                    },
                    error: function(xhr, status, error) {
                        console.log("$$$$$$$$");
                        console.log(status);
                    },
                });
            }, 5000);
        },

        renderChart: function(context, result) {
            //console.log("@@@@", result);
            var res = JSON.parse(result);
            var e_data = [];
            var option = {};

            //aeration
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI17', 'AI20', 'AI23', 'AI26', 'AI29'], true, 1, 3);
            //console.log("medicate:", JSON.stringify(e_data));
            option = chartOptionTemplates.lines('鼓风机实时电流图', e_data, "电流A", false);
            console.log(option);
            context.$aeration_chart.setOption(option);

            //frequent
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI18', 'AI21', 'AI24', 'AI27', 'AI30'], false);
            //console.log("speed:", JSON.stringify(e_data));
            option = chartOptionTemplates.bars('鼓风机当前频率图', e_data, "Hz", false);
            console.log(option);
            context.$power_chart.setOption(option);

            //DO
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI8', 'AI0'], true, 1, 3);
            //console.log("PH:", JSON.stringify(e_data));
            option = chartOptionTemplates.mix('东西好氧区溶解氧含量图', e_data, ['line', 'line'], ['东好氧区DO:mg/L', '西好氧区DO:mg/L'], [2, 2]);
            console.log(option);
            context.$do_chart.setOption(option);

            //speed
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI49', 'AI57'], true, 1, 3);
            //console.log("speed:", JSON.stringify(e_data));
            option = chartOptionTemplates.mix('污水厂进出口流量图', e_data,['line', 'line'], ["出厂水流量m3/h", "进厂水流量m3/h"]);
            console.log(option);
            context.$speed_chart.setOption(option);

            ////OPR
            //e_data = extractVariables(res["data"], ['AI9', 'AI1'], true, 1, 3);
            ////console.log("COD:", JSON.stringify(e_data));
            //option = chartOptionTemplates.mix('东西好氧区氧化还原电位图', e_data, ['line', 'bar'], ['东好氧区OPR:mv', '西好氧区OPR:mv'], [400]);
            //console.log(option);
            //context.$opr_chart.setOption(option);
        }
    }
    aeration.init();
});
