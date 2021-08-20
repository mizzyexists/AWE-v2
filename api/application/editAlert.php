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
      $alertsql = "UPDATE alerts SET type = '$alertData->type', message = '$alertData->message', persist = '$persistValue', persist_id = '$alertData->persistID', persist_count = '$alertData->persistCount', theme = '$alertData->theme', autoclose = '$autocloseValue' WHERE alert_id = '$alertData->alertID'";
      if(mysqli_query($con, $alertsql)){
        $response = [
          'code' => 1,
          'message' => 'Alert edited successfully.'
        ];
        header('Content-type: application/json');
        echo json_encode($response);
      } else{
        $response = [
          'code' => 224,
          'message' => 'Could not update alert in DB',
          'error' => 'BAD ALERT QUERY'
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
