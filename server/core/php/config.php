<?php

	define('ROOT_DIR', str_replace('\\', '/', dirname(dirname(dirname(dirname(__FILE__))))));

	define('DATA_DIR', ROOT_DIR . '/data');
	define('DATA_RAW_DIR', DATA_DIR . '/raw');
	define('DATA_JSED_DIR', DATA_DIR . '/jsed');
	
	define('SERVER_DIR', ROOT_DIR . '/server');
	define('SERVER_CORE_DIR', SERVER_DIR . '/core');
	define('SERVER_PUBLIC_SETTINGS_DIR', SERVER_DIR . '/public-settings');
	define('SERVER_SECRET_SETTINGS_DIR', SERVER_DIR . '/secret-settings');

	define('ZIP_EXT', '.zip');
	define('CSV_EXT', '.csv');
	define('JSED_EXT', '.jsed');
	define('JSON_EXT', '.json');
?>