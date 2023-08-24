import 'dotenv/config';
import sql from 'mysql2';
const connection = sql.createPool({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DATABASE
});
export default connection;