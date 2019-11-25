<?php
    include_once('core/php/includes.php');

    echo '<h1>';
    echo    'Database Info';
    echo '</h1>';

    $pdo = DbConnection::get_pdo_connection();

    echo '<h2>';
    echo    'Version';
    echo '</h2>';

    echo $pdo->query('select version()')->fetchColumn();

    echo '<h2>';
    echo    'Encoding';
    echo '</h2>';

    $encodings = $pdo->query("SHOW variables LIKE 'character_set_database'")->fetchAll(PDO::FETCH_NUM);

    foreach($encodings as $encoding)
    {
        $str = '';

        foreach($encoding as $value)
        {
            $str .= $value . ' ';
        }
        
        echo $str;
    }
?>