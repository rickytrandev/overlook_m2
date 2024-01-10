
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