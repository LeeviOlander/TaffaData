<?php

    $current_dir = dirname(__FILE__);

    include_once($current_dir . '/config.php');

    include_once(SERVER_CORE_DIR . '/php/db-connection.php');
    include_once(SERVER_CORE_DIR . '/php/request-parameter-checker.php');
    include_once(SERVER_CORE_DIR . '/php/sql-whitelist.php');
    include_once(SERVER_CORE_DIR . '/php/data-extractor.php');
    include_once(SERVER_CORE_DIR . '/php/data-container.php');
    include_once(SERVER_CORE_DIR . '/php/jsed.php');
    include_once(SERVER_CORE_DIR . '/php/jsed-input-data.php');
    include_once(SERVER_CORE_DIR . '/php/session.php');
    include_once(SERVER_CORE_DIR . '/php/authentication.php');
    include_once(SERVER_CORE_DIR . '/php/request.php');
    include_once(SERVER_CORE_DIR . '/php/functions.php');
    include_once(SERVER_CORE_DIR . '/php/hzip.php');


?>