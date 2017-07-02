/**
 * Created by Administrator on 2017/6/12.
 */

$(function(){
    var nutrient = {
        $nutrient_chart: null,
        $bod_chart: null,
        $bod_cod_chart: null,
        $bod_tp_chart: null,
        $bod_tn_chart: null,
        $opts: null,
        $size: 0,
        $_context: null,

        init: function(){
            var opt = this.$opts = {}
            this.$nutrient_chart = echarts.init(document.getElementById("nutrient"), 'vintage', opt);
            this.$bod_chart = echarts.init(document.getElementById("BOD"), 'vintage', opt);
            this.$bod_cod_chart = echarts.init(document.getElementById("BOD_COD"), 'vintage', opt);
            this.$bod_tp_chart = echarts.init(document.getElementById("BOD_TP"), 'vintage', opt);
            this.$bod_tn_chart = echarts.init(document.getElementById("BOD_TN"), 'vintage', opt);
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
                    ChartInit.init([context.$nutrient_chart, context.$bod_chart, context.$bod_cod_chart, context.$bod_tp_chart, context.$bod_tn_chart]);
                },
                success: function (result) {
                    ChartInit.hideChartLoading([context.$nutrient_chart, context.$bod_chart, context.$bod_cod_chart, context.$bod_tp_chart, context.$bod_tn_chart]);
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

            //nutrient
            e_data = ChartDataProcess.extractVariables(res["data"], ['AI56'], true, 0.06, 3);
            //console.log("medicate:", JSON.stringify(e_data));
            option = chartOptionTemplates.lines('营养液决策与控制', e_data, "营养源:L/h", false);
            console.log(option);
            context.$nutrient_chart.setOption(option);

            //BOD
            var cal_bod = ChartDataProcess.extractVariables(res["data"], ['AI59'], true, 6.2, 3);
            e_data = cal_bod = ChartDataProcess.smoothData($.extend([], cal_bod), 0.9, 3);
            option = chartOptionTemplates.lines('BOD含量', e_data, "BOD:L/h", false, [0, 10]);
            console.log(option);
            context.$bod_chart.setOption(option);

            //BOD_COD
            var cal_cod = ChartDataProcess.extractVariables(res["data"], ['AI59'], true, 1, 3);
            e_data = ChartDataProcess.calDataScale($.extend([], cal_bod), cal_cod, 'BOD/COD');
            //console.log("medicate:", JSON.stringify(e_data));
            option = chartOptionTemplates.lines('BOD/COD', e_data, "BOD/COD:比例", false, [0, 0.3]);
            console.log(option);
            context.$bod_cod_chart.setOption(option);


            var cal_bod = ChartDataProcess.extractVariables(res["data"], ['AI59'], true, 40, 3);
            //BOD_TP
            var cal_tp = ChartDataProcess.extractVariables(res["data"], ['AI62'], true, 1, 3);
            e_data = ChartDataProcess.calDataScale($.extend([], cal_bod), cal_tp, 'BOD/TP');
            //console.log("speed:", JSON.stringify(e_data));
            option = chartOptionTemplates.lines('BOD/TP', e_data, "BOD/TP:比例", false, [0, 17]);
            console.log(option);
            context.$bod_tp_chart.setOption(option);


            var cal_bod = ChartDataProcess.extractVariables(res["data"], ['AI59'], true, 5, 3);
            //BOD_TN
            var cal_tn = ChartDataProcess.extractVariables(res["data"], ['AI63'], true, 1, 3);
            e_data = ChartDataProcess.calDataScale($.extend([], cal_bod), cal_tn, 'BOD/TN');
            //console.log("speed:", JSON.stringify(e_data));
            option = chartOptionTemplates.lines('BOD/TN', e_data, "BOD/TN:比例", false, [0, 4]);
            console.log(option);
            context.$bod_tn_chart.setOption(option);
        }
    }
    nutrient.init();
});
