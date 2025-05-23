<?php
function generateToken(){
    if($_SESSION['auth_token']==null||$_SESSION['admin_id']==null){
        return  $_SESSION['auth_token']= bin2hex(random_bytes(32));
    }
    return $_SESSION['auth_token'];
}