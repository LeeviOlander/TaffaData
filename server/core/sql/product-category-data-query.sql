SELECT forsaljning.datum AS "date", produkt.namn AS product_name, kundkategori.namn_eng AS customer_category, forsaljning.antal AS amount_sold, COALESCE(pebble.happy, -1) AS positive_feedback, COALESCE(pebble.sad, -1) AS negative_feedback
FROM tbl_forsaljnings_data forsaljning
    INNER JOIN tbl_produkt_register produkt ON produkt.produkt_nummer = forsaljning.produkt_nummer
    INNER JOIN tbl_kundkategorier kundkategori ON kundkategori.kategori_id = produkt.kategori
    LEFT JOIN tbl_pebble pebble ON pebble.datum = forsaljning.datum
ORDER BY forsaljning.datum;
