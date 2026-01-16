-- homework_status tablosundaki foreign key constraint'ini güncelle
-- Ödev silindiğinde tüm homework_status kayıtları da silinsin (CASCADE)

-- Önce mevcut constraint'leri bul ve kaldır
DO $$ 
DECLARE
    constraint_name_var TEXT;
BEGIN
    -- homework_status tablosundaki homework_id ile ilgili tüm foreign key constraint'lerini bul
    FOR constraint_name_var IN
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'homework_status'
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name LIKE '%homework_id%'
    LOOP
        EXECUTE format('ALTER TABLE homework_status DROP CONSTRAINT IF EXISTS %I', constraint_name_var);
    END LOOP;
END $$;

-- Yeni constraint'i ON DELETE CASCADE ile ekle
DO $$ 
BEGIN
    -- Eğer constraint zaten yoksa ekle
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'homework_status_homework_id_fkey'
        AND table_name = 'homework_status'
    ) THEN
        ALTER TABLE homework_status 
        ADD CONSTRAINT homework_status_homework_id_fkey 
        FOREIGN KEY (homework_id) 
        REFERENCES homeworks(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

