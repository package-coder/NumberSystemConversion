queryListener('#decimal', 'keyup', (element) => {
    querySetValue('#binary', convertDecimalToAny(element.value, 2));
    querySetValue('#octal', convertDecimalToAny(element.value, 8));
    querySetValue('#hexadecimal', convertDecimalToAny(element.value, 16));
})

queryListener('#binary', 'keyup', (element) => {
    let decimal = convertAnyToDecimal(element.value, 2);
    querySetValue('#decimal', decimal);
    querySetValue('#octal', convertDecimalToAny(decimal, 8));
    querySetValue('#hexadecimal', convertDecimalToAny(decimal, 16));

})

queryListener('#octal', 'keyup', (element) => {
    let decimal = convertAnyToDecimal(element.value, 8);
    querySetValue('#decimal', decimal);
    querySetValue('#binary', convertDecimalToAny(decimal, 2));
    querySetValue('#hexadecimal', convertDecimalToAny(decimal, 16));

})

queryListener('#hexadecimal', 'keyup', (element) => {
    let decimal = convertAnyToDecimal(element.value, 16);
    querySetValue('#decimal', decimal);
    querySetValue('#binary', convertDecimalToAny(decimal, 2));
    querySetValue('#octal', convertDecimalToAny(decimal, 8));

})


function getElement(query){
    return document.querySelector(query);
}

function queryListener(id, event, lambda){
    const element = getElement(id);
    element.addEventListener(event, () => lambda(element));
}

function querySetValue(id, value){
    const element = getElement(id);
    element.value = value;
}

function convertAnyToDecimal(value, baseFrom){
    let number = value.toString();
    let index = number.indexOf('.');
    let weight = number.length - 1;

    if(index != -1){
        let fraction = (index == -1) ? "" : number.substr(index+1);
        weight = number.length - fraction.length - 2;
    }
    
    let result = 0;
    number.split('').forEach(digit => {
        if(digit == '.') return;

        if(baseFrom == 16)
            digit = hexaNotation(digit);
        if(baseFrom == 2)
            digit = (digit == 1 || digit == 0) ? digit : 0;

        let product = digit * Math.pow(baseFrom, weight);
        result += product;
        weight--;
    })

    return result;
}

function convertDecimalToAny(decimalValue, baseTo){
    let result = '';
    let number = decimalValue.toString();

    let index = number.indexOf('.');
    if(index != -1)
        number = number.substring(0, index);

    while(number > 0){
        if(baseTo == 2){
            let bit = (number % 2 == 0) ? '0' : '1';
            result = bit.concat(result);
        }
        else{
            let remainder = number % baseTo;
            if(baseTo == 16)
                remainder = hexaNotation(remainder);
            result = remainder.toString().concat(result);
        }
        number = Math.floor(number/baseTo);
    }

    let fraction = convertFractionToAny(decimalValue, baseTo, 10);
    result = result.concat(fraction);
    return result;
}

function convertFractionToAny(decimalValue, baseTo, repeat){
    let number = decimalValue.toString();
    let index = number.indexOf('.');
    if(index == -1) return '';

    let result = '';
    let fraction = number.substr(index);
    for (let i = 0; i < repeat; i++) {
        let product = (fraction * baseTo).toString();
        let index = product.indexOf('.');
        
        let digit = product.substring(0, index); 
        if(baseTo == 16)
            digit = hexaNotation(digit);
        result = result.concat(digit);
        fraction = product.substr(index);
    }

    return (result == '') ? '' : '.'.concat(result);
}

function hexaNotation(value){
    let text = value.toString().toUpperCase();
    if(text >= 'A' && text <= 'F')
        return text.charCodeAt(0) - 55;
    else if(Number(value) >= 10)
        return String.fromCharCode(value + 55);
    return value;
}