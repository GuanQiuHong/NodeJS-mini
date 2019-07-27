/* Additional functionality are stored in modules, or libraries.
access to functions that read and write data to the file system.
returns an object with which there are lots of functions we can use
so the fs is an object that allows access to the functions. */
const fs = require('fs'); //fs = file system

/*******  BLOCKING, SYNCHRONOUS WAY OF READ & WRITE    ******/

//Calling the function will read the file and return it to us;
//input a source file location
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn); //this logs the text from the other file

const textOut = `This is what we know about the avocado: ${textIn} \n
Created on ${Date.now()}`; //${} ES6 syntax to put other info type
fs.writeFileSync('./txt/output.txt', textOut); //create a new file called output.txt, and put textOut content in that.




/*******  NON-BLOCKING, ASYNCHRONOUS READ & WRITE    *****/

/* Node will start reading this file in the background; as soon as it is ready, 
Node will start the callback function specified thereafter.
first parameter in the callback is often error, and second the data itself.
The following pattern is used because inner callbacks need the data from the outer callbacks
*/

fs.readFile('./txt/starttttt.txt', 'utf-8', (error, data1) => {

if (error) return console.log(`Error!`); //suppose the specified file path did not exist, this line will run.

    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (error, data2) => {
        console.log(data2);
        fs.readFile(`./txt/append.txt`, 'utf-8', (error, data3) => {
            console.log(data3); //the deeper nesting runs later; earlier nests run earlier

            //this callback runs at the end, putting previous 2 files together
            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (error) => {
               console.log('Your file has been written :) '); 
            });
        });
    });
});
console.log('Will read file!'); //this appears first, and then the data from before appears after, since the callback
//function above runs after the synchronous code is finished

 

