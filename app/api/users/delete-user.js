// app/api/users/delete-user.js (pages router approach)
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // Only allow DELETE method
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    console.log('Received request to delete user ID:', userId);

    if (!userId) {
      console.log('Missing userId in request');
      return res.status(400).json({ error: 'กรุณาระบุรหัสผู้ใช้' });
    }

    // Create the database connection
    console.log('Connecting to database...');
    const connection = await mysql.createConnection(process.env.MYSQL_URI);
    console.log('Database connection established');
    
    // Execute the delete query
    console.log('Executing delete query for user ID:', userId);
    const [result] = await connection.execute(
      'DELETE FROM Users WHERE User_ID = ?', 
      [userId]
    );
    
    // Close the connection
    await connection.end();
    console.log('Database connection closed');
    
    console.log('Delete operation result:', result);

    if (result.affectedRows > 0) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ error: 'ไม่พบบัญชีผู้ใช้' });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ 
      error: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์', 
      details: error.message
    });
  }
}