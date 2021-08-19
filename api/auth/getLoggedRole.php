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
    if($dbhash){
      if($tokenValidity = Token::validate($authToken, $dbhash) == true){
        if($result = mysqli_query($con, $sql)){
          while($row = mysqli_fetch_assoc($result)){
            $rows[] = $row;
            $db_role = $rows[0]['role'];
          }
          $response = [
            'code' => 1,
            'role' => $db_role
          ];
          echo json_encode($response);
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
}
else{
  $response = [
    'code' => 365,
    'message' => 'No token was given to authenticate',
    'error' => 'NO TOKEN'
  ];
  echo json_encode($response);
}


?>
