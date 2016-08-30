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

      var first = -1, second = -1;
      for (str in command_by_space) {
         word = trim(command_by_space[str]);
         console.log(word);
         if (word.includes("/")) {
            console.log("/");
            var range = word.split("/");
            var first = range[0];
            var second = range[1];
         } else if ((first > -1 && second > -1) && (word == "yy" || word == "dd")) {
            console.log("yyrdd");
            // potential "hacky" solution - however it seemed to be more
            // of a bug in chrome.tabs.duplicate
            for (i = first - 1; i < second; i++) {
               if (all_tabs[i + 1]) {
                  switch(word) {
                     case "yy":
                        console.log("fyy" + (i + 1));
                        console.log(all_tabs[i+1].id);
                        chrome.tabs.duplicate(all_tabs[i + 1].id);
                        break;
                     case "dd":
                        console.log("fdd");
                        chrome.tabs.remove(all_tabs[i + 1].id);
                        break;
                  }
               }
            }
         } else if (word == "rmdup") {
            // remove all tabs with a duplicate title
            var count_map = {};
            for (tab in all_tabs) {
               console.log(all_tabs[tab].title);
               if (count_map[all_tabs[tab].title] != 1) {
                  count_map[all_tabs[tab].title] = 1;
               } else {
                  chrome.tabs.remove(all_tabs[tab].id);
               }
            }
         } else if (/[0-9a-z]/i.test(word)) {
            console.log("yydd");
            console.log(command_by_space[++str]);
            found_num = false;
            for (tabs in map_tabs) {
               if (!found_num && map_tabs[tabs] && (map_tabs[tabs].url.includes(word.toLowerCase()) ||
                        tabs.includes(word.toLowerCase()) || /[0-9]/.test(word))) {
                  switch(command_by_space[str]) {
                     case "dd":
                     {
                        if (/[0-9]/.test(word)) {
                           chrome.tabs.remove(all_tabs[word].id);
                           found_num = true;
                        } else {
                           console.log(map_tabs[tabs]);
                           chrome.tabs.remove(map_tabs[tabs].id);
                        }
                        break;
                     }
                     case "rr":
                     {
                        console.log("rr");
                        if (/[0-9]/.test(word)) {
                           chrome.tabs.reload(all_tabs[word].id);
                           found_num = true;
                        } else {
                           chrome.tabs.reload(map_tabs[tabs].id);
                        }
                        break;
                     }
                     case "yy":
                     {
                        console.log("yy");
                        // check if deleting index (number) or title
                        if (/[0-9]/.test(word)) {
                           chrome.tabs.duplicate(all_tabs[word].id);
                           found_num = true;
                        } else {
                           chrome.tabs.duplicate(map_tabs[tabs].id);
                        }
                        break;
                     }
                  }
               }
            }
         }
      }
   }
   document.getElementById('user').onclick = init;
}
