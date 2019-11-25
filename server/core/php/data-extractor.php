<?php

    class DataExtractor
    {
        private static $product_data_query_path = SERVER_CORE_DIR . '/sql/product-data-query.sql';
        private static $product_category_data_query_path = SERVER_CORE_DIR . '/sql/product-category-data-query.sql';

        public static function get_sales_data_by_product()
        {
            return self::get_data_by_query('Data by Product', file_get_contents(self::$product_data_query_path));
        }

        public static function get_sales_data_by_category()
        {
            return self::get_data_by_query('Data by category', file_get_contents(self::$product_category_data_query_path));
        }

        private static function get_data_by_query($data_container_name, $query_string)
        {
            $pdo = DbConnection::get_pdo_connection();

            $data_statement = $pdo->prepare($query_string);
            $data_statement->execute();
    
            $data_rows = $data_statement->fetchAll(PDO::FETCH_NUM);
    
            $data_columns = array();
            $column_count = $data_statement->columnCount();

            
            for($i = 0; $i < $column_count; $i++)
            {
                $col = $data_statement->getColumnMeta($i);
            
                $data_columns[] = $col['name'];
            }
            
            return new DataContainer($data_container_name, $data_columns, $data_rows);
        }

    }

?>