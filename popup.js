window.onload = function() {
   function parse_command() {
      chrome.tabs.query({currentWindow: true}, function (arrayOfTabs) {
         var all_tabs = new Array();
         for (i = 0; i < arrayOfTabs.length; i++) {
            all_tabs[i] = arrayOfTabs[i];
         }
         var input = document.getElementById('user_input').value;
         var input_commands = input.split(";");

         for (command in input_commands) {
            var command_by_space = input_commands[command].split(" ");

            for (str in command_by_space) {
               if (command_by_space[str].includes("/")) {
                  var range = command_by_space[str].split("/");
                  var first = range[0];
                  var second = range[1];
               }
               if (command_by_space[str] == "cp") {
                  for (i = first - 1; i < second; i++) {
                     if (arrayOfTabs[i + 1]) {
                        chrome.tabs.duplicate(arrayOfTabs[i + 1].id);
                     }
                  }
               }
            }
         }
      });
   }
   document.getElementById('user').onclick = parse_command;
}
