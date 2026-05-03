import mysql from 'mysql2';

export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // put your MySQL password if you have one
  database: 'databuild_website'
});

db.connect((err) => {
  if (err) {
    console.log('❌ MySQL connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});