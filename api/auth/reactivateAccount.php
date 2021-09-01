<?php
require '../database.php';
use ReallySimpleJWT\Token;

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata)){
  $requestData = json_decode($postdata);
  $authUser = $requestData[1];

  $sql = "SELECT * FROM users WHERE username = '$authUser' LIMIT 1";

  if($result = mysqli_query($con, $sql)){
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
      $rows[] = $row;
      $authUid = $rows[0]['uid'];
      $dbhash = $rows[0]['password'];
      $dbstatus = $rows[0]['account_status'];
    }
    $reactivatesql = "UPDATE users SET account_status = 'active' WHERE username = '$authUser'";
    if(mysqli_query($con, $reactivatesql)){
      $response = [
        'code' => 1,
        'message' => 'Account has been successfully reactivated. You may now login with the same credentials.',
      ];
      header('Content-type: application/json');
      echo json_encode($response);
    }else{
      $response = [
        'code' => 511,
        'message' => 'Could not deactivate account',
        'error' => 'CANT DEACTIVATE USER'
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
