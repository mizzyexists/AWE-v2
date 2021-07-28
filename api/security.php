<?php
$origin = $_SERVER['HTTP_ORIGIN'];
$allowed_domains = [
    '*'
];
if (in_array($origin, $allowed_domains)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
}
elseif($allowed_domains[0] == "*"){
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
}
else{
  http_response_code(403);
  die("Access Denied");
}
?>
