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

$result=$conn->query("SELECT count(*) as total from messageboard");
$data=mysqli_fetch_array($result);
$count = $data['total'];


if (isset($_POST['id'])){
    $id = $_POST['id'];
    $sql = "SELECT * FROM messageboard ORDER BY id DESC LIMIT 10,".$count;
}else{
    $sql = "SELECT * FROM messageboard ORDER BY id DESC LIMIT 10";
};
 
$result=$conn->query($sql);
while($row=$result->fetch_object()){
    $unix_time = strtotime($row->sendTime);
    $Y=date("Y",$unix_time);
    $n=date("n",$unix_time);
    $j=date("j",$unix_time);
    $H=date("H",$unix_time);
    $i=date("i",$unix_time);
    $local_time = $Y.'年'.$n.'月'.$j.'日 '.$H.':'.$i;
    echo '<div class="comment" id="commentID_'.$row->id.'">'.
                    '<div class="comment_head_pic"><img src="../images/headpic/headpic_'.$row->headPicNum.'.png"></div>'.
                    '<div class="comment_right">'.
                        '<div class="comment_right_top clearfix">'.
                            '<span class="comment_name">'.$row->nickName.'</span>'.
                            '<span class="comment_time">'.$local_time.'</span>'.
                        '</div>'.
                        '<div class="comment_content">'.$row->message.'</div>'.
                        '<div class="comment_fn">'.
                            '<i class="icon-thumbs-up">(<span>'.$row->admire.'</span>)</i>'.
                        '</div>'.
                    '</div>'.
                '</div>';
};
// if ($conn->query($sql) === TRUE) {
//     echo "发送成功";
// } else {
//     echo "Error: " . $sql . "<br>" . $conn->error;
// }

$conn->close();
?>