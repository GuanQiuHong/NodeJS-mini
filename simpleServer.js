//the require keyword is like #include in c++, like when we include strings, I/O, std vectors, etc.
const fs = require('fs'); // to have read write capabilities
const http = require('http'); // gives networking capabilities, building an http server
const url = require('url'); // to analyze the url, another node module: help parse url string into nicely formatted objects.

const replaceTemplate = require('./modules/replaceTemplate'); //importing our custom module, a function;


/* We need to create a server, then start a server so we can listen to incoming requests */

/*this synchronous is fine because large data loading, like the massive JSON text file, 
happens only once;
it's like when we loaded our data structures first before doing stuff to them, Milestone 1.
Rather, we make code that gets executed over and over again be asynchronous, since that code 
would block the event loop and become problematic.
*/
//__dirname gives the source file location, from which other things are accessed
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //load initial big data
//dataObj essentially holds an array of 5 objects.
const dataObj = JSON.parse(data); //convert to javascript

/*templates can be read right at the beginning, since there's no need to re-read data each time theres a request
  All templates only need to run once
*/

//replace each placeholder in template-card with information from JSON's objects, so we have relevant html code


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

/** createServerWill accept a callback function, fired off each time a new request hits our server. Gets access 
 * to request and response. 
 * Each time a request hits server, callback function will be called; request holds request url, etc;
 * while response gives tools for dealing with how to respond. 
 * Server is the result of creating a server.
 * */
const server = http.createServer((request, response) => { //create server
    console.log(request.url); //this line returns the url of the request: e.g. if 127.0.0.1:8000/overview, url is /overview.
    //Send back a response to the client. Simple way to send back a response.
    
    /* two of request.url's keys are query, and pathname; so now we extracted that info
       where e.g. query: { id: '0'} and pathname: '/product'
       query is the part after question mark, e.g. /product?id=0
    */
    const {query, pathname} = url.parse(request.url, true);


    //// ROUTING ////
    /*based on path name, we'll make decisions, send back different responses.*/


    // Overview page

    if (pathname === '/' || pathname === '/overview') {
        //load the template overview
        response.writeHead(200, {
            'Content-type': 'text/html'
        });

        /** How do we replace the placeholders in template, with our actual data from JSON?
         * loop through the dataObj array
         * replace the placeholders from template with actual data from the product
         * ...
         * replaceTemplate is the function ran upon each iteration 
         * return an array of HTML 'cards'; modified template-cards where placeHolders are replaced with actual JSON info
         * it will take in template-card (tempCard) to operate on, using the currentEl (current JSON object)
         * lastly, we .join because we want one big string to insert into template-overview.html
         */
        const cardsHtml = dataObj.map(currentEl => replaceTemplate(tempCard, currentEl)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        response.end(output); //we respond with the entire tempOverview html file; our writeHead above already sets the stage
    } 

    // Product page

    else if (pathname === '/product') {
        response.writeHead(200, {
            'Content-type': 'text/html'
        });
        //figure out which element was clicked on, that we need to process
        const product = dataObj[query.id];

        //replace the placeholders on product page with actual info from dataObj which are JSON objects
        const output = replaceTemplate(tempProduct, product);

        //now display this styled HTML on the products pages.
        response.end(output);
    } 

    // API

    //allow user to request all data about our application with one single API call
    else if (pathname === '/api') { //send back the data that we have in top-level code
        
        //once again specify the kind of data that's being returned as the response; here, it's JSON
        response.writeHead(200, {
            'Content-type': 'application/json'
        });

        //send JSON data as the response of this API request. 
        response.end(data);

    } 
    
    // Not Found

    else {
        //header and status code is 'prepared' before the response
        response.writeHead(404, { //an http header is a piece of info about the response that we're sending back.
            //inform browser of content type
            'Content-type': 'text/html', //expecting html code in the response.end
            'my-own-header': 'hello-world'
        }); //this error message will be visible in javascript console, for a url that isn't implemented.
        response.end('<h1>Page not found!<h1>'); //this makes the return message of type h1, big and bold
    }

});

//listen to incoming requests from client
/** listen(portNumber, host, ) 
 * callback function runs as soon as the server actually starts listening.
*/
server.listen(8000, '127.0.0.1', () => {
    console.log('Server has started. Listening to requests on port 8000');
});


