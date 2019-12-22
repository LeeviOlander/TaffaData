<?php
    include_once('core/php/includes.php');
    date_default_timezone_set('Europe/Helsinki');
    
    $date_format = 'Y-m-d H:i:s';

    $data_state_last_update_date_key = 'last_update_date';
    $data_state_last_update_start_date_key = 'last_update_start_date';

    $data_settings_update_frequency_in_hours_key = 'data_update_frequency_in_hours';

    $data_state_file_path = DATA_DIR . '/data-state.json';
    $data_settings_file_path = SERVER_PUBLIC_SETTINGS_DIR . '/data-settings.json';

    $data_settings = json_decode(file_get_contents($data_settings_file_path), true);
    $data_settings_update_frequency_in_hours = $data_settings[$data_settings_update_frequency_in_hours_key];

    $should_update = false;
    $current_date = new DateTime();

    if(file_exists($data_state_file_path))
    {
        $data_state = json_decode(file_get_contents($data_state_file_path), true);
        
        $last_update_string = $data_state[$data_state_last_update_date_key];

        if($last_update_string != '')
        {
            $last_update_date = DateTime::createFromFormat($date_format, $data_state[$data_state_last_update_date_key]);

            $difference = $last_update_date->diff($current_date);

            if($difference->h + $difference->days * 24 >= $data_settings_update_frequency_in_hours)
            {
                $should_update = true;
            }
        }
        else
        {
            $data_state[$data_state_last_update_start_date_key] = $current_date->format($date_format);
            file_put_contents($data_state_file_path, json_encode($data_state));

            $should_update = true;
        }

    }
    else
    {
        $should_update = true;
    }

    if($should_update)
    {
        Request::set_is_data_update_allowed(true);

        include_once(SERVER_DIR . '/update-data.php');
    }
    else
    {
        echo 'The data does not have to be updated.';
    }
    echo '<br>';
    echo 'The current data updating frequency is: ' . $data_settings_update_frequency_in_hours . ' hours. <br>';
    echo 'This setting can be changed manually in <strong>' . SERVER_PUBLIC_SETTINGS_DIR . '/data-settings.json' . '</strong>';
?>