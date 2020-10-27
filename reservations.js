// Listen for message from the background page that actually indicates that
// the API request has been completed on the client side so we can run the code.
chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
	if (req.greeting == "reservations_update")
	{
		window.postMessage({ type: "RESERVATION_42ASSISTANT", text: "START_SCRIPT" }, "*");
	}
});

// Inject js code into page
(function() {
	const injectCode = `
	window.addEventListener("message", function(event) {
		// We only accept messages from ourselves
		if (event.source != window)
			return;

		if (event.data.type && (event.data.type == "RESERVATION_42ASSISTANT")) {
			const slotList = document.getElementById("app").__vue__.$children[1].events;
			slotList.forEach(function(slot) {
				const newTitle = [
					slot.title,
					'Reserved Places: ' + (slot.numberOfPlacesReserved)
				].join('\\n');
				slot.title = newTitle;
			})
		}
	}, false);
	`
	const script = document.createElement('script');
	script.textContent = injectCode;
	(document.head||document.documentElement).appendChild(script);
	script.remove();
})();
