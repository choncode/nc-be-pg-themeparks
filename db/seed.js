const { parks, rides, stalls } = require("./data/index.js");
const format = require("pg-format");
const db = require("./connection");

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
      return insertRidesData(rides, parksResults.rows)
      
    })
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

function prepareRidesData(parkData, ridesData) {
  return ridesData.map((ride) => {
    const park = parks.find(park => {
      return park.park_name == ride.park_name
    })
    const park_id = park.park_id;
    return [ride.ride_name, ride.year_opened, ride.votes, park_id]
  })
}

function insertRidesData(ridesData, parksData){
  const convertedRides = prepareRidesData(parksData, ridesData);
  console.log(convertedRides, "  <<< this is convertedRides")


}

module.exports = seed;
