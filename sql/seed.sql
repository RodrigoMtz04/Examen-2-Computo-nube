USE ihealth;

INSERT INTO products (code, name, price) VALUES
  ('i100', 'iHealth100', 99.00),
  ('i500', 'iHealth500', 149.00)
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price);

