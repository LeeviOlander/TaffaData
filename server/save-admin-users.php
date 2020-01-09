<?php

    include_once('core/php/includes.php');

    if(Session::has_admin_access())
    {
        $admin_users_post_parameter = 'users-admin';

        RequestParameterChecker::check_post_parameters_or_exit(array($admin_users_post_parameter));

        $authentication_settings_file_path = SERVER_SECRET_SETTINGS_DIR . '/authentication-settings.json';
        $authentication_settings_users_admin_key = 'users_admin';
    
        $authentication_settings = json_decode(file_get_contents($authentication_settings_file_path), true);

        $new_admin_users_raw = $_POST[$admin_users_post_parameter];
        $new_admin_users_lines = explode("\n", $new_admin_users_raw);

        $new_admin_users = array();

        foreach($new_admin_users_lines as $line)
        {
            $user = htmlspecialchars(trim($line));

            if($user != '')
            {
                $new_admin_users[] = $user;
            }
        }

        $authentication_settings[$authentication_settings_users_admin_key] = $new_admin_users;

        file_put_contents($authentication_settings_file_path, json_encode($authentication_settings, JSON_PRETTY_PRINT));

        echo 'New admin users successfully set!';
    }

    else
    {
        echo 'You do not have permission to complete this action.';
    }


?>