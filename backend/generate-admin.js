const bcrypt = require('bcryptjs');

// Generate hash for password: admin123
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nRun this SQL in Supabase:');
console.log(`
-- Delete old admin if exists
DELETE FROM users WHERE email = 'admin@eventnexus.com';

-- Insert admin with correct password hash
INSERT INTO users (email, password, name, role) 
VALUES ('admin@eventnexus.com', '${hash}', 'Admin User', 'admin');
`);
