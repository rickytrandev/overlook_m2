import $ from 'jquery';
import { getData } from './apiCalls';
// selectors
const loginForm = $('#loginForm')
const loginError = $('.login-error-message')
const searchRoomsForm = $('.search-rooms-form')
// global variables
let users;
let userID;
let currentUser;

// event listeners
$(window).on('load', () => {
	getData('http://localhost:3001/api/v1/customers')
		.then(data => users = data.customers)
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
			$('.login-main-content').addClass('hidden')
			loginForm.addClass('hidden')
			searchRoomsForm.removeClass('hidden')
			$('.greeting-header').text(`Hi, ${currentUser.name}.`)
			$('.greeting-header').addClass('align-center')
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