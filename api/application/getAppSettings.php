<?php
require '../database.php';

$sql = "SELECT * FROM app_settings";

if($result = mysqli_query($con, $sql)){
  $rows = array();
  $i = 0;
  while($row = mysqli_fetch_assoc($result)){
    $rows[] = $row;
    $settings[$i] = $rows[$i];
    $i++;
  }
  echo json_encode($settings);
}

?>
