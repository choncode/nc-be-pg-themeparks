/* make sure you write your tests for your utils functions in here :eyes: */

const {prepareRidesData} = require("../utils/utils")

describe('prepareRidesData()', () => {
    test('returns an empty array when passed an empty array', () => {
        expect(prepareRidesData([], [])).toEqual([]);
    });
    test('returns an array of one ride object with the updated park id key for one single object', () => {
        const ridesInput = [{
            ride_name: 'Colossus',
            year_opened: 2002,
            park_name: 'Thorpe Park',
            votes: 5,
          }];

        const parksInput = [{ 
            park_id: 1, 
            park_name: 'Thorpe Park', year_opened: 1979, annual_attendance: 1700000 
        }];

        expect(prepareRidesData(ridesInput, parksInput))
        .toEqual([
        { 
        ride_name: 'Colossus',
        year_opened: 2002,
        park_id: 1,
        votes: 5
     }
    ])
    });
    test('returns an array of multiple rides that belong to one park', () => {
        const ridesInput = [{
            ride_name: 'Colossus',
            year_opened: 2002,
            park_name: 'Thorpe Park',
            votes: 5,
          },
          {
            ride_name: 'Stealth',
            year_opened: 2006,
            park_name: 'Thorpe Park',
            votes: 4,
          }
        ];

        const parksInput = [{ 
            park_id: 1, 
            park_name: 'Thorpe Park', 
            year_opened: 1979, 
            annual_attendance: 1700000 
        }];
        const returnedRides = prepareRidesData(ridesInput, parksInput);
        const allParksSameId = returnedRides.every(ride => {return ride.park_id === 1});

        expect(returnedRides).toHaveLength(2);
        expect(allParksSameId).toBe(true)
        // expect(prepareRidesData(ridesInput, parksInput).every(ride => {
        //     return ride.park_id === 1;
        // })).toBe(true);
        
    });
    test('given multiple parks will assign the correct park id to a single ride', () => {
        const ridesInput = [{
            ride_name: 'Colossus',
            year_opened: 2002,
            park_name: 'Thorpe Park',
            votes: 5,
          }
        ];

        const parksInput = [
        {
            park_id: 2,
            park_name: 'Chessington World of Adventures',
            year_opened: 1987,
            annual_attendance: 1400000,
        },
        { 
            park_id: 1, 
            park_name: 'Thorpe Park', 
            year_opened: 1979, 
            annual_attendance: 1700000 
        }
        ];

        expect(prepareRidesData(ridesInput, parksInput))
        .toEqual([
        { 
        ride_name: 'Colossus',
        year_opened: 2002,
        park_id: 1,
        votes: 5
     }
    ])
    });
    test('should not mutate the input data', () => {
        const ridesInput = [{
            ride_name: 'Colossus',
            year_opened: 2002,
            park_name: 'Thorpe Park',
            votes: 5,
          }
        ];

        const parksInput = [
        {
            park_id: 2,
            park_name: 'Chessington World of Adventures',
            year_opened: 1987,
            annual_attendance: 1400000,
        },
        { 
            park_id: 1, 
            park_name: 'Thorpe Park', 
            year_opened: 1979, 
            annual_attendance: 1700000 
        }
        ];

        prepareRidesData(ridesInput, parksInput);

        expect(ridesInput).toEqual([{
            ride_name: 'Colossus',
            year_opened: 2002,
            park_name: 'Thorpe Park',
            votes: 5,
          }
        ])

        expect(parksInput).toEqual([
            {
                park_id: 2,
                park_name: 'Chessington World of Adventures',
                year_opened: 1987,
                annual_attendance: 1400000,
            },
            { 
                park_id: 1, 
                park_name: 'Thorpe Park', 
                year_opened: 1979, 
                annual_attendance: 1700000 
            }
        ])
    });
})
