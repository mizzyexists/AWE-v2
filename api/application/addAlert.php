<?php
require '../database.php';
use ReallySimpleJWT\Token;

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata)){
  $requestData = json_decode($postdata);
  $authData = $requestData[0];
  $alertData = $requestData[1];
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
      $persistValue = (boolval($alertData->persist) ? 'true' : 'false');
      $autocloseValue = (boolval($alertData->autoclose) ? 'true' : 'false');
      $alertsql = "INSERT INTO alerts(alert_id, type, message, persist, persist_id, persist_count, theme, autoclose) VALUES (null, '$alertData->type', '$alertData->message', '$persistValue', '$alertData->persistID', '$alertData->persistCount', '$alertData->theme', '$autocloseValue')";
      if(mysqli_query($con, $alertsql)){
        $response = [
          'code' => 1,
          'message' => 'Alert added successfully.'
        ];
        header('Content-type: application/json');
        echo json_encode($response);
      } else{
        $response = [
          'code' => 224,
          'message' => 'Could not add alert to DB',
          'error' => 'BAD ALERT QUERY'
        ];
        header('Content-type: application/json');
        echo json_encode($alertsql);
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
