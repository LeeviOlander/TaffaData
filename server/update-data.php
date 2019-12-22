<?php
    include_once('core/php/includes.php');
    ini_set('memory_limit', '1024M');
    date_default_timezone_set('Europe/Helsinki');

    if(!(Request::is_data_update_allowed() || Session::has_admin_access()))
    {
        echo 'Error: Data update not authenticated!';
        exit();
    }

    $date_format = 'Y-m-d H:i:s';
    $current_date = new DateTime();

    $dev_app_zip_path = ROOT_DIR . '/dev.zip';
    $data_package_path = DATA_DIR . '/data-package.zip';
    
    if(file_exists($dev_app_zip_path))
    {   
        unlink($dev_app_zip_path);
    }

    HZip::zipDir(ROOT_DIR, $dev_app_zip_path, array(SERVER_SECRET_SETTINGS_DIR . '/authentication-settings.json', SERVER_SECRET_SETTINGS_DIR . '/database-settings.json'));
    exit();

    $data_state_last_update_date_key = 'last_update_date';
    $data_state_last_update_start_date_key = 'last_update_start_date';

    $data_state_file_path = DATA_DIR . '/data-state.json';
    
    $product_list_json_path = DATA_RAW_DIR . '/product-list.json';
    $product_list_jsed_path = DATA_JSED_DIR . '/product-list.jsed';
    
    $category_list_json_path = DATA_RAW_DIR . '/category-list.json';
    $category_list_jsed_path = DATA_JSED_DIR . '/category-list.jsed';

    $product_names = array();
    $product_data_containers = DataExtractor::get_sales_data_by_product()->split_data_by_identifier('food_name');
    
    if(file_exists($data_state_file_path))
    {
        $data_state = json_decode(file_get_contents($data_state_file_path), true);
        $data_state[$data_state_last_update_start_date_key] = $current_date->format($date_format);
        file_put_contents($data_state_file_path, json_encode($data_state));
    }
    else
    {
        $data_state = array();
        $data_state[$data_state_last_update_start_date_key] = $current_date->format($date_format);
        file_put_contents($data_state_file_path, json_encode($data_state));
    }

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
    

    $raw_data_file_paths = Functions::recursive_glob(DATA_RAW_DIR . '/*');

    if(file_exists($data_package_path))
    {   
        unlink($data_package_path);
    }

    HZip::zipDir(DATA_RAW_DIR, $data_package_path);

    
    $current_date = new DateTime();

    $data_state = json_decode(file_get_contents($data_state_file_path), true);
    $data_state[$data_state_last_update_date_key] = $current_date->format($date_format);
    file_put_contents($data_state_file_path, json_encode($data_state));

    if(file_exists($dev_app_zip_path))
    {   
        unlink($dev_app_zip_path);
    }

    HZip::zipDir(ROOT_DIR, $dev_app_zip_path, array(SERVER_SECRET_SETTINGS_DIR . '/authentication-settings.json', SERVER_SECRET_SETTINGS_DIR . '/database-settings.json'));

    echo 'Data update completed!';
    
?>