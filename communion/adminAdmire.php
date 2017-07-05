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

if (isset($_POST['admire'])){
    $admire = $_POST['admire'];
    mysqli_query($conn,"UPDATE admin SET admire=$admire");
    echo $admire;
};
 
$conn->close();
?>