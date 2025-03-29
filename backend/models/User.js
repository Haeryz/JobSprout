/**
 * User Model - Defines the user schema and structure
 * This model only defines what the data looks like, not how to interact with the database
 */
class User {
  // Required fields
  id = null;         // string (UUID)
  email = '';        // string (required, unique)
  name = '';         // string (optional)
  created_at = null; // timestamp
  updated_at = null; // timestamp

  /**
   * Create a new User instance
   * @param {Object} data - User data
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.name = data.name || '';
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  /**
   * Convert user instance to plain object
   * @returns {Object} - Plain object representation
   */
  toObject() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default User;