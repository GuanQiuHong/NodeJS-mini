//we 'export' this so it can be used in other 'modules'; in particular, simpleServer.js
module.exports = (template, product) => {
    // ... /g syntax means 'for all instances of this name... replace'
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic'); //not-organic is class name for display: none
    return output; //output this final html with the right information
}