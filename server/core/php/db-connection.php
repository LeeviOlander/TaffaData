<?php

    class DbConnection
    {
        private static $server_name, $user_name, $password, $db_name;

        private static $server_name_key = 'server_name';
        private static $user_name_key = 'user_name';
        private static $db_name_key = 'database_name';
        private static $password_key = 'password';

        private static $public_settings_json_file_name = SERVER_PUBLIC_SETTINGS_DIR . '/database-settings.json';
        private static $secret_settings_json_file_name = SERVER_SECRET_SETTINGS_DIR . '/database-settings.json';

        public static function initialize()
        {
            $public_settings = json_decode(file_get_contents(self::$public_settings_json_file_name), true);
			$secret_settings = json_decode(file_get_contents(self::$secret_settings_json_file_name), true);

			self::$server_name = $secret_settings[self::$server_name_key];
			self::$user_name = $secret_settings[self::$user_name_key];
            self::$db_name = $secret_settings[self::$db_name_key];
            
            self::$password = $secret_settings[self::$password_key];
        }

        public static function get_pdo_connection()
        {
            $server_name = self::$server_name;
            $user_name = self::$user_name;
            $password = self::$password; 
            $db_name = self::$db_name;

            $pdo = new PDO("mysql:host=$server_name; dbname=$db_name; charset=utf8", $user_name, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );

            return $pdo;
        }
    }

    DbConnection::initialize();

?>