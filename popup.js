window.onload = function() {
   function user_command() {
      var input = document.getElementById('user_input').value;
      var input_by_space = input.split(" ");

      for (s in input_by_space) {
         if (input_by_space[s].includes("/")) {
            var range = input_by_space[s].split("/");
            var first = range[0];
            var second = range[1];
         }
         else if (input_by_space[s].includes("dup")) {
            chrome.tabs.query({currentWindow: true}, function (arrayOfTabs) {
               for (i = first; i <= second; i++) {
                  chrome.tabs.duplicate(arrayOfTabs[i].id);
               }
            });
         }
      }
      
   }
   document.getElementById('user').onclick = user_command;
}
