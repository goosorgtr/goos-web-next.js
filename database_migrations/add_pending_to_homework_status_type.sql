-- homework_status_type enum'ına 'pending' değerini ekle
-- Önce enum'ın mevcut değerlerini kontrol et ve 'pending' yoksa ekle
DO $$ 
BEGIN
    -- 'pending' değeri enum'da yoksa ekle
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'pending' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'homework_status_type')
    ) THEN
        ALTER TYPE homework_status_type ADD VALUE 'pending';
    END IF;
END $$;

