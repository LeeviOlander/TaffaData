<?php

    class RequestParameterChecker
    {
        public static function check_get_parameters_or_exit($get_parameters, $exit_message = "<p>Invalid get parameters. Exiting. </p>")
        {
            foreach($get_parameters as $get_parameter)
            {
                if(!isset($_GET[$get_parameter]))
                {
                    echo $exit_message;    
                    exit();
                }
            }
        }   

        public static function check_post_parameters_or_exit($post_parameters, $exit_message = "<p>Invalid post parameters. Exiting. </p>")
        {
            foreach($post_parameters as $post_parameter)
            {
                if(!isset($_POST[$post_parameter]))
                {
                    echo $exit_message;    
                    exit();
                }
            }
        }   
    }

?>