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

if (isset($_POST['admire']) && isset($_POST['id'])){
    $admire = $_POST['admire'];
    $id = $_POST['id'];
    mysqli_query($conn,"UPDATE messageboard SET admire=$admire WHERE id=$id");
    echo $admire;
};
 
$conn->close();
?>