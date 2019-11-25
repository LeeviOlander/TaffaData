<?php

    class JsedInputData
    {
        public $file_name, $file_extension, $data;

        function __construct($file_name, $file_extension, $data)
        {
            $this->file_name = $file_name;
            $this->file_extension = $file_extension;
            $this->data = $data;
        }
    }

?>