const { parks, rides, stalls } = require("./data/index.js");
const format = require("pg-format");
const db = require("./connection");
const { prepareRidesData } = require("../utils/utils.js");

function seed() {
  return db
    .query("DROP TABLE IF EXISTS rides;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS foods;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls_foods;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS parks;");
    })
    .then(() => {
      return createParks();
    })
    .then(() => {
      return createRides();
    })
    .then(() => {
      return insertParksData(parks);
    })
    .then((parksResults) => {
      const preparedRides = prepareRidesData(rides, parksResults.rows);
      const arrangeRides = arrangeRidesData(preparedRides);
      return insertRidesData(arrangeRides);
    });
}

function createParks() {
  /* Create your parks table in the query below */

  return db.query(
    "CREATE TABLE parks(park_id SERIAL PRIMARY KEY, park_name VARCHAR NOT NULL, year_opened INTEGER NOT NULL, annual_attendance INTEGER NOT NULL)"
  );
}

function createRides() {
  return db.query(
    "CREATE TABLE rides(ride_id SERIAL PRIMARY KEY, park_id INT REFERENCES parks(park_id), ride_name VARCHAR NOT NULL, year_opened INTEGER NOT NULL, votes INT NOT NULL)"
  );
}

function dataConverter(data) {
  const dataArr = [];
  for (element of data) {
    dataArr.push(Object.values(element));
  }
  return dataArr;
}

function insertParksData(parksData) {
  const convertedParks = dataConverter(parksData);
  const parksInsertStr = format(
    "INSERT INTO parks(park_name, year_opened, annual_attendance) VALUES %L RETURNING *",
    convertedParks
  );
  return db.query(parksInsertStr).then((parksInsertResult) => {
    return parksInsertResult;
  });
}

function arrangeRidesData(ridesData) {
  const formattedRidesArr = ridesData.map((rides) => {
    return [rides.ride_name, rides.year_opened, rides.votes, rides.park_id];
  });
  const ridesInsertStr = format(
    "INSERT INTO rides(ride_name, year_opened, votes, park_id) VALUES %L RETURNING *",
    formattedRidesArr
  );
  console.log(ridesInsertStr)
  return ridesInsertStr;
}

function insertRidesData(ridesInsertStr) {
  return db.query(ridesInsertStr).then((ridesInsertResult) => {
    return ridesInsertResult.rows;
  });
}

module.exports = { seed, prepareRidesData };
