SELECT forsaljning.datum AS "date", matratt.namn_eng AS food_name, produkt.namn AS product_name, kundkategori.namn_eng AS customer_category, forsaljning.antal AS quantity_sold, forsaljning.forsaljning AS revenue, COALESCE(pebble.happy, -1) AS positive_feedback, COALESCE(pebble.sad, -1) AS negative_feedback
FROM tbl_forsaljnings_data forsaljning
    INNER JOIN tbl_produkt_register produkt ON produkt.produkt_nummer = forsaljning.produkt_nummer
    INNER JOIN tbl_kundkategorier kundkategori ON kundkategori.kategori_id = produkt.kategori
    INNER JOIN tbl_matratts_lista matratt ON matratt.matratts_typ = produkt.matratts_typ
    INNER JOIN tbl_dagens_meny dag ON dag.datum = forsaljning.datum AND dag.matratts_id = matratt.matratts_id
    LEFT JOIN tbl_pebble pebble ON pebble.datum = forsaljning.datum
ORDER BY forsaljning.datum;
