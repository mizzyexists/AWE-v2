<?php
require '../database.php';
use ReallySimpleJWT\Token;

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata))
{
  $authRequest = json_decode($postdata);
  $authToken = $authRequest[0];
  $authUser = $authRequest[1];
  $sql = "SELECT * FROM users WHERE username = '$authUser' LIMIT 1";

  if($result = mysqli_query($con, $sql)){
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
      $rows[] = $row;
      $dbhash = $rows[0]['password'];
    }
    if($tokenValidity = Token::validate($authToken, $dbhash) == true){
      $payloadContent = Token::getPayload($authToken, $dbhash);
      $payloadContent = $payloadContent['data'];
      $response = [
        'code' => 1,
        'message' => 'Successful Authentication',
        'tokenValidity' => $tokenValidity,
        'tokenPayload' => $payloadContent,
      ];
      header('Content-type: application/json');
      echo json_encode($response);
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

?>
