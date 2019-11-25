<?php

    class DataContainer
    {
        public $name, $columns, $rows;

        function __construct($name, $columns, $rows)
        {
            $this->name = $this->sanitize_name($name);
            $this->columns = $columns;
            $this->rows = $rows;
        }

        public function split_data_by_identifier($identifier_column_name)
        {
            $identifier_column_index = self::get_index_of_identifier_column($identifier_column_name);
            $splitted_data_containers = array();

            foreach($this->rows as $row)
            {
                $identifier = $row[$identifier_column_index];

                if(!isset($splitted_data_containers[$identifier]))
                {
                    $new_columns = $this->columns;

                    unset($new_columns[$identifier_column_index]);
                    $splitted_data_containers[$identifier] = new DataContainer($identifier, $new_columns, array());
                }

                unset($row[$identifier_column_index]);
                $splitted_data_containers[$identifier]->rows[] = $row;
            }

            return $splitted_data_containers;
        }

        public function render_data($max_render_count = 1000)
        {
            echo '<h2>';
            echo    $this->name;
            echo '</h2>';

            echo '<table>';
            echo '<tr>';
            
            foreach($this->columns as $col)
            {
                echo '<th>';
                echo    $col;
                echo '<th>';
            }
            
            echo '</tr>';
            
            $c = count($this->rows);
            for($i = max(0, $c - $max_render_count); $i < $c; $i++)
            {
                $row = $this->rows[$i];
                echo '<tr>';

                foreach($row as $val)
                {
                    echo '<td>';
                    echo    $val;
                    echo '<td>';
                }
            
                echo '</tr>';
            }

            echo '</table>';           
        }
    
        public function convert_to_data_to_csv($delimiter = ',')
        {
            $csv = implode($delimiter, $this->columns) . "\n";

            foreach($this->rows as $row)
            {
                $csv .= implode($delimiter, $row) . "\n";
            }

            return utf8_encode($csv);
        }

        private function get_index_of_identifier_column($identifier_column_name)
        {
            $c = count($this->columns);
            for($i = 0; $i < $c; $i++)
            {
                $col = $this->columns[$i];

                if($col == $identifier_column_name)
                {
                    return $i;
                }
            }

            return 0;
        }

        private function sanitize_name($name)
        {
            $name = str_replace(array('å', 'ä', 'á'), 'a', $name);
            $name = str_replace('ö', 'o', $name);
            $name = str_replace(array('é', 'ê', 'è'), 'e', $name);
            $name = str_replace('´', '', $name);
            $name = str_replace('&', '', $name);
            $name = str_replace('  ', ' ', $name);
            return trim(str_replace(array('<', '>', ':', '/', '\\', '|', '?', '*'), '-', $name));
        }
    }

?>