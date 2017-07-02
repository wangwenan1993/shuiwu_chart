/**
 * Created by Administrator on 2017/6/12.
 */

$(function(){
    var mixed_liquids = {
        $mixed_liquids_chart: null,
        $msll_chart: null,
        $tn_chart: null,
        $nh3_chart: null,
        $opts: null,
        $size: 0,
        $_context: null,

        init: function(){
            var opt = this.$opts = {}
            this.$mixed_liquids_chart = echarts.init(document.getElementById("mixed_liquids"), 'vintage', opt);
            this.$nh3_chart = echarts.init(document.getElementById("sewage_NH3-N"), 'vintage', opt);
            this.$msll_chart = echarts.init(document.getElementById("sewage_MSLL"), 'vintage', opt);
            this.$tn_chart = echarts.init(document.getElementById("sewage_TN"), 'vintage', opt);
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
                    ChartInit.init([context.$mixed_liquids_chart, context.$msll_chart, context.$nh3_chart, context.$tn_chart]);
                },
                success: function (result) {
                    ChartInit.hideChartLoading([context.$mixed_liquids_chart, context.$msll_chart, context.$nh3_chart, context.$tn_chart]);
                    context.renderChart(context, result);
                },
                error: function(xhr, status, error) {
                    console.log("$$$$$$$$error");
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
                    success: function (result) {
                        context.renderChart(context, result);
                    },
                    error: function(xhr, status, error) {
                        console.log("$$$$$$$$error");
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

            //mixed_liquids
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI32'], true, 1, 1);
            //console.log("medicate:", JSON.stringify(e_data));
            option = chartOptionTemplates.lines('混合液回流实时流量', e_data, "比例", false);
            console.log(option);
            context.$mixed_liquids_chart.setOption(option);

            //MSLL
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI10', 'AI2'], true, 1000, 3);
            //console.log("speed:", JSON.stringify(e_data));
            option = chartOptionTemplates.mix('东西好氧区污泥浓度含量图', e_data, ['line', 'line'], ['东好氧区MSLL:g/L', '西好氧区MSLL:g/L'], [2]);
            console.log(option);
            context.$msll_chart.setOption(option);

            //TN
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI63'], true, 1, 3);
            //console.log("speed:", JSON.stringify(e_data));
            option = chartOptionTemplates.lines('污水厂出口总氮含量图', e_data, "TN:mg/L", false, [0, 15]);
            console.log(option);
            context.$tn_chart.setOption(option);

            //NH3-N
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI60'], true, 1, 3);
            //console.log("speed:", JSON.stringify(e_data));
            option = chartOptionTemplates.bars('污水厂出口氨氮含量图', e_data, "mg/L", false, [0, 5]);
            console.log(option);
            context.$nh3_chart.setOption(option);
        }
    }
    mixed_liquids.init();
});
