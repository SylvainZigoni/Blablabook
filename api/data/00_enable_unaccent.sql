-- Activation de l'extension unaccent pour la recherche insensible aux accents
-- Ce script s'exécute automatiquement au premier démarrage de la base de données

CREATE EXTENSION IF NOT EXISTS unaccent;

-- Test de l'extension (optionnel, juste pour vérifier dans les logs)
DO $$
BEGIN
    RAISE NOTICE 'Extension unaccent activée avec succès';
END $$;
