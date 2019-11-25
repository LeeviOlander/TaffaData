<?php
    header('Content-type: application/json');

    include_once('core/php/includes.php');

    // Output keys
    $output_table_name_key = 'table_name';
    $output_table_columns_key = 'table_columns';

    $pdo = DbConnection::get_pdo_connection();

    $table_statement = $pdo->prepare("SHOW TABLES");
    $table_statement->execute();
    
    $tables = $table_statement->fetchAll(PDO::FETCH_NUM);
    
    $data = array();

    foreach($tables as $table)
    {
        $data_entry = array();

        $table_name = SqlWhitelist::get_whitelisted_table_name($table[0]);

        $table_columns_statement = $pdo->prepare("SHOW COLUMNS FROM $table_name");
        $table_columns_statement->execute();

        $table_columns = $table_columns_statement->fetchAll();

        $data_entry_columns = array();
        foreach($table_columns as $column)
        {
            $data_entry_columns[] = $column[0];
        }

        $data_entry[$output_table_name_key] = $table_name;
        $data_entry[$output_table_columns_key] = $data_entry_columns;

        $data[] = $data_entry;

    }

    echo json_encode($data);

?>