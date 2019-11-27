<?php
    include_once('core/php/includes.php');
    ini_set('memory_limit', '1024M');

    session_start();

    if(!(Session::is_data_update_allowed() || Session::has_admin_access()))
    {
        echo 'Error: Data update not authenticated!';
        exit();
    }

    $product_list_json_path = DATA_RAW_DIR . '/product-list.json';
    $product_list_jsed_path = DATA_JSED_DIR . '/product-list.jsed';
    
    $category_list_json_path = DATA_RAW_DIR . '/category-list.json';
    $category_list_jsed_path = DATA_JSED_DIR . '/category-list.jsed';

    $product_names = array();
    $product_data_containers = DataExtractor::get_sales_data_by_product()->split_data_by_identifier('food_name');

    foreach($product_data_containers as $pdc)
    {
        $product_names[] = $pdc->name;

        $zip_file_path = DATA_RAW_DIR . '/products/' . $pdc->name . ZIP_EXT;
        $jsed_file_path = DATA_JSED_DIR . '/products/' . $pdc->name . JSED_EXT;

        $jsed_input_datas = array(new JsedInputData('sales-data' . CSV_EXT, CSV_EXT, $pdc->convert_to_data_to_csv()));

        Jsed::write_jsed_base64_zipped_data($zip_file_path, $jsed_file_path, $jsed_input_datas);

    }
    
    file_put_contents($product_list_json_path, json_encode($product_names));
    Jsed::write_jsed_base64_json($product_list_jsed_path, $product_names);

    $category_names = array();
    $category_data_containers = DataExtractor::get_sales_data_by_category()->split_data_by_identifier('product_name');


    foreach($category_data_containers as $cdc)
    {
        $category_names[] = $cdc->name;

        $zip_file_path = DATA_RAW_DIR . '/categories/' . $cdc->name . ZIP_EXT;
        $jsed_file_path = DATA_JSED_DIR . '/categories/' . $cdc->name . JSED_EXT;

        $jsed_input_datas = array(new JsedInputData('sales-data' . CSV_EXT, CSV_EXT, $cdc->convert_to_data_to_csv()));

        Jsed::write_jsed_base64_zipped_data($zip_file_path, $jsed_file_path, $jsed_input_datas);
    }
    
    file_put_contents($category_list_json_path, json_encode($category_names));
    Jsed::write_jsed_base64_json($category_list_jsed_path, $category_names);

    echo 'Data update completed!';
?>