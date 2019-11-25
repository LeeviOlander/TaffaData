<?php

    class Jsed
    {
        // JSED = JavaScript Encoded Data

        private static $jsed_delimiter = "\0";

        public static function get_jsed_base64_zipped_data($zip_file_path, $jsed_input_datas, $overwrite_existing_zip_file = true, $delete_generated_zip_file = false)
        {
            self::create_file_directory_if_not_exists($zip_file_path);

            $zip = new ZipArchive();

            $zip_mode = ZipArchive::CREATE;

            if($overwrite_existing_zip_file && file_exists($zip_file_path))
            {
                $zip_mode = ZipArchive::OVERWRITE; 
            }

            if ($zip->open($zip_file_path, $zip_mode) !== TRUE) 
	        {
		        exit("Cannot open $zip_file_path file.");
	        }
	        else
	        {
                $conversion = 'zip';
                $encodings = array('base64');
                $file_names = array();
                $file_extensions = array();

                foreach($jsed_input_datas as $jsed_input_data)
                {
                    if(self::is_valid_jsed_file_name($jsed_input_data->file_name))
                    {
                        $file_names[] = $jsed_input_data->file_name;
                        $file_extensions[] = $jsed_input_data->file_extension;

		                $zip->addFromString($jsed_input_data->file_name, $jsed_input_data->data);
                    }
                    else
                    {
                        exit("Invalid jsed file name: '$jsed_input_data->file_name' ! No quotation marks allowed (\")!");
                    }
                }
		        $zip->close();

                $jsed = self::get_jsed_data($conversion, $encodings, $file_names, $file_extensions, base64_encode(file_get_contents($zip_file_path)));

                if($delete_generated_zip_file)
                {
                    unlink($zip_file_path);
                }

                return $jsed;
	        }

            return "";
        }

        public static function write_jsed_base64_zipped_data($zip_file_path, $jsed_file_path, $jsed_input_datas, $overwrite_existing_zip_file = true, $delete_generated_zip_file = false)
        {
            self::create_file_directory_if_not_exists($jsed_file_path);

            $jsed = self::get_jsed_base64_zipped_data($zip_file_path, $jsed_input_datas, $overwrite_existing_zip_file, $delete_generated_zip_file);
            file_put_contents($jsed_file_path, $jsed);
        }

        public static function write_jsed_base64_json($jsed_file_path, $data)
        {
            file_put_contents($jsed_file_path, self::get_jsed_data('file', array('base64'), array(basename($jsed_file_path, JSED_EXT) . JSON_EXT), array(JSON_EXT), base64_encode(json_encode($data))));
        }

        private static function get_jsed_data($conversion_function, $encodings, $file_names, $file_extensions, $data)
        {
            $jsed_encodings = '';
            $jsed_file_names = '';
            $jsed_file_extensions = '';
            
            foreach($encodings as $encoding)
            {
                $jsed_encodings .= $encoding . self::$jsed_delimiter;
            }
            
            foreach($file_names as $file_name)
            {
                $jsed_file_names .= $file_name . self::$jsed_delimiter;
            }

            foreach($file_extensions as $file_ext)
            {
                $jsed_file_extensions .= str_replace('.', '', $file_ext . self::$jsed_delimiter);
            }

            $jsed = 'JSED.execute(currentExecutingScript(), "' . $conversion_function . '", "' . $jsed_encodings . '", "' . $jsed_file_names . '", "' . $jsed_file_extensions . '", "' . $data . '");';
            return $jsed;
        }

        private static function create_file_directory_if_not_exists($file_path)
        {
            $directory = dirname($file_path);

            if(!file_exists($directory))
            {
                mkdir($directory, 0777, true);
            }
        }

        private static function is_valid_jsed_file_name($file_path)
        {
            return strpos($file_path, '"') === false;
        }
    }

?>