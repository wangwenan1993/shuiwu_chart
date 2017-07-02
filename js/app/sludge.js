/**
 * Created by Administrator on 2017/6/12.
 */

$(function(){
    var sludge = {
        $sludge_chart: null,
        $msll_chart: null,
        $tp_chart: null,
        $opts: null,
        $size: 0,
        $_context: null,

        init: function(){
            var opt = this.$opts = {}
            this.$sludge_chart = echarts.init(document.getElementById("sludge"), 'vintage', opt);
            this.$msll_chart = echarts.init(document.getElementById("sewage_MLSS"), 'vintage', opt);
            this.$tp_chart = echarts.init(document.getElementById("sewage_TP"), 'vintage', opt);
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
                    ChartInit.init([context.$sludge_chart, context.$msll_chart, context.$tp_chart]);
                },
                success: function (result) {
                    ChartInit.hideChartLoading([context.$sludge_chart, context.$msll_chart, context.$tp_chart]);
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

            //sludge
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI32'], true, 3, 3);
            //console.log("medicate:", JSON.stringify(e_data));
            option = chartOptionTemplates.lines('污泥外回流实时流量', e_data, "比例", false);
            console.log(option);
            context.$sludge_chart.setOption(option);

            //MSLL
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI10', 'AI2'], true, 1000, 3);
            //console.log("speed:", JSON.stringify(e_data));
            option = chartOptionTemplates.mix('东西好氧区污泥浓度含量图', e_data, ['line', 'line'], ['东好氧区MSLL:g/L', '西好氧区MSLL:g/L'], [2]);
            console.log(option);
            context.$msll_chart.setOption(option);

            //TP
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI62'], true, 1, 3);
            //console.log("speed:", JSON.stringify(e_data));
            option = chartOptionTemplates.bars('污水厂出口总磷', e_data, "TP:mg/L", false, [0, 1]);
            console.log(option);
            context.$tp_chart.setOption(option);
        }
    }
    sludge.init();
});
