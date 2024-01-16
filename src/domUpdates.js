import $ from 'jquery';
import { getData, bookRoom } from './apiCalls';
import { findUserCurrentBookings, findRoomDetails, getTotalSpent, filterRooms, getAvailableRooms } from './users';

// selectors
const loginForm = $('#loginForm')
const loginError = $('.login-error-message')
const searchRoomsForm = $('#search-rooms-form')
const loginMainContent = 	$('.login-main-content')
const greeting = 	$('.greeting-header')
const currentBookingsSection = $('.current-bookings')
const availableRoomsSection = $('.available-rooms')
const bookStayText = $('.align-center')
const availableRoomsText = $('.available-rooms-default')
const calendarError = $('.calendar-error-message')
const toggleIcon = $('.toggle-icon')
const checkboxes = $('.checkbox')
const closeModal = $('.close')
const modal = $('#myModal')

// global variables
export let allBookings;
let users;
let userID;
let currentUser;
let allRooms;
let availableRooms;
let fromDate
let filteredRoomTypes = []

// event listeners
$(window).on('load', () => {
	getData('http://localhost:3001/api/v1/customers')
		.then(data => users = data.customers);
	getData('http://localhost:3001/api/v1/bookings')
		.then(data => allBookings = data.bookings);
	getData('http://localhost:3001/api/v1/rooms')
		.then(data => allRooms = data.rooms);
});


loginForm.submit((e) => {
	e.preventDefault()
	const username = $('.input-field[type="text"]').val();
  const password = $('.input-field[type="password"]').val();
	// let username = 'customer50'
	// let password = 'overlook'
	userID = Number(username.match(/\d+/));
	
	if(username && password) {
		let findUser = users.find(user => user.id === userID)
		if (username ==`customer${userID}` && findUser && password === 'overlook') {
			currentUser = findUser
			loginError.addClass('hidden')
			loginMainContent.addClass('hidden')
			loginForm.addClass('hidden')
			greeting.addClass('align-center')
			greeting.text(`Hi, ${currentUser.name}.`)
			searchRoomsForm.removeClass('hidden')
			$('.container').removeClass('hidden')
			generateUserBookedRooms()
		} else {
			loginError.text(`We can't find that username and password`)
			loginError.removeClass('hidden')
		}
	} else {
		loginError.text('Please tell us your username and password')
		loginError.removeClass('hidden')
	}
})

searchRoomsForm.submit((e) => {
	e.preventDefault()
	fromDate = $('#from-date').val().replaceAll('-','/')
	let toDate = $('#to-date').val()
	
	if(fromDate) {
		$('.filters').removeClass('hidden')
		availableRooms = getAvailableRooms(allBookings, fromDate, allRooms)
		if (availableRooms) {
			$('available-rooms-error').removeClass('hidden')
			availableRoomsText.addClass('hidden')
			generateAvailableRooms(availableRooms)
		} else {
			$('available-rooms-error').removeClass('hidden')
				}
	} else {
		calendarError.removeClass('hidden')
		bookStayText.addClass('hidden')
	}
})

toggleIcon.click(() => {
	currentBookingsSection.slideToggle();
	$('.chevron').toggleClass("rotate");
	if(toggleIcon.attr('aria-expanded') === 'false') {
		$(toggleIcon.attr('aria-expanded', 'true'))
		$(toggleIcon.attr('aria-label', 'close sidebar drop-down menu'))
	} else {
		$(toggleIcon.attr('aria-expanded', 'false'))
		$(toggleIcon.attr('aria-label', 'open sidebar drop-down menu'))
	}
})

toggleIcon.keydown((e) => {
	if(e.key === "Enter" || e.key === ' ')
	currentBookingsSection.slideToggle();
	$('.chevron').toggleClass("rotate");
})

checkboxes.each(function() {
	$(this).click((e) => {
		if (e.target.checked) {
			filteredRoomTypes.push(e.target.value)
			let filteredRooms = filterRooms(availableRooms, filteredRoomTypes)
			if(filteredRooms.length === 0) {
				availableRoomsSection.html(`
				<p class="filter-rooms-error">We are sorry, there are no rooms that match your criteria. Please adjust your filters.</p>
				`)
			} else {
				generateAvailableRooms(filteredRooms)
			}
		} 
		if (!(e.target.checked)) {
			filteredRoomTypes = filteredRoomTypes.filter(roomType => roomType !== (e.target.value))
			const allUnchecked = $('.checkbox').filter(':checked').length === 0;
			let filteredRooms = filterRooms(availableRooms, filteredRoomTypes)

			if (allUnchecked) {
				generateAvailableRooms(availableRooms)
			} else {
					if(filteredRooms.length === 0) {
						availableRoomsSection.html(`
						<p class="filter-rooms-error">We are sorry, there are no rooms that match your criteria. Please adjust your filters.</p>
						`)
					} else {
						generateAvailableRooms(filteredRooms)
						}
				}
		}
	})
}) 

closeModal.click(() => modal.css('display', 'none'))

$(window).click((event) => {
	if (event.target === modal[0]) {
		modal.css('display', 'none')
	}
});

$(document).keydown((e) => {
	if (e.key === "Escape") {
		modal.css('display', 'none')
	}
});

// functions
function generateAvailableRooms(rooms) {
	availableRoomsSection.html(`<h2 class="booking-title" >Available Rooms for ${fromDate}</h2>`)
	rooms.forEach(room => {
		availableRoomsSection.html(availableRoomsSection.html() + `
		<div class="bookings-card tabindex="0">
		<p class="descriptor"> Room Type: <span>${room.roomType}</span></p>
		<p class="descriptor"> Bed Size: <span>${room.bedSize}</span></p>
		<p class="descriptor"> Beds: <span>${room.numBeds}</span></p>
		<p class="descriptor"> Per Night: <span>$${room.costPerNight}</span></p>
		<button id="${room.number}" class="reserve-btn">Reserve</button>
		</div>
		`)
		$('.reserve-btn').click(function(e) {
			const roomNumber = Number(e.target.id)
			bookRoom(roomNumber, fromDate, userID)
			.then(() => {
				modal.css('display', 'block')
				$(`#${String(roomNumber)}`).parent().remove()
				return generateUserBookedRooms()
			})
		});
	})
}

function generateUserBookedRooms() {
	const usersBookedRooms = findUserCurrentBookings(currentUser, allBookings)
	const roomDetails = findRoomDetails(usersBookedRooms, allRooms).reverse()
	const totalSpent = getTotalSpent(roomDetails).toFixed(2)

	currentBookingsSection.html(`<p class="total-spent">Total spent: $${totalSpent}</p>`)
	roomDetails.forEach(room => {
		currentBookingsSection.html(currentBookingsSection.html() + `
		<div class="bookings-card" tabindex="0">
		<p class="descriptor"> Date: <span>${room.date}</span></p>
		<p class="descriptor"> Room Type: <span>${room.roomType}</span></p>
		<p class="descriptor"> Bed Size: <span>${room.bedSize}</span></p>
		<p class="descriptor"> Beds: <span>${room.numBeds}</span></p>
		<p class="descriptor"> Per Night: <span>$${room.costPerNight}</span></p>
		</div>
		`);
	})
}