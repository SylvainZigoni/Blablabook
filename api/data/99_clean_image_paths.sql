-- Nettoyage des chemins d'images après le seed
-- Remplace 'api/public/images/' par rien pour ne garder que le nom du fichier

UPDATE book
SET image_url = REPLACE(image_url, 'api/public/images/', '')
WHERE image_url LIKE 'api/public/images/%';

-- Afficher un message de confirmation
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO updated_count
    FROM book
    WHERE image_url NOT LIKE 'api/public/images/%';

    RAISE NOTICE 'Chemins d''images nettoyés : % livres mis à jour', updated_count;
END $$;
