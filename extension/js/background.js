// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name background.js
// @externs_url http://closure-compiler.googlecode.com/svn/trunk/contrib/externs/chrome_extensions.js
// @js_externs var console = {assert: function(){}};
// @formatting pretty_print
// ==/ClosureCompiler==

/** @license
  JSON Formatter | MIT License
  Copyright 2012 Callum Locke

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

 */

/*jshint eqeqeq:true, forin:true, strict:true */
/*global chrome, console */

(function () {
  
  "use strict" ;

  // Constants
    var
      TYPE_STRING = 1,
      TYPE_NUMBER = 2,
      TYPE_OBJECT = 3,
      TYPE_ARRAY  = 4,
      TYPE_BOOL   = 5,
      TYPE_NULL   = 6
    ;



  // Record current version (in case future update wants to know)
    localStorage.jfVersion = '0.5.6' ;

  // Template elements
    var templates,
        baseSpan = document.createElement('span') ;
    


  // Function to convert object to an HTML string
  function ansiToHTML(text) {
      var html = ansi_up.ansi_to_html(text);
        
      // Make div#formattedJson and append the root kvov
        var divFormattedJson = document.createElement('pre') ;
        divFormattedJson.id = 'formattedJson' ;
        divFormattedJson.style.backgroundColor = "black";
        divFormattedJson.style.color = "#AAA";
        divFormattedJson.innerHTML = html;
      
      // Convert it to an HTML string (shame about this step, but necessary for passing it through to the content page)
        var returnHTML = divFormattedJson.outerHTML ;

      // Return the HTML
        return returnHTML ;
    }

  // Listen for requests from content pages wanting to set up a port
    chrome.extension.onConnect.addListener(function(port) {

      if (port.name !== 'jf') {
        console.log('JSON ANSI error - unknown port name '+port.name, port) ;
        return ;
      }

      port.onMessage.addListener(function(msg) {
        var jsonpFunctionName = null,
            validJsonText
        ;

        if (msg.type === 'SENDING TEXT') {
          // Try to parse as JSON
            var obj,
            text = msg.text ;

            try {
              console.log("TODO: is valid ANSI?");
            }
            catch (e) {
              port.postMessage(['NOT ANSI', 'no opening parenthesis']) ;
              port.disconnect() ;
              return ;
            }

            // If still running, we now have a valid ANSI.

            // And send it the message to confirm that we're now formatting (so it can show a spinner)
            port.postMessage(['FORMATTING' /*, JSON.stringify(localStorage)*/]) ;

            // Do formatting
            var html = ansiToHTML(text) ;

            // Post the HTML string to the content script
              port.postMessage(['FORMATTED', html, text]) ;

            // Disconnect
              port.disconnect() ;
        }
      });
    });
}()) ;
