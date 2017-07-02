<?php
ini_set("display_errors", "On");
ini_set("log_errors", "On");
//error_reporting(E_ALL | E_STRICT);
error_reporting(E_ALL & ~E_NOTICE);

require_once(dirname(__FILE__).'/data/config.php');

//echo "current_page_url:" . 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
?>

<!DOCTYPE html>
<html>
<head>
    <title>加药自动决策及数据展示</title>
    <meta charset="utf-8">
    <script src="js/core/echarts.js"></script>
    <script src="js/theme/vintage.js"></script>
    <script src="js/core/jquery-1.10.2.js"></script>
<!--    <script src="js/app/index.js"></script>-->
    <script src="js/app/config.js"></script>
    <script src="js/app/medicate.js"></script>
    <link rel="stylesheet" type="text/css" href="css/common.css">
</head>
<body>
<!--<div id="main" style="width: 400px; height:400px; color: red"></div>-->
<div class="audio">
    <audio src="res/medicate.mp3" controlsList="nodownload" controls></audio>
</div>
<h2>山东沂源第二污水处理厂：加药量决策与控制</h2>
<div class="chart-content">
    <div id="medicate" class="chart_num_3"></div>
    <div id="sewage_speed" class="chart_num_3"></div>
    <div id="sewage_PH" class="chart_num_3_low"></div>
    <div width="100%" height="2px" style="display: block; border: 0px"></div>
    <div id="sewage_COD" class="chart_num_3"></div>
    <div id="sewage_NH3" class="chart_num_3"></div>
    <div id="sewage_out_TP_TN" class="chart_num_3_low"></div>
</div>
<script type="text/javascript">


</script>
</body>
</html>
