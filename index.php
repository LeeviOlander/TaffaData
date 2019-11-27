<?php

    include_once('server/core/php/config.php');
    include_once('server/core/php/session.php');
    include_once('server/core/php/authentication.php');

    // Should match with the value in .htaccess
    $requested_resource_get_parameter = 'resource';
    
    // Default to index.html
    $requested_resource = 'index.html';

    if(isset($_GET[$requested_resource_get_parameter]))
    {
        $get_val = $_GET[$requested_resource_get_parameter];;

        if(trim($get_val) != '')
        {
            $requested_resource = $get_val;
        }
    }

    if(!Authentication::is_authenticated())
    {
        Authentication::redirect_to_authentication($requested_resource);
        exit();
    }
    else
    {
    
        if(file_exists($requested_resource))
        {
            $requested_resource_file_extension = pathinfo($requested_resource, PATHINFO_EXTENSION);

            if($requested_resource_file_extension == 'php')
            {
                include_once($requested_resource);
                exit();
            }
            else
            {
                Authentication::send_file($requested_resource);
                exit();
            }

        }   
        else
        {
            header('HTTP/1.0 404 Not Found');
            exit();
        }
    }

?>