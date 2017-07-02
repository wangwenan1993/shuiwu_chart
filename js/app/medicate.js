/**
 * Created by Administrator on 2017/6/12.
 */

$(function(){
    var medicate = {
        $medicate_chart: null,
        $speed_chart: null,
        $ph_chart: null,
        $cod_chart: null,
        $nh3_chart: null,
        $out_tp_tn_chart: null,
        $opts: null,
        $size: 0,
        $_context: null,

        init: function(){
            var opt = this.$opts = {}
            this.$medicate_chart = echarts.init(document.getElementById("medicate"), 'vintage', opt);
            this.$speed_chart = echarts.init(document.getElementById("sewage_speed"), 'vintage', opt);
            this.$ph_chart = echarts.init(document.getElementById("sewage_PH"), 'vintage', opt);
            this.$cod_chart = echarts.init(document.getElementById("sewage_COD"), 'vintage', opt);
            this.$nh3_chart = echarts.init(document.getElementById("sewage_NH3"), 'vintage', opt);
            this.$out_tp_tn_chart = echarts.init(document.getElementById("sewage_out_TP_TN"), 'vintage', opt);
            this.$size = 20;
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
                    ChartInit.init([context.$medicate_chart, context.$speed_chart, context.$ph_chart, context.$cod_chart, context.$nh3_chart, context.$out_tp_tn_chart]);
                },
                success: function (result) {
                    ChartInit.hideChartLoading([context.$medicate_chart, context.$speed_chart, context.$ph_chart, context.$cod_chart, context.$nh3_chart, context.$out_tp_tn_chart]);
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

            //medicate
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI56'], false);
            //console.log("medicate:", JSON.stringify(e_data));
            option = chartOptionTemplates.lines('污水厂实时加药量', e_data, "m3/h", false);
            console.log(option);
            context.$medicate_chart.setOption(option);

            //speed
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI49', 'AI57'], true, 1, 3);
            //console.log("speed:", JSON.stringify(e_data));
            option = chartOptionTemplates.bars('污水厂进出口流量图', e_data, "m3/h", false);
            console.log(option);
            context.$speed_chart.setOption(option);

            //PH
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI37', 'AI61'], true, 1, 1);
            //console.log("PH:", JSON.stringify(e_data));
            option = chartOptionTemplates.bars('污水厂进出口PH值', e_data, "ph", false, [6, 9]);
            console.log(option);
            context.$ph_chart.setOption(option);

            //COD
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI35', 'AI59'], true, 1, 3);
            //console.log("COD:", JSON.stringify(e_data));
            option = chartOptionTemplates.mix('污水厂进出口COD值', e_data, ['line', 'line'], ['出口COD:mg/L', '进口COD:mg/L'], [50, 50]);
            console.log(option);
            context.$cod_chart.setOption(option);

            //NH3-N
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI36', 'AI60'], true, 1, 3);
            //console.log("NH3-N:", JSON.stringify(e_data));
            option = chartOptionTemplates.mix('污水厂进出口NH3-N值', e_data, ['line', 'bar'], ['出口氨氮mg/L', '进口氨氮mg/L'], [5, 5]);
            console.log(option);
            context.$nh3_chart.setOption(option);

            //TP_TN
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI62', 'AI63'], true, 1, 3);
            //console.log("TP_TN:", JSON.stringify(e_data));
            option = chartOptionTemplates.mix('污水厂出口TP_TN值', e_data, ['line', 'line'], ['出口总氮mg/L', '出口总磷mg/L'], [15, 1]);
            console.log(option);
            context.$out_tp_tn_chart.setOption(option);
        }
    }
    medicate.init();
});
