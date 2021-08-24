<?php
require '../database.php';

$upload_dir = '/uploads/';
$uploadedAvatar = $_FILES['avatar'];

if(isset($uploadedAvatar) && !empty($uploadedAvatar))
{
  if($uploadedAvatar['error'] == 0){
    $random_name = rand(1000,1000000)."-".$uploadedAvatar['name'];
    $upload_name = $upload_dir.strtolower($random_name);
    $upload_name = preg_replace('/\s+/', '-', $upload_name);
    if(move_uploaded_file($uploadedAvatar['tmp_name'] , '../'.$upload_name)) {
      $response = [
          "code" => 1,
          "message" => "Avatar changed successfully.",
          "url" => $server_url.$upload_name
        ];
      header('Content-type: application/json');
      echo json_encode($response);
    }
    else
    {
      $response = [
          "code" => 546,
          "message" => "Error uploading the file to fileserver",
          "error" => "COULDN'T MOVE FILE"
      ];
    }
  }
  else{
    $response = [
      'code' => 545,
      'message' => 'Error in uploaded file',
      'error' => 'BAD FILE'
    ];
    header('Content-type: application/json');
    echo json_encode($response);
  }
}
else{
  $response = [
    'code' => 543,
    'message' => 'No file uploaded or no auth found',
    'error' => 'NO FILE AND/OR AUTH'
  ];
  header('Content-type: application/json');
  echo json_encode($response);
}

?>
