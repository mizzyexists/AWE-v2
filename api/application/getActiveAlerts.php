<?php
require '../database.php';

$sql = "SELECT * FROM alerts";

if($result = mysqli_query($con, $sql)){
  $rows = array();
  $i = 0;
  while($row = mysqli_fetch_assoc($result)){
    $rows[] = $row;
    $alerts[$i] = $rows[$i];
    $i++;
  }
  echo json_encode($alerts);
}

?>
