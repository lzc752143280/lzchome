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

$result = mysqli_query($conn,"SELECT * FROM admin limit 0,1");
if ($result->num_rows) {
    while($row = $result->fetch_assoc()) {
        echo $row["admire"];
    }
} else echo "0 结果";
$conn->close();
?>