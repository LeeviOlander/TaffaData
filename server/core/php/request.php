<?php

    class Request
    {
        private static $data_update_allowed = false;

        public static function is_data_update_allowed()
        {
            return self::$data_update_allowed;
        }
        public static function set_is_data_update_allowed($value)
        {
            self::$data_update_allowed = $value;
        }

    }
?>