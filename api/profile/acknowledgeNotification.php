<?php
require '../database.php';
use ReallySimpleJWT\Token;

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata))
{
  $postdata = json_decode($postdata);
  $authToken = $postdata[0];
  $authUser = $postdata[1];
  $notificationID = $postdata[2];

  $authsql = "SELECT * FROM users WHERE username = '$authUser' LIMIT 1";
  $notisql = "UPDATE notifications SET readbyuser = 'true' WHERE noti_id = '$notificationID'";

  if($result = mysqli_query($con, $authsql)){
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
      $rows[] = $row;
      $dbhash = $rows[0]['password'];
      $authUid = $rows[0]['uid'];
    }
    if($tokenValidity = Token::validate($authToken, $dbhash) == true){
      if(mysqli_query($con, $notisql)){
        echo 'YAY YOU READ IT';
      }
    }
    else{
      $response = [
        'code' => 355,
        'message' => 'Could not authenticate. Please login again.',
        'error' => 'BAD TOKEN'
      ];
      echo json_encode($response);
    }
  }
  else{
  $response = [
    'code' => 365,
    'message' => 'No token was given to authenticate',
    'error' => 'NO TOKEN'
  ];
  echo json_encode($response);
  }
}
?>
