<?php

    class Functions
    {
        public static function recursive_glob($pattern, $flags = 0) 
        {
            $files = glob($pattern, $flags); 
            foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir) 
            {
                $files = array_merge($files, self::recursive_glob($dir . '/' . basename($pattern), $flags));
            }
            return $files;
        }
    }
    
?>