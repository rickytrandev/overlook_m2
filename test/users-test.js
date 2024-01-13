import chai from 'chai';
import { findRoomDetails, findUserCurrentBookings, getTotalSpent, filterRooms, getAvailableRooms } from '../src/users';
const expect = chai.expect;

describe('Users functions', function() {
  let currentUser;
  let currentBookings;
  let rooms;

  beforeEach(() => {
    currentUser = {
      "id": 1,
      "name": "Jim Halpert"
    };

    currentBookings = [
      { "id": "5fwrgu4i7k55hl6sz", "userID": 1, "date": "2024/04/22", "roomNumber": 1 },
      { "id": "5fwrgu4i7k55hl6t5", "userID": 43, "date": "2024/01/24", "roomNumber": 5 },
      { "id": "5fwrgu4i7k55hl6t6", "userID": 1, "date": "2024/01/10", "roomNumber": 2 }
    ];

    rooms = [
      { "number": 1, "roomType": "residential suite", "bidet": true, "bedSize": "queen", "numBeds": 1,"costPerNight": 358.4 },
      { "number": 5, "roomType": "single room", "bidet": false, "bedSize": "king", "numBeds": 1,"costPerNight": 491.14 },
      { "number": 2, "roomType": "suite", "bidet": false, "bedSize": "full", "numBeds": 2,"costPerNight": 477.38 },
    ];
  });

  it('function findUserCurrentBookings should return only that users bookings', () => {
    const result = findUserCurrentBookings(currentUser, currentBookings)

    expect(result).to.deep.equal([{ "id": "5fwrgu4i7k55hl6sz", "userID": 1, "date": "2024/04/22", "roomNumber": 1 }, { "id": "5fwrgu4i7k55hl6t6", "userID": 1, "date":  "2024/01/10", "roomNumber": 2 }]);
  });

  it('function findRoomDetails should filter rooms with that room number', () => {
    const usersBookedRooms = findUserCurrentBookings(currentUser, currentBookings)
    const result = findRoomDetails(usersBookedRooms, rooms)

    expect(result).to.deep.equal([{ "number": 1, "roomType": "residential suite", "bidet": true, "bedSize": "queen", "numBeds": 1,"costPerNight": 358.4, "date": "2024/04/22" },
      { "number": 2, "roomType": "suite", "bidet": false, "bedSize": "full", "numBeds": 2,"costPerNight": 477.38, "date": "2024/01/10" }]);
  });

  it('function getTotalSpent should return total amount spent on all booked rooms', () => {
    const usersBookedRooms = findUserCurrentBookings(currentUser, currentBookings)
    const roomDetails = findRoomDetails(usersBookedRooms, rooms)
    const result = getTotalSpent(roomDetails)

    expect(result).to.equal(835.78);
  });

  it('function filterRooms should filter available rooms by roomType property', () => {
    const suites = filterRooms(rooms, "suite")
    const singleRoom = filterRooms(rooms, "single room")

    expect(suites).to.deep.equal([{ "number": 2, "roomType": "suite", "bidet": false, "bedSize": "full", "numBeds": 2,"costPerNight": 477.38 }]);
    expect(singleRoom).to.deep.equal([{ "number": 5, "roomType": "single room", "bidet": false, "bedSize": "king", "numBeds": 1,"costPerNight": 491.14 }]);
  });

  it.only('function getAvailableRooms should filter available rooms by date', () => {
    const result1 = getAvailableRooms(currentBookings, "2024/01/24", rooms)
    const result2 = getAvailableRooms(currentBookings, "2024/04/22", rooms)

    expect(result1).to.deep.equal([{ "number": 1, "roomType": "residential suite", "bidet": true, "bedSize": "queen", "numBeds": 1,"costPerNight": 358.4 },
    { "number": 2, "roomType": "suite", "bidet": false, "bedSize": "full", "numBeds": 2,"costPerNight": 477.38 }]);
    expect(result2).to.deep.equal([{ "number": 5, "roomType": "single room", "bidet": false, "bedSize": "king", "numBeds": 1,"costPerNight": 491.14 }, { "number": 2, "roomType": "suite", "bidet": false, "bedSize": "full", "numBeds": 2,"costPerNight": 477.38 }]);
  });
});
