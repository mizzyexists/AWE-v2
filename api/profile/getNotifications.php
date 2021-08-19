<?php
require '../database.php';
use ReallySimpleJWT\Token;

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata))
{
  $postdata = json_decode($postdata);
  $authToken = $postdata[0];
  $authUser = $postdata[1];
  $authsql = "SELECT * FROM users WHERE username = '$authUser' LIMIT 1";

  if($result = mysqli_query($con, $authsql)){
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
      $rows[] = $row;
      $dbhash = $rows[0]['password'];
      $authUid = $rows[0]['uid'];
    }
    if($tokenValidity = Token::validate($authToken, $dbhash) == true){
      $notisql = "SELECT * FROM notifications WHERE uid = '$authUid' ORDER BY noti_id DESC";
      if($sqlres = mysqli_query($con, $notisql)){
        $notirows = array();
        $i = 0;
        while($notirow = mysqli_fetch_assoc($sqlres)){
          $notirows[] = $notirow;
          $notis[$i] = $notirows[$i];
          $i++;
        }
        $newnotisql = "SELECT * FROM notifications WHERE uid = '$authUid' AND readbyuser = 'false'";
        if($newnoticounter = mysqli_query($con, $newnotisql)){
          $newnotis = 0;
          while($newrow = mysqli_fetch_assoc($newnoticounter)){
            $newnotis++;
          }
          $response = [
            'code' => 1,
            'notifications' => $notis,
            'unread' => $newnotis
          ];
          echo json_encode($response);
        }
      } else{
        $response = [
          'code' => 262,
          'message' => 'There was an error fetching notifications',
          'error' => 'BAD NOTI CALL'
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
