function prepareRidesData(ridesData, parkData) {
    return ridesData.map((ride) => {
      const park = parkData.find(park => {
        return park.park_name == ride.park_name
      })
      const park_id = park.park_id;
      const rideDataObj = {...ride, park_id: park_id}
      delete rideDataObj.park_name;
      return rideDataObj;
    })
  }

module.exports = { prepareRidesData };