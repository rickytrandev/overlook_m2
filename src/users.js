

export function findUserCurrentBookings(currentUser, currentBookings) {
	const userID = currentUser.id
	return currentBookings.filter(booking => userID === booking.userID)
}

export function findRoomDetails(usersBookedRooms, rooms) {
	const roomNumbers = usersBookedRooms.map(booking => booking.roomNumber)
	const dates = usersBookedRooms.map(booking => booking.date)
	const filteredRooms = rooms.filter(room => roomNumbers.includes(room.number));

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