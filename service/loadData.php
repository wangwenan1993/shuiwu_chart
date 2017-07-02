<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/6/13
 * Time: 22:15
 */

ini_set("display_errors", "On");
ini_set("log_errors", "On");
//error_reporting(E_ALL | E_STRICT);
error_reporting(E_ALL & ~E_NOTICE);
require_once(dirname(__FILE__).'/../data/get.json.from.server.php');
require_once(dirname(__FILE__).'/service.php');
$deviceId=checkPostPara("deviceId");
$time_sort=checkPostPara("time_sort");
$size=checkPostPara("size");

$_url = Config::$serverurl . '?deviceId=' . $deviceId . '&time_sort=' . $time_sort . '&size=' . $size;
$resRaw = http_request($_url, null);
$res = json_decode($resRaw, true);
//var_dump($res);
echo json_encode($res, JSON_UNESCAPED_UNICODE);
?>