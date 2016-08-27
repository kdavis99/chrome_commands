window.onload = function() {
	function user_command() {
		var input = document.getElementById('user_input').value;
		var res = input.split("/");
			alert(res[0]);
			alert(res[1]);
			chrome.tabs.query({currentWindow: true}, function (arrayOfTabs) {
				for (i = res[0]; i <= res[1]; i++) {
				    chrome.tabs.duplicate(arrayOfTabs[i].id);
				}
			});
		alert(input);
	}
	document.getElementById('user').onclick = user_command;
}
