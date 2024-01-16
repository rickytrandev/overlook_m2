
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
  fetch('http://localhost:3001/api/v1/bookings', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID: userID, date: fromDate, roomNumber: roomNumber })
  })
    .then(res => {
      if (res.ok) {
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

export function postRecipe() {
  fetch('http://localhost:3001/api/v1/usersRecipes', {
    method: 'POST',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({ userID: currentUser.id, recipeID: currentRecipe.id })
  })
    .then(response => {
      if (response.ok) {
        addFavoriteRecipe(currentUser, currentRecipe)
        return response.json()
      } else {
        console.log("status", response.status);
        throw new Error('Unable to save recipe')
      }
    })
    .then(data => console.log(data))
    .catch(error => {
      console.log(error);
      closeModal()
      recipeCardSection.innerHTML = `${error.message}`
    })
}