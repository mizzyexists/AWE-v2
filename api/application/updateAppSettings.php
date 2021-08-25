<?php
require '../database.php';
use ReallySimpleJWT\Token;

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata)){
  $requestData = json_decode($postdata);
  $authData = $requestData[0];
  $appData = $requestData[1];
  $authToken = $authData[0];
  $authUser = $authData[1];

  $sql = "SELECT * FROM users WHERE username = '$authUser' LIMIT 1";

  if($result = mysqli_query($con, $sql)){
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
      $rows[] = $row;
      $dbhash = $rows[0]['password'];
    }
    if($tokenValidity = Token::validate($authToken, $dbhash) == true){
      $appData->setMaintenanceMode = (boolval($appData->setMaintenanceMode) ? 'true' : 'false');
      $appData->setAllowRegistration = (boolval($appData->setAllowRegistration) ? 'true' : 'false');
      $appData->setNotificationPolling = (boolval($appData->setNotificationPolling) ? 'true' : 'false');
      $maintenancesql = "UPDATE app_settings SET setting_value = '$appData->setMaintenanceMode' WHERE setting_name = 'maintenance-mode'";
      $registrationsql = "UPDATE app_settings SET setting_value = '$appData->setAllowRegistration' WHERE setting_name = 'allow-registration'";
      $notificationsql = "UPDATE app_settings SET setting_value = '$appData->setNotificationPolling' WHERE setting_name = 'notification_polling'";
      if(mysqli_query($con, $maintenancesql)){
        if(mysqli_query($con, $registrationsql)){
          if(mysqli_query($con, $notificationsql)){
            $response = [
              'code' => 1,
              'message' => 'App settings have been updated.',
            ];
            header('Content-type: application/json');
            echo json_encode($response);
          }
        }
      }
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
