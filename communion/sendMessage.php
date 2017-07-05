<?php
$servername = "localhost:3306";
$username = "root";
$password = "13579";
$dbname = "test";

// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
} 

$nickName=$_POST["nickName"];
$headPicNum=$_POST["headPicNum"];
$message=$_POST["message"];
$sql = "INSERT INTO messageboard (nickName, headPicNum,message) VALUES ('$nickName', '$headPicNum', '$message')";

if ($conn->query($sql) === TRUE) {
    echo "sendSuccess";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>