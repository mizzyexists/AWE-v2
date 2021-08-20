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
      if($result = mysqli_query($con, $sql)){
        while($row = mysqli_fetch_assoc($result)){
          $rows[] = $row;
          $db_username = $rows[0]['username'];
          $db_email = $rows[0]['email'];
          $db_role = $rows[0]['role'];
          $db_image = $rows[0]['profile_image'];
          $db_fname = $rows[0]['fname'];
          $db_lname = $rows[0]['lname'];
          $db_phone = $rows[0]['phone'];
          $db_street = $rows[0]['street'];
          $db_city = $rows[0]['city'];
          $db_state = $rows[0]['state'];
          $db_country = $rows[0]['country'];
          $db_twitter = $rows[0]['twitter'];
          $db_instagram = $rows[0]['instagram'];
          $db_linkedin = $rows[0]['linkedin'];
          $db_facebook = $rows[0]['facebook'];
          $db_youtube = $rows[0]['youtube'];
        }
        $response = [
          'code' => 1,
          'username' => $db_username,
          'email' => $db_email,
          'role' => $db_role,
          'image' => $db_image,
          'fname' => $db_fname,
          'lname' => $db_lname,
          'phone' => $db_phone,
          'street' => $db_street,
          'city' => $db_city,
          'state' => $db_state,
          'country' => $db_country,
          'twitter' => $db_twitter,
          'instagram' => $db_instagram,
          'linkedin' => $db_linkedin,
          'facebook' => $db_facebook,
          'youtube' => $db_youtube
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
