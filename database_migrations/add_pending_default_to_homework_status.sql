-- homework_status tablosundaki status kolonunun default değerini 'pending' yap
-- Bu dosyayı enum değeri eklendikten SONRA çalıştırın
DO $$ 
BEGIN
    -- Default değer zaten 'pending' değilse güncelle
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'homework_status' 
        AND column_name = 'status'
        AND (column_default IS NULL OR column_default != '''pending''::homework_status_type')
    ) THEN
        ALTER TABLE homework_status 
        ALTER COLUMN status SET DEFAULT 'pending'::homework_status_type;
    END IF;
END $$;

