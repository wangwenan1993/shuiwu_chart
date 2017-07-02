<?php
ini_set("display_errors", "On");
ini_set("log_errors", "On");
//error_reporting(E_ALL | E_STRICT);
error_reporting(E_ALL & ~E_NOTICE);
require_once(dirname(__FILE__).'/../data/config.php');
require_once(dirname(__FILE__).'/../data/get.json.from.server.php');

function getGet($para){
    if(!isset($_GET[$para])){
        return "";
    } else {
        return $_GET[$para];
    }
}

function checkGetPara($para){
    $check = getGet($para);
    if(empty($check)){
        $json = new Code();
        $json->setCode(90000);
        $json->setMsg("参数无效");
        echo json_encode($json);
        //echo '{"code":90000,"msg":"参数无效！"}';
        exit();
    }else{
        return $check;
    }
}

function getPost($para){
    if(!isset($_POST[$para])){
        return "";
    } else {
        return $_POST[$para];
    }
}

function checkPostPara($para){
    $check = getPost($para);
    if(empty($check)){
        $json = new Code();
        $json->setCode(90000);
        $json->setMsg("参数无效");
        echo json_encode($json);
        //echo '{"code":90000,"msg":"参数无效！"}';
        exit();
    }else{
        return $check;
    }
}

function delCommonById($methodName, $idName, $id){
    $check = checkAndUpdateToken();
    if($check->getCode()!=0){
        return $check;
    }
    $url = Config::$serverurl.'/'.$methodName.'.json';
    for ($i = 0; $i<Config::$repost_times; $i++){
        $data = $idName . "=" . $id . "&key=" . session_id() . "&token=" . $_SESSION['token'];
        $resRaw = http_request($url, $data);
        $res = json_decode($resRaw, true);
        $cr = checkRes($res);
        if($cr){
            return $cr;
        }
    }
    return $res;
}

function submitCommonById($methodName, $idName, $id){
    $check = checkAndUpdateToken();
    if($check->getCode()!=0){
        return $check;
    }
    $url = Config::$serverurl.'/'.$methodName.'.json';
    for ($i = 0; $i<Config::$repost_times; $i++){
        $data = $idName . "=" . $id . "&key=" . session_id() . "&token=" . $_SESSION['token'];
        $resRaw = http_request($url, $data);
        $res = json_decode($resRaw, true);
        $cr = checkRes($res);
        if($cr){
            return $cr;
        }
    }
    return $res;
}

function getCommonById($methodName, $idName, $id, $flag=null, $detail=0){  //flag-> null: 默认的三个月 loadMore: 十个月 月份：只查指定的月份
                                                                           //detail->是否返回未评分的考核内容
    $check = checkAndUpdateToken();
    if($check->getCode()!=0){
        return $check;
    }
    $url = Config::$serverurl.'/'.$methodName.'.json';
    for ($i = 0; $i<Config::$repost_times; $i++){
        $data="";
        if($flag == null){
            $data = $idName . "=" . $id . "&key=" . session_id() . "&token=" . $_SESSION['token'];
        } else if($detail == 0){
            $data = $idName . "=" . $id . "&key=" . session_id() . "&token=" . $_SESSION['token']."&flag=".$flag;
        } else {
            $data = $idName . "=" . $id . "&key=" . session_id() . "&token=" . $_SESSION['token']."&flag=".$flag."&detail=".$detail;
        }
        $resRaw = http_request($url, $data);
        $res = json_decode($resRaw, true);
        $cr = checkRes($res);
        if($cr){
            return $cr;
        }
    }
    return $res;
}
function getCommonByBranchLeader($methodName, $idName, $id, $branch_leader, $flag=null, $detail=0){  //flag-> null: 默认的三个月 loadMore: 十个月 月份：只查指定的月份
                                                                           //detail->是否返回未评分的考核内容
    $check = checkAndUpdateToken();
    if($check->getCode()!=0){
        return $check;
    }
    $url = Config::$serverurl.'/'.$methodName.'.json';
    for ($i = 0; $i<Config::$repost_times; $i++){
        $data="";
        if($flag == null){
            $data = $idName . "=" . $id . "&key=" . session_id() . "&token=" . $_SESSION['token']. "&branch_leader=" . $branch_leader;
        } else if($detail == 0){
            $data = $idName . "=" . $id . "&key=" . session_id() . "&token=" . $_SESSION['token']. "&branch_leader=" . $branch_leader."&flag=".$flag;
        } else {
            $data = $idName . "=" . $id . "&key=" . session_id() . "&token=" . $_SESSION['token']. "&branch_leader=" . $branch_leader."&flag=".$flag."&detail=".$detail;
        }
        $resRaw = http_request($url, $data);
        $res = json_decode($resRaw, true);
        $cr = checkRes($res);
        if($cr){
            return $cr;
        }
    }
    return $res;
}

function getCheckContent($methodName, $idName, $id){
    $check = checkAndUpdateToken();
    if($check->getCode()!=0){
        return $check;
    }
    $url = Config::$serverurl.'/'.$methodName.'.json';
    for ($i = 0; $i<Config::$repost_times; $i++){
        $data="";
        if($idName == "department"){
            $data = $idName . "=" . $id . "&flag=department" . "&key=" . session_id() . "&token=" . $_SESSION['token'];
        } else if($idName == "branch_leader"){
            $data = $idName . "=" . $id . "&flag=branch_leader" . "&key=" . session_id() . "&token=" . $_SESSION['token'];
        } else {
            $data = $idName . "=" . $id . "&flag=chairman" . "&key=" . session_id() . "&token=" . $_SESSION['token'];
        }
        $resRaw = http_request($url, $data);
        $res = json_decode($resRaw, true);
        $cr = checkRes($res);
        if($cr){
            return $cr;
        }
    }
    return $res;
}

function getCommon($methodName){
    $check = checkAndUpdateToken();
    if($check->getCode()!=0){
        return $check;
    }
    $url = Config::$serverurl.'/'.$methodName.'.json';
    for ($i = 0; $i<Config::$repost_times; $i++){
        $data = "key=" . session_id() . "&token=" . $_SESSION['token'];
        $resRaw = http_request($url, $data);
        $res = json_decode($resRaw, true);
        $cr = checkRes($res);
        if($cr){
            return $cr;
        }
    }
    return $res;
}


function openCommonById($methodName, $idName, $id){
    $check = checkAndUpdateToken();
    if($check->getCode()!=0){
        return $check;
    }
    $url = Config::$serverurl.'/'.$methodName.'.json';
    for ($i = 0; $i<Config::$repost_times; $i++){
        $data = $idName . "=" . $id . "&key=" . session_id() . "&token=" . $_SESSION['token'];
        $resRaw = http_request($url, $data);
        $res = json_decode($resRaw, true);
        $cr = checkRes($res);
        if($cr){
            return $cr;
        }
    }
    return $res;
}

function saveCommon($methodName, $userName, $user_id, $jsonName, $json){
    $check = checkAndUpdateToken();
    if($check->getCode()!=0){
        return $check;
    }

    $url = Config::$serverurl.'/'.$methodName.'.json';
    for ($i = 0; $i<Config::$repost_times; $i++){
        $data = $userName . "=" . $user_id . "&" . $jsonName . "=" . json_encode($json) . "&key=" . session_id() . "&token=" . $_SESSION['token'];
        $resRaw = http_request($url, $data);
        $res = json_decode($resRaw, true);
        $cr = checkRes($res);
        if($cr){
            return $cr;
        }
    }
    return $res;
}

function checkRes($res){
    if (empty($res) || $res == null || $res == false) {
        $json = new Code();
        $json->setCode(9002);
        $json->setMsg("无法连接服务器");
        return $json;
        //return '{"code":9002,"msg":"无法连接服务器"}';
    } else if (isset($res["code"]) && ($res["code"] == 90001 || $res["code"] == 90006)) {
        $gt = getToken();
        if($gt->getCode()!=0){
            return $gt;
        } else {
            return null;
        }
    } else {
        return $res;
    }
}

?>