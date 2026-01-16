-- Ödev genel durumu için enum oluştur (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'homework_general_status') THEN
        CREATE TYPE homework_general_status AS ENUM (
          'active',      -- Aktif Ödev (teslim tarihi henüz gelmedi)
          'pending',    -- Bekliyor (teslim tarihi geçti/geldi, notlandırılmayı bekliyor)
          'graded'      -- Notlandırıldı (tüm öğrenciler notlandırıldı)
        );
    END IF;
END $$;

-- homeworks tablosuna general_status kolonu ekle (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'homeworks' AND column_name = 'general_status'
    ) THEN
        ALTER TABLE homeworks 
        ADD COLUMN general_status homework_general_status DEFAULT 'active';
    END IF;
END $$;

-- Mevcut kayıtları güncelle (teslim tarihine göre)
UPDATE homeworks 
SET general_status = CASE
  WHEN due_date > CURRENT_DATE THEN 'active'::homework_general_status
  ELSE 'pending'::homework_general_status
END
WHERE general_status IS NULL;

