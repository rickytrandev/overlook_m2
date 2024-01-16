

export function findUserCurrentBookings(currentUser, currentBookings) {
	const userID = currentUser.id
	return currentBookings.filter(booking => userID === booking.userID)
}

export function findRoomDetails(bookedRooms, allRooms) {
	const userRoomDetails = []
	console.log('booked rooms', bookedRooms);
	const roomNumbers = bookedRooms.map(booking => booking.roomNumber)
	console.log('room numbers', roomNumbers);
	const dates = bookedRooms.map(booking => booking.date)

	console.log('dates', dates);
	const findRoomDetails = roomNumbers.forEach(number => {
		let roomDetails = allRooms.find(room => room.number === number)
		userRoomDetails.push(roomDetails)
	})

	console.log(userRoomDetails);
	// const filteredRooms = allRooms.filter(room => roomNumbers.includes(room.number));
	// console.log('filtered rooms', filteredRooms);
	const filteredRoomsWithDates = userRoomDetails.map((room, index) => {
		return { number: room.number, roomType : room.roomType, bidet : room.bidet, bedSize : room.bedSize, numBeds : room.numBeds, costPerNight : room.costPerNight, date : dates[index] }
	})
	console.log('filtered rooms', filteredRoomsWithDates);
	return filteredRoomsWithDates
}

export function getTotalSpent(roomDetails) {
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
	const findBookingsOnDate = allBookings.filter(booking => booking.date === fromDate);
	const nonAvailableRooms = findBookingsOnDate.map(booking => booking.roomNumber);

	const availableRooms = allRooms.filter(room => {
  	const isAvailable = nonAvailableRooms.every(excludedRoomNum => room.number !== excludedRoomNum);
  	return isAvailable;
});
return availableRooms
}