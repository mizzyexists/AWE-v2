<?php
require '../database.php';

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata))
{
  $request = json_decode($postdata);
  $hash = NULL;
  $username = mysqli_real_escape_string($con, trim($request->username));
  $password = trim($request->password);
  $passwordverify = trim($request->password2);
  $email = mysqli_real_escape_string($con, trim($request->email));

  if($password == $passwordverify){
    $hash = password_hash($password, PASSWORD_DEFAULT);
  }
  else{
    header('Content-type: application/json');
    echo json_encode('Passwords do not match');
  }

  $sql1 = "SELECT * FROM users WHERE username = '$username' OR email = '$email'";
  $sql2 = "INSERT INTO users(uid, username, password, email, role, profile_image) VALUES (null, '$username', '$hash', '$email', 'user', 'https://awev2backend.appserver.mizzyexists.com/uploads/noprofile.png')";

  $usercheck = mysqli_query($con, $sql1);
  $count = mysqli_num_rows($usercheck); // Check if user or email exists
    if($count > 0){
      $response = [
        'code' => 998,
        'message' => 'User Already Exists',
        'error' => 'REGISTER ERROR 1'
      ];
      header('Content-type: application/json');
      echo json_encode($response);
    }
    elseif($count == 0 || !$count){
      if(mysqli_query($con,$sql2)){
        $response = [
          'code' => 1,
          'message' => 'Success'
        ];
        header('Content-type: application/json');
        echo json_encode($response);
      }
      else
      {
        $response = [
          'code' => 961,
          'message' => 'Error registering user.',
          'error' => 'REG ERROR'
        ];
        header('Content-type: application/json');
        echo json_encode($response);
      }
    }
    else{
      $response = [
        'code' => 999,
        'message' => 'Unknown Error',
        'error' => 'UNKNOWN ERROR 1'
      ];
      header('Content-type: application/json');
      echo json_encode($response);
    }
}

?>
