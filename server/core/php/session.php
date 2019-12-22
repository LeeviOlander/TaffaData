<?php

    class Session
    {
        private static $username_session_key = 'username';
        private static $admin_access_session_key = 'admin';

        public static function has_admin_access()
        {
            return isset($_SESSION[self::$admin_access_session_key]) && $_SESSION[self::$admin_access_session_key] == true;
        }
        public static function set_has_admin_access($value)
        {
            $_SESSION[self::$admin_access_session_key] = $value;
        }

        public static function is_signed_in()
        {
            return isset($_SESSION[self::$username_session_key]);
        }

        public static function set_is_signed_in($username)
        {
            $_SESSION[self::$username_session_key] = $username;
        }

    }
    if (session_status() == PHP_SESSION_NONE) 
    {
        session_start();
    }
?>