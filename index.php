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
<div id="medicate" style="width: 32%; height:300px;"></div>
<div id="sewage_speed" style="width: 32%; height:300px;"></div>
<div id="sewage_PH" style="width: 32%; height:300px"></div>
<div id="sewage_COD" style="width: 32%; height:300px"></div>
<div id="sewage_NH3" style="width: 32%; height:300px"></div>
<div id="sewage_out_TP_TN" style="width: 32%; height:300px"></div>
<script type="text/javascript">

</script>
</body>
</html>
