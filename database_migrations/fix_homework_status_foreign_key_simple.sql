-- Basit çözüm: homework_status tablosundaki foreign key constraint'ini güncelle
-- Önce constraint'i kaldır (eğer varsa)

-- ÖNEMLİ: Önce yukarıdaki check_homework_status_constraints.sql dosyasını çalıştırın
-- ve constraint adını kontrol edin!

-- Constraint adını kontrol et ve kaldır (farklı constraint adları olabilir)
DO $$ 
DECLARE
    constraint_name_var TEXT;
BEGIN
    -- homework_id ile ilgili tüm foreign key constraint'lerini bul ve kaldır
    FOR constraint_name_var IN
        SELECT tc.constraint_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public'
            AND tc.table_name = 'homework_status'
            AND tc.constraint_type = 'FOREIGN KEY'
            AND kcu.column_name = 'homework_id'
    LOOP
        EXECUTE format('ALTER TABLE homework_status DROP CONSTRAINT IF EXISTS %I', constraint_name_var);
        RAISE NOTICE 'Constraint dropped: %', constraint_name_var;
    END LOOP;
END $$;

-- Yeni constraint'i ON DELETE CASCADE ile ekle
ALTER TABLE homework_status 
ADD CONSTRAINT homework_status_homework_id_fkey 
FOREIGN KEY (homework_id) 
REFERENCES homeworks(id) 
ON DELETE CASCADE;

