-- homework_general_status enum'ına 'waiting_for_grading' değerini ekle
-- Bu değer: Teslim tarihi geçti/geldi ama henüz notlandırılmadı

DO $$ 
BEGIN
    -- Enum'a yeni değer ekle (eğer yoksa)
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'waiting_for_grading' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'homework_general_status')
    ) THEN
        ALTER TYPE homework_general_status ADD VALUE 'waiting_for_grading';
    END IF;
END $$;

