/**
 * Simple in-memory database for development
 * Mimics basic Mongoose operations
 */

const users = new Map();
const transactions = new Map();

let userIdCounter = 1;
let transactionIdCounter = 1;

// Helper to generate unique IDs
const generateId = () => String(Date.now()) + Math.random().toString(36).substr(2, 9);

class InMemoryDB {
  static users = {
    findOne: async (query) => {
      for (const user of users.values()) {
        let matches = true;
        for (const [key, value] of Object.entries(query)) {
          if (key === 'email') {
            if (user.email?.toLowerCase() !== value?.toLowerCase()) matches = false;
          } else if (user[key] !== value) {
            matches = false;
          }
        }
        if (matches) return { ...user };
      }
      return null;
    },

    create: async (userData) => {
      const id = generateId();
      const user = {
        _id: id,
        ...userData,
        email: userData.email?.toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.set(id, user);
      return { ...user };
    },
  };

  static transactions = {
    findOne: async (query) => {
      for (const tx of transactions.values()) {
        let matches = true;
        for (const [key, value] of Object.entries(query)) {
          if (tx[key] !== value) matches = false;
        }
        if (matches) return { ...tx };
      }
      return null;
    },

    find: async (query = {}) => {
      const result = [];
      for (const tx of transactions.values()) {
        let matches = true;
        for (const [key, value] of Object.entries(query)) {
          if (tx[key] !== value) matches = false;
        }
        if (matches) result.push({ ...tx });
      }
      return result;
    },

    create: async (txData) => {
      const id = generateId();
      const tx = {
        _id: id,
        ...txData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      transactions.set(id, tx);
      return { ...tx };
    },
  };
}

module.exports = InMemoryDB;
