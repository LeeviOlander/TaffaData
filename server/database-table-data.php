<?php
    header('Content-type: application/json');

    include_once('core/php/includes.php');

    // Get parameters
    $table_name_get_parameter = 'table-name';

    // Output keys
    $output_column_names_key = 'column_names';
    $output_data_entries_key = 'data_entries';

    RequestParameterChecker::check_get_parameters_or_exit(array($table_name_get_parameter));

    $table_name = SqlWhitelist::get_whitelisted_table_name($_GET[$table_name_get_parameter]);

    $pdo = DbConnection::get_pdo_connection();

    $data_statement = $pdo->prepare("SELECT * FROM $table_name");
    $data_statement->execute();
    
    $data_rows = $data_statement->fetchAll(PDO::FETCH_NUM);
    
    $column_count = $data_statement->columnCount();

    $output_data = array();
    $output_data_entries = array();
    $output_data_column_names = array();

    for($i = 0; $i < $column_count; $i++)
    {
        $col = $data_statement->getColumnMeta($i);
        
        $output_data_column_names[] = $col['name'];
    }

    // Rewrite the data in the array itself to save memory
    $c = count($data_rows);
    for($i = 0; $i < $c; $i++)
    {
        for($j = 0; $j < $column_count; $j++)
        {
           $data_rows[$i][$j] = $data_rows[$i][$j];
        }
    }

    $output_data[$output_column_names_key] = $output_data_column_names;
    $output_data[$output_data_entries_key] = $data_rows;

    echo json_encode($output_data);
    
?>