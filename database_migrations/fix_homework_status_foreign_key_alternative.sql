-- Alternatif çözüm: Tüm foreign key constraint'lerini kontrol et ve güncelle
-- homework_status tablosundaki foreign key constraint'ini güncelle

-- Önce mevcut tüm foreign key constraint'lerini listele (debug için)
-- SELECT constraint_name, table_name 
-- FROM information_schema.table_constraints 
-- WHERE table_name = 'homework_status' AND constraint_type = 'FOREIGN KEY';

-- Tüm homework_id ile ilgili foreign key constraint'lerini kaldır
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_schema = 'public'
        AND table_name = 'homework_status'
        AND constraint_type = 'FOREIGN KEY'
    LOOP
        -- Eğer constraint homework_id ile ilgiliyse kaldır
        IF EXISTS (
            SELECT 1 
            FROM information_schema.key_column_usage 
            WHERE constraint_name = r.constraint_name 
            AND table_name = 'homework_status'
            AND column_name = 'homework_id'
        ) THEN
            EXECUTE format('ALTER TABLE homework_status DROP CONSTRAINT IF EXISTS %I', r.constraint_name);
        END IF;
    END LOOP;
END $$;

-- Yeni constraint'i ON DELETE CASCADE ile ekle
ALTER TABLE homework_status 
ADD CONSTRAINT homework_status_homework_id_fkey 
FOREIGN KEY (homework_id) 
REFERENCES homeworks(id) 
ON DELETE CASCADE;

