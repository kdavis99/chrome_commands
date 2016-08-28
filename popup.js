window.onload = function() {
   function trim(s){ 
      return ( s || '' ).replace( /^\s+|\s+$/g, '' ); 
   }

   // function to initialize the array of tabs
   var all_tabs = new Array();
   var map_tabs = {};
   function init() {
      chrome.tabs.query({currentWindow: true}, function (arrayOfTabs) {
         for (i = 0; i < arrayOfTabs.length; i++) {
            all_tabs[i] = arrayOfTabs[i];
            // map used for removing duplicate tabs/doing things with
            // the tab by name
            map_tabs[arrayOfTabs[i].title.toLowerCase()] = arrayOfTabs[i];
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
      console.log(command);

      for (str in command_by_space) {
         word = trim(command_by_space[str]);
         console.log(word);
         if (word.includes("/")) {
            var range = word.split("/");
            var first = range[0];
            var second = range[1];
            // if "5/" -- the range is only 5
            if (!range[1]) {
               second = first;
            }
         } else if (word == "cp" || word == "rm") {
            // potential "hacky" solution - however it seemed to be more
            // of a bug in chrome.tabs.duplicate
            for (i = first - 1; i < second; i++) {
               if (all_tabs[i + 1]) {
                  switch(word) {
                     case "cp":
                        console.log("cp");
                        chrome.tabs.duplicate(all_tabs[i + 1].id);
                        break;
                     case "rm":
                        console.log("rm");
                        chrome.tabs.remove(all_tabs[i + 1].id);
                        break;
                  }
               }
            }
         } else if (word.includes("dd") || word.includes("yy")) {
            console.log("yydd");
            console.log(command_by_space[++str]);
            for (tabs in map_tabs) {
               // toLowerCase to enforce normalization
               if (tabs.includes(command_by_space[str].toLowerCase())) {
                  switch(word) {
                     case "yy":
                        console.log("yy");
                        chrome.tabs.duplicate(map_tabs[tabs].id);
                        break;
                     case "dd":
                        console.log("dd");
                        chrome.tabs.remove(map_tabs[tabs].id);
                        break;
                  }
               }
            }
         }
         // add deleting all duplicate tabs
         // do reload
      }
   }
   document.getElementById('user').onclick = init;
}
