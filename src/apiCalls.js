import { allBookings } from "./domUpdates";

export function getData(url) {
	return fetch(url)
		.then(res => {
			if(res.ok) {
				return res.json()
			} else {
				console.log(res.status);
				throw new Error ('Oops! something went wrong. Please try again later.')
			}
		})
		.catch(error => {
			console.log(error);
		})
}

export function bookRoom(roomNumber, fromDate, userID) {
  return fetch('http://localhost:3001/api/v1/bookings', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID: userID, date: fromDate, roomNumber: roomNumber })
  })
    .then(res => {
      if (res.ok) {
				allBookings.push({ userID: userID, date: fromDate, roomNumber: roomNumber })
        return res.json();
      } else {
        console.log("status", res.status);
        return res.json().then(errorData => {
          throw new Error(errorData.message || 'Unable to reserve the room. Please give us a call');
        });
      }
    })
    .then(data => console.log(data))
    .catch(error => {
      console.log(error.message);
    });
}