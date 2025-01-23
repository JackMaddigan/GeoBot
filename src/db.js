const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
  "./geobot.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) return console.error(err.message);
  }
);
// db.run(`DROP TABLE IF EXISTS integer_key_value_store`);

db.run(`
        CREATE TABLE IF NOT EXISTS maps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            forbidMoving INTEGER NOT NULL,
            forbidRotating INTEGER NOT NULL,
            forbidZooming INTEGER NOT NULL,
            map TEXT NOT NULL,
            mapName TEXT NOT NULL,
            timeLimit INTEGER NOT NULL,
            lastChallengeLink TEXT
        )
    `);

db.run(`
        CREATE TABLE IF NOT EXISTS integer_key_value_store (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT NOT NULL UNIQUE,
            value INTEGER NOT NULL
        )
    `);

async function saveData(query, parameters) {
  try {
    return await new Promise((resolve, reject) => {
      db.run(query, parameters, function (err) {
        if (err) {
          console.error(err.message);
          reject();
        }
        resolve();
      });
    });
  } catch (err_1) {
    return console.error(err_1);
  }
}

function readData(query, parameters) {
  return new Promise((resolve, reject) => {
    db.all(query, parameters, function (err, rows) {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve(rows);
    });
  });
}

function deleteData(query, parameters) {
  return new Promise((resolve, reject) => {
    db.run(query, parameters, function (err) {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve();
    });
  });
}

module.exports = {
  readData,
  saveData,
  deleteData,
};
