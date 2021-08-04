<?php
require '../database.php';
use ReallySimpleJWT\Token;

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata))
{
  $request = json_decode($postdata);
  $username = mysqli_real_escape_string($con, trim($request->username));
  $password = trim($request->password);

  $sql = "SELECT * FROM users WHERE username = '$username' OR email = '$username' LIMIT 1";

  if($result = mysqli_query($con, $sql)){
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
      $rows[] = $row;
      $dbuid = $rows[0]['uid'];
      $dbusername = $rows[0]['username'];
      $dbhash = $rows[0]['password'];
      $dbemail = $rows[0]['email'];
    }
    if(password_verify($password, $dbhash) == true){
      $payload = [
        'iat' => time(),
        'uid' => $generated_uid,
        'exp' => time() + 604800,
        'iss' => 'AWE v2',
        'data' => [
          'uid' => $dbuid,
          'username' => $username,
          'email' => $dbemail
        ]
      ];
      $secret = $dbhash;
      $token = Token::customPayload($payload, $secret);
      $response = [
        'code' => 1,
        'message' => 'Successful Login',
        'jwt' => $token,
        'username' => $username
      ];
      echo json_encode($response);
    }
    else{
      $response = [
        'code' => 750,
        'message' => 'Incorrect Password',
        'error' => 'BAD PASSWORD'
      ];
      echo json_encode($response);
    }
  }
}
?>
