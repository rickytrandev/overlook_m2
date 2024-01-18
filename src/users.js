

export function findUserCurrentBookings(currentUser, currentBookings) {
	if (!currentUser) {
		return []
	}
	const userID = currentUser.id
	return currentBookings.filter(booking => userID === booking.userID)
}

export function findRoomDetails(bookedRooms, allRooms) {
	if (!allRooms.length) {
		return []
	}
	const userRoomDetails = []
	const roomNumbers = bookedRooms.map(booking => booking.roomNumber)
	const dates = bookedRooms.map(booking => booking.date)

	roomNumbers.forEach(number => {
		let roomDetails = allRooms.find(room => room.number === number)
		userRoomDetails.push(roomDetails)
	})

	const filteredRoomsWithDates = userRoomDetails.map((room, index) => {
		return { number: room.number, roomType : room.roomType, bidet : room.bidet, bedSize : room.bedSize, numBeds : room.numBeds, costPerNight : room.costPerNight, date : dates[index] }
	})
	return filteredRoomsWithDates
}

export function getTotalSpent(roomDetails) {
	if (!roomDetails.length) {
		return 0
	}
	const totalSpent = roomDetails.reduce((acc, room) => {
		acc += room.costPerNight
		return acc
	}, 0)
	return totalSpent
}

export function filterRooms(availableRooms, roomTypes) {
	return availableRooms.filter(room => roomTypes.includes(room.roomType))
}

export function getAvailableRooms(allBookings, fromDate, allRooms) {
	if (!allBookings.length || !allRooms.length) {
		return []
	}
	const findBookingsOnDate = allBookings.filter(booking => booking.date === fromDate);
	const nonAvailableRooms = findBookingsOnDate.map(booking => booking.roomNumber);

	const availableRooms = allRooms.filter(room => {
  	const isAvailable = nonAvailableRooms.every(excludedRoomNum => room.number !== excludedRoomNum);
  	return isAvailable;
});
return availableRooms
}