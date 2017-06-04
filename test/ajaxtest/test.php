<?php
/**
 * Created by PhpStorm.
 * User: Lzc
 * Date: 2017/5/9
 * Time: 20:17
 */
    $username = $_GET['username'];
	$password = $_GET['password'];
	//$username = $_POST['username'];
	//$password = $_POST['password'];

    if($username == 'admin' && $password == 'admin'){
        echo 1;
    }else{
        echo 2;
    }