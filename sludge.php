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
    <title>污泥回流自动决策及数据展示</title>
    <meta charset="utf-8">
    <script src="js/core/echarts.js"></script>
    <script src="js/theme/vintage.js"></script>
    <script src="js/core/jquery-1.10.2.js"></script>
    <script src="js/app/config.js"></script>
    <script src="js/app/sludge.js"></script>
    <link rel="stylesheet" type="text/css" href="css/common.css">
</head>
<body>
<div class="audio">
    <audio src="res/sludge.mp3" controlsList="nodownload" controls></audio>
</div>
<h2>山东沂源第二污水处理厂：污泥外回流决策与控制</h2>
<div class="chart-content">
    <div id="sludge" class="chart_num_2"></div>
    <div id="sewage_MLSS" class="chart_num_2_low"></div>
    <div width="100%" height="2px" style="display: block; border: 0px"></div>
    <div id="sewage_TP" class="chart_num_2"></div>
</div>
<script type="text/javascript">

</script>
</body>
</html>
