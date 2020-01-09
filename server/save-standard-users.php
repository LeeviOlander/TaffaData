<?php

    include_once('core/php/includes.php');

    if(Session::has_admin_access())
    {
        $standard_users_post_parameter = 'users-standard';

        RequestParameterChecker::check_post_parameters_or_exit(array($standard_users_post_parameter));

        $authentication_settings_file_path = SERVER_SECRET_SETTINGS_DIR . '/authentication-settings.json';
        $authentication_settings_users_standard_key = 'users_standard';
    
        $authentication_settings = json_decode(file_get_contents($authentication_settings_file_path), true);

        $new_standard_users_raw = $_POST[$standard_users_post_parameter];
        $new_standard_users_lines = explode("\n", $new_standard_users_raw);

        $new_standard_users = array();

        foreach($new_standard_users_lines as $line)
        {
            $user = htmlspecialchars(trim($line));

            if($user != '')
            {
                $new_standard_users[] = $user;
            }
        }

        $authentication_settings[$authentication_settings_users_standard_key] = $new_standard_users;

        file_put_contents($authentication_settings_file_path, json_encode($authentication_settings, JSON_PRETTY_PRINT));

        echo 'New standard users successfully set!';
    }

    else
    {
        echo 'You do not have permission to complete this action.';
    }


?>