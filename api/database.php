<?php
require "config.php";

$con = mysqli_connect($dbaddy, $dbuser, $dbpass, $dbname);

if (mysqli_connect_errno()) {
    if($console_error_alerts == true){echo '<script>console.error("DATABASE EXCEPTION 0001: '.mysqli_connect_error().'")</script>';}
    exit();
}
/* check if server is alive */
if (mysqli_ping($con)) {
    if($console_info_alerts == true){echo '<script>console.info("DATABASE INFO: Connection to DB Successful")</script>';}
} else {
    if($console_error_alerts == true){echo '<script>console.error("DATABASE EXCEPTION 0002: '.mysqli_error($con).'")</script>';}
}

/* close connection */
mysqli_close($con);
?>
