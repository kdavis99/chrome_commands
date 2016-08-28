window.onload = function() {
   // function to initialize the array of tabs
   var all_tabs = new Array();
   function init() {
      chrome.tabs.query({currentWindow: true}, function (arrayOfTabs) {
         for (i = 0; i < arrayOfTabs.length; i++) {
            all_tabs[i] = arrayOfTabs[i];
         }
         parse_commands();
      });
   }

   var separate_commands = new Array();
   function parse_commands() {
      var input = document.getElementById('user_input').value;
      var input_commands = input.split(";");
      for (command in input_commands) {
         separate_commands.push(input_commands[command]);
         execute_commands(input_commands[command]);
      }
   }

   // function to execute each of the arrays 
   function execute_commands(command) {
         var command_by_space = command.split(" ");

         for (str in command_by_space) {
            if (command_by_space[str].includes("/")) {
               var range = command_by_space[str].split("/");
               var first = range[0];
               var second = range[1];
               // if "5/" -- the range is only 5
               if (!range[1]) {
                  second = first;
               }
            } else if (command_by_space[str] == "cp") {
               // potential "hacky" solution - however it seemed to be more
               // of a bug in chrome.tabs.duplicate
               for (i = first - 1; i < second; i++) {
                  if (all_tabs[i + 1]) {
                     chrome.tabs.duplicate(all_tabs[i + 1].id);
                  }
               }
            }
      }
   }
   document.getElementById('user').onclick = init;
}
