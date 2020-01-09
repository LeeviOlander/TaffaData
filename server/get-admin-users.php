<?php

    include_once('core/php/includes.php');

    $authentication_settings_file_path = SERVER_SECRET_SETTINGS_DIR . '/authentication-settings.json';
    $authentication_settings_users_admin_key = 'users_admin';
    
    $authentication_settings = json_decode(file_get_contents($authentication_settings_file_path), true);
    $users_admin = $authentication_settings[$authentication_settings_users_admin_key];

    foreach($users_admin as $user)
    {
        echo $user . "\n";
    }
?>