<?php

    $username_post_parameter = 'username';
    $password_post_parameter = 'password';
    
    $authentication_settings_file_path = SERVER_SECRET_SETTINGS_DIR . '/authentication-settings.json';

    $authentication_failed = false;

    if(isset($_POST[$username_post_parameter]) && isset($_POST[$password_post_parameter]))
    {

        $posted_username = $_POST[$username_post_parameter];
        $posted_password = $_POST[$password_post_parameter];

        $authentication_settings = json_decode(file_get_contents($authentication_settings_file_path), true);
        
        $users_with_admin_access = $authentication_settings['users_with_admin_access'];
        $independently_authenticated_users = $authentication_settings['independently_authenticated_users'];

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
            // LDAP SHIT
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
                                echo    '<strong>Error:</strong> Authentication failed!';
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

