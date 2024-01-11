import $ from 'jquery';
import { getData } from './apiCalls';
import { findUserCurrentBookings, findRoomDetails, getTotalSpent } from './users';

// selectors
const loginForm = $('#loginForm')
const loginError = $('.login-error-message')
const searchRoomsForm = $('#search-rooms-form')
const loginMainContent = 	$('.login-main-content')
const greeting = 	$('.greeting-header')
const currentBookingsSection = $('.current-bookings')
const totalSpentTag = $('.total-spent')
const availableRoomsSection = $('.available-rooms')
const bookStayText = $('.align-center')
const availableRoomsText = $('.available-rooms-default')
const calendarError = $('.calendar-error-message')

// global variables
let users;
let userID;
let currentUser;
let currentBookings;
let allRooms;
let fromDate;

// event listeners
$(window).on('load', () => {
	getData('http://localhost:3001/api/v1/customers')
		.then(data => users = data.customers);
	getData('http://localhost:3001/api/v1/bookings')
		.then(data => currentBookings = data.bookings);
	getData('http://localhost:3001/api/v1/rooms')
		.then(data => allRooms = data.rooms);
});

loginForm.submit((e) => {
	e.preventDefault()
	const username = $('.input-field[type="text"]').val();
  const password = $('.input-field[type="password"]').val();
	userID = Number(username.match(/\d+/));

	if(username && password) {
		let findUser = users.find(user => user.id === userID)
	
		if (username ==`customer${userID}` && findUser && password === 'overlook') {
			currentUser = findUser
			console.log('User found');
			loginError.addClass('hidden')
			loginMainContent.addClass('hidden')
			loginForm.addClass('hidden')
			greeting.addClass('align-center')
			greeting.text(`Hi, ${currentUser.name}.`)
			searchRoomsForm.removeClass('hidden')
			generateUserBookedRooms()
		} else {
			console.log('cant find user');
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
	fromDate = $('#from-date').val()
	const toDate = $('#to-date').val()
	
	if(fromDate) {
		availableRoomsText.addClass('hidden')
		allRooms.forEach(room => {
			availableRoomsSection.html(availableRoomsSection.html() + `
			<div class="bookings-card">
			<p class="descriptor"> Room Type: <span>${room.roomType}</span></p>
			<p class="descriptor"> Bed Size: <span>${room.bedSize}</span></p>
			<p class="descriptor"> Beds: <span>${room.numBeds}</span></p>
			<p class="descriptor"> Per Night: <span>$${room.costPerNight}</span></p>
			<button>View</button> 
			</div>
			`);
		})
	} else {
		calendarError.removeClass('hidden')
		bookStayText.addClass('hidden')
	}

})

// functions
function generateUserBookedRooms() {
	const usersBookedRooms = findUserCurrentBookings(currentUser, currentBookings)
	const roomDetails = findRoomDetails(usersBookedRooms, allRooms)
	const totalSpent = getTotalSpent(roomDetails).toFixed(2)

	totalSpentTag.text(`Total spent: $${totalSpent}`)
	roomDetails.forEach(room => {
		currentBookingsSection.html(currentBookingsSection.html() + `
		<div class="bookings-card">
		<p class="descriptor"> Date: <span>${room.date}</span></p>
		<p class="descriptor"> Room Type: <span>${room.roomType}</span></p>
		<p class="descriptor"> Bed Size: <span>${room.bedSize}</span></p>
		<p class="descriptor"> Beds: <span>${room.numBeds}</span></p>
		<p class="descriptor"> Per Night: <span>$${room.costPerNight}</span></p>
		<button>View</button> 
		</div>
		`);
	})

}