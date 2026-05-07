const db = require('../config/database');

const UserModel = {
  async findByEmail(email) {
    return await db.asyncGet('SELECT * FROM users WHERE email = ?', [email]);
  },

  async findById(id) {
    return await db.asyncGet('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
  },

  async create({ name, email, password, role }) {
    const result = await db.asyncRun('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role]);
    return { id: result.lastID, name, email, role };
  },

  async getAllPatients() {
    return await db.asyncAll("SELECT id, name, email FROM users WHERE role = 'patient'");
  }
};

module.exports = UserModel;
