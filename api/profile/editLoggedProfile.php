<?php
require '../database.php';
use ReallySimpleJWT\Token;

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata))
{
  $postdata = json_decode($postdata);
  $authData = $postdata[0];
  $profileData = $postdata[1];
  $authToken = $authData[0];
  $authUser = $authData[1];
  $authsql = "SELECT * FROM users WHERE username = '$authUser' LIMIT 1";

  $editsql = "UPDATE users SET email = '$profileData->email', fname = '$profileData->fname', lname = '$profileData->lname', phone = '$profileData->phone',
  street = '$profileData->street', city = '$profileData->city', state = '$profileData->state', country = '$profileData->country', twitter = '$profileData->twitter',
  instagram = '$profileData->instagram', linkedin = '$profileData->linkedin', facebook = '$profileData->facebook', youtube = '$profileData->youtube'
  WHERE username = '$authUser'";

  if($result = mysqli_query($con, $authsql)){
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
      $rows[] = $row;
      $dbhash = $rows[0]['password'];
    }
    if($tokenValidity = Token::validate($authToken, $dbhash) == true){
      $payloadContent = Token::getPayload($authToken, $dbhash);
      if($sqlres = mysqli_query($con, $editsql)){
        $response = [
          'code' => 1,
          'message' => 'User Saved Successfully'
        ];
        echo json_encode($response);
      } else{
        $response = [
          'code' => 520,
          'message' => 'There was an error editing the DB',
          'error' => 'BAD DATABASE EDIT'
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

?>
