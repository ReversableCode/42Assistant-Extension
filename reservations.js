// Listen for message from the background page that actually indicates that
// the API request has been completed on the client side so we can run the code.

let dataList = [];

chrome.runtime.onMessage.addListener( function(req, sender, sendResponse) {
	if (req.greeting == "reservations_update" && !dataList.length)
	{
		const xhr = new XMLHttpRequest();
		xhr.open("GET", req.url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				dataList = JSON.parse(xhr.responseText)
				const listOfSlots = document.getElementsByClassName('fc-content')
			}
		}
		xhr.send();
	}
});