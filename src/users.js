

export function findUserCurrentBookings(currentUser, currentBookings) {
	const userID = currentUser.id
	return currentBookings.filter(booking => userID === booking.userID)
}

export function findRoomDetails(bookedRooms, allRooms) {
	const roomNumbers = bookedRooms.map(booking => booking.roomNumber)
	const dates = bookedRooms.map(booking => booking.date)
	const filteredRooms = allRooms.filter(room => roomNumbers.includes(room.number));

	const filteredRoomsWithDates = filteredRooms.map((room, index) => {
		return { number: room.number, roomType : room.roomType, bidet : room.bidet, bedSize : room.bedSize, numBeds : room.numBeds, costPerNight : room.costPerNight, date : dates[index] }
	})
	return filteredRoomsWithDates
}

export function getTotalSpent(roomDetails) {
	const totalSpent = roomDetails.reduce((acc, room) => {
		acc += room.costPerNight
		return acc
	}, 0)
	return totalSpent
}

export function filterRooms(availableRooms, roomType) {
	return availableRooms.filter(room => room.roomType === roomType)
}

export function getAvailableRooms(allBookings, fromDate, allRooms) {
	const findBookingsOnDate = allBookings.filter(booking => booking.date === fromDate);
	const nonAvailableRooms = findBookingsOnDate.map(booking => booking.roomNumber);

	const availableRooms = allRooms.filter(room => {
  	const isAvailable = nonAvailableRooms.every(excludedRoomNum => room.number !== excludedRoomNum);
  	return isAvailable;
});
return availableRooms
}