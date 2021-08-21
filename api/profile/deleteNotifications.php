<?php
require '../database.php';
use ReallySimpleJWT\Token;

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata))
{
  $postdata = json_decode($postdata);
  $authToken = $postdata[0];
  $authUser = $postdata[1];

  $authsql = "SELECT * FROM users WHERE username = '$authUser' LIMIT 1";

  if($result = mysqli_query($con, $authsql)){
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
      $rows[] = $row;
      $dbhash = $rows[0]['password'];
      $authUid = $rows[0]['uid'];
    }
    if($tokenValidity = Token::validate($authToken, $dbhash) == true){
      $notisql = "DELETE FROM notifications WHERE uid = '$authUid'";
      if(mysqli_query($con, $notisql)){
        $response = [
          'code' => 1,
          'message' => 'Notifications Deleted',
        ];
        header('Content-type: application/json');
        echo json_encode($response);
      }
      else{
        $response = [
          'code' => 261,
          'message' => 'Could not delete user notifications.',
          'error' => 'NO NOTI DELETE'
        ];
        header('Content-type: application/json');
        echo json_encode($response);
      }
    }
    else{
      $response = [
        'code' => 355,
        'message' => 'Could not authenticate. Please login again.',
        'error' => 'BAD TOKEN'
      ];
      header('Content-type: application/json');
      echo json_encode($response);
    }
  }
  else{
  $response = [
    'code' => 365,
    'message' => 'No token was given to authenticate',
    'error' => 'NO TOKEN'
  ];
  header('Content-type: application/json');
  echo json_encode($response);
  }
}
?>
