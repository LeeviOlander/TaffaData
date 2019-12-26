<?php

    $username_post_parameter = 'username';
    $password_post_parameter = 'password';
    
    $authentication_settings_ldap_server_url_key = 'ldap_server_url';
    $authentication_settings_ldap_server_port_key = 'ldap_server_port';
    $authentication_settings_ldap_user_template_dn_key = 'ldap_user_dn_template';
    $authentication_settings_ldap_search_dn_key = 'ldap_search_dn';
    $authentication_settings_ldap_search_uid_template_key = 'ldap_search_uid_template';
    $authentication_settings_users_with_admin_access_key = 'users_with_admin_access';
    $authentication_settings_independently_authenticated_users_key = 'independently_authenticated_users';

    $authentication_settings_file_path = SERVER_SECRET_SETTINGS_DIR . '/authentication-settings.json';

    $authentication_failed = false;
    $authentication_error_message = '';

    function print_array_recursively($array)
    {
        foreach($array as $key => $val)
        {
            echo '<div style="background: rgba(0,0,0,0.1); padding:10px">';
            echo $key . ' => ' . $val . '(' . gettype($val) . ')' .  '<br>';

            if(is_array($val))
            {
                print_array_recursively($val);
            }
            echo '</div>';

             
        }
    }

    if(isset($_POST[$username_post_parameter]) && isset($_POST[$password_post_parameter]))
    {
        $posted_username = $_POST[$username_post_parameter];
        $posted_password = $_POST[$password_post_parameter];

        $authentication_settings = json_decode(file_get_contents($authentication_settings_file_path), true);
        
        $users_with_admin_access = $authentication_settings[$authentication_settings_users_with_admin_access_key];
        $independently_authenticated_users = $authentication_settings[$authentication_settings_independently_authenticated_users_key];

        if(isset($independently_authenticated_users[$posted_username]))
        {
            $user_properties = $independently_authenticated_users[$posted_username];
            
            if($user_properties['password'] == $posted_password)
            {
                Session::set_is_signed_in($posted_username);
                Session::set_has_admin_access($user_properties['admin_access']);

                header('Location: ' . $_SERVER['REQUEST_URI']);
                exit();
            }
        }
        else
        {
            $ldap_host = $authentication_settings[$authentication_settings_ldap_server_url_key];
            $ldap_port = $authentication_settings[$authentication_settings_ldap_server_port_key];
            $ldap_rdn = str_replace('{REPLACE WITH USERNAME}', $posted_username, $authentication_settings[$authentication_settings_ldap_user_template_dn_key]);
            $ldap_conn = ldap_connect($ldap_host, $ldap_port);

            ldap_set_option($ldap_conn, LDAP_OPT_PROTOCOL_VERSION, 3);
            ldap_set_option($ldap_conn, LDAP_OPT_REFERRALS, 0);

            ldap_start_tls($ldap_conn);

            $ldap_bind = @ldap_bind($ldap_conn, $ldap_rdn, $posted_password);

            if($ldap_bind)
            {
                Session::set_is_signed_in($posted_username);

                if(in_array($posted_username, $users_with_admin_access))
                {
                    Session::set_has_admin_access(true);
                }

                header('Location: ' . $_SERVER['REQUEST_URI']);
                exit();

                // THE LDAP CODE BELOW DOES NOT WORK
                // FUCK IT
                // LDAP SUCKS

                $results = ldap_search($ldap_conn, $authentication_settings[$authentication_settings_ldap_search_dn_key], str_replace('{REPLACE WITH USERNAME}', $posted_username, $authentication_settings[$authentication_settings_ldap_search_uid_template_key]));
                $entries = ldap_get_entries($ldap_conn, $results);

                if($entries['count'] != 0)
                {
                    Session::set_is_signed_in($posted_username);

                    if(in_array($posted_username, $users_with_admin_access))
                    {
                        Session::set_has_admin_access(true);
                    }

                    header('Location: ' . $_SERVER['REQUEST_URI']);
                    exit();
                }
                else
                {
                    $authentication_error_message = 'Login credentials correct, but access not granted.';
                }
            }
        }

        $authentication_failed = true;
    }

    $form_username_value = '';
    
    if(isset($_POST[$username_post_parameter]))
    {
        $form_username_value = $_POST[$username_post_parameter];
    }
?>

<html>

<head>

    <title>
        TäffäData
    </title>

    <meta name="theme-color" content="#317EFB" />
    <meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <style>
        <?php 
            // Include the raw content of Bootstrap css to bypass authentication
            // Alternatively, the authentication could be disabled for css files, but
            // this is a simpler approach and leaves less for interpretation.
            echo file_get_contents(ROOT_DIR . '/core/lib/bootstrap/css/bootstrap.min.css');
        ?>
    </style>
</head>

<body>

    <div class="container h-100 d-flex justify-content-center">
        <div style="padding-top: 20%; max-width: 100%">
            <div class="card bg-light mb-3" style="width: 30rem; max-width: 100%">
                <div class="card-header">
                    <h2 style="margin: 0">
                        TäffäData Authentication
                    </h2>
                    <small>
                        Sign in with your 

                        <a href="https://medlem.teknologforeningen.fi">
                            <strong>
                                Teknologföreningen account
                            </strong>
                        </a> 

                        to access TäffäData.
                    </small>
                </div>
                <div class="card-body">
                    <form style="margin: 0" method="post">
                        <label>
                            <strong>Username</strong>
                        </label>
                        <input type="text" class="form-control" value="<?php echo $form_username_value; ?>" name="<?php echo $username_post_parameter; ?>">

                        <br>

                        <label>
                            <strong>Password</strong>
                        </label>
                        <input type="password" class="form-control" name="<?php echo $password_post_parameter; ?>">

                        <br>
                        <input type="submit" value="Sign In" class="btn btn-primary">

                        <?php
                            
                            if($authentication_failed)
                            {
                                echo '<br><br>';
                                echo '<div class="alert alert-danger" role="alert">';
                                echo    '<strong>Error:</strong> Authentication failed! ';
                                echo    $authentication_error_message;
                                echo '</div>';
                            }

                        ?>

                    </form>
                </div>
            </div>
        </div>
    </div>

</body>

</html>

