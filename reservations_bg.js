// Only listens for the specific call to the goals endpoint.
// After this call is done, we can edit the DOM on the tab, so we send a
// message to the content script.
chrome.webRequest.onCompleted.addListener(
	// Callback
	function(info) {
		chrome.tabs.sendMessage(info.tabId, {
			url: info.url,
			greeting: "reservations_update",
			responseHeaders: info.responseHeaders,
			info
		});
	},

	// filters
	{
		urls: ["*://reservation.42network.org/api/me/events?*"],
		types: ["xmlhttprequest"]
	},

	// extraInfoSpec
	["extraHeaders"]
);