<?php

    class SqlWhitelist
    {
        public static function get_whitelisted_table_name($table_name)
        {
            // Replace anything that isn't 0-9a-zA-Z_ 
            return preg_replace('/[^0-9a-zA-Z_]/', '', $table_name);   
        }
    }

?>