-- general_status kolonunun default değerini 'pending' olarak güncelle
ALTER TABLE homeworks 
ALTER COLUMN general_status SET DEFAULT 'pending'::homework_general_status;

