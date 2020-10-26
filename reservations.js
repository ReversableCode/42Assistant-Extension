// Listen for message from the background page that actually indicates that
// the API request has been completed on the client side so we can run the code.

var sssssss = 0;

chrome.runtime.onMessage.addListener( function(req, sender, sendResponse) {
	if (req.greeting == "reservations_update")
	{
		console.log(req.info)
		// console.log(!req.responseHeaders.some((header) => (header.name === 'X-42Assistant')), req.responseHeaders)
		// if (sssssss === 1) return;
		// if (!req.responseHeaders.some((header) => (header.name === 'X-42Assistant'))) {
		// 	const xhr = new XMLHttpRequest();
		// 	xhr.open("GET", req.url, true);
		// 	xhr.setRequestHeader('X-42Assistant', 'v1.3')
		// 	xhr.onreadystatechange = function() {
		// 		if (xhr.readyState === 4) {
		// 			sssssss = 1;
		// 			const data = JSON.parse(xhr.responseText)
		// 			console.log(data)
		// 			const listOfSlots = document.getElementsByClassName('fc-content')
		// 		}
		// 	}
		// 	xhr.send();
		// }
	}
});