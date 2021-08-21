<?php
require '../database.php';
use ReallySimpleJWT\Token;

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata)){
  $requestData = json_decode($postdata);
  $authData = $requestData[0];
  $notiData = $requestData[1];
  $authToken = $authData[0];
  $authUser = $authData[1];

  $sql = "SELECT * FROM users WHERE username = '$authUser' LIMIT 1";

  if($result = mysqli_query($con, $sql)){
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
      $rows[] = $row;
      $authUid = $rows[0]['uid'];
      $dbhash = $rows[0]['password'];
    }
    if($tokenValidity = Token::validate($authToken, $dbhash) == true){
      $checkusersql = "SELECT * FROM users WHERE username = '$notiData->target' LIMIT 1";
      if($usercheck = mysqli_query($con, $checkusersql)){
        $count = mysqli_num_rows($usercheck);
        if($count > 0){
          while($noti_row = mysqli_fetch_assoc($usercheck)){
            $noti_rows[] = $noti_row;
            $dbuid = $noti_rows[0]['uid'];
          }
          $createnotisql = "INSERT INTO notifications(noti_id, uid, title, body, slug, readbyuser) VALUES (null, '$dbuid', '$notiData->title', '$notiData->message', '$notiData->slug', 'false')";
          if($createnoti = mysqli_query($con, $createnotisql)){
            $response = [
              'code' => 1,
              'message' => 'Notification Added to User',
            ];
            header('Content-type: application/json');
            echo json_encode($response);
          }else{
            $response = [
              'code' => 627,
              'message' => 'Could not add notification to user',
              'error' => 'BAD CREATE NOTI'
            ];
            header('Content-type: application/json');
            echo json_encode($response);
          }
        }
        elseif ($count == 0) {
          $response = [
            'code' => 415,
            'message' => 'Target user does not exist.',
            'error' => 'BAD TARGET USER'
          ];
          header('Content-type: application/json');
          echo json_encode($response);
        }
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
