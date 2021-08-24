<?php
require '../database.php';
use ReallySimpleJWT\Token;

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata)){
  $requestData = json_decode($postdata);
  $authData = $requestData[0];
  $avatarURL = $requestData[1];
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
      $avatarsql = "UPDATE users SET profile_image = '$avatarURL' WHERE username = '$authUser'";
      if(mysqli_query($con, $avatarsql)){
        $response = [
          'code' => 1,
          'message' => 'Avatar changed successfully.',
        ];
        header('Content-type: application/json');
        echo json_encode($response);
      }else{
        $response = [
          'code' => 623,
          'message' => 'Could not update avatar url',
          'error' => 'CANT CHANGE AVATAR URL'
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

?>
