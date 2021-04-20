/*
TODO:
- handle long fracs and numbers

-too many signs or in wrong places

- empty string

-parse equation string for numbers and signs
    - edge cases

-using previous answer in next solution

- formatting number of digits

*/

const display_text = document.querySelector('.display-text');
const btn_clr = document.querySelector('.btn.clr');
const btn_calc = document.querySelector('.btn.calc');
const btn_frac = document.querySelector('.btn.frac');
const btns_num = document.querySelectorAll('.btn.num');
const btns_sign = document.querySelectorAll('.btn.sign');

btn_clr.addEventListener('click', () => {
    display_text.innerHTML = '';
});

btn_calc.addEventListener('click', () => {
    let data = parseEquation(display_text.innerHTML);
    let result = handleEquation(data);
    display_text.innerHTML = `${result}`;
});

btn_frac.addEventListener('click', () => {
    display_text.innerHTML += btn_frac.innerHTML;
});

btns_num.forEach(btn_num => {
    btn_num.addEventListener('click', ()=> {
        display_text.innerHTML += btn_num.innerHTML;
    });
});

btns_sign.forEach(btn_sign => {
    btn_sign.addEventListener('click', () => {
        display_text.innerHTML += btn_sign.id;
    });
});

function add(inpA, inpB) {
    return inpA+inpB;
};

function subtract(inpA, inpB) {
    return inpA-inpB;
};

function multiply(inpA, inpB) {
    return inpA*inpB;
};

function divide(inpA, inpB) {
    if(inpB === 0) {
        return 'ERR';
    }
    return inpA/inpB;
};

function parseEquation(string) { //returns array with numbers and signs
    let contents = [];
    let num = '';
    let isNumber = new RegExp(/[\d.]/);
    let isSign_MD = new RegExp(/[/*]/);
    let isSign_AS = new RegExp(/[+-]/);
    for(var i = 0; i < string.length; i++) {
        let curChar = string.charAt(i);
        if(isNumber.test(curChar)) {
            num+=curChar;
        } else { //can only be sign otherwise
            contents.push(parseFloat(num));
            contents.push(curChar);
            num = '';
        }
    }
    contents.push(parseFloat(num)); //handle last num
    console.log(contents);
    return contents;
};

function handleEquation(contents) {
    while(contents.length > 1) {
        let opIndex = getNextOpIndex(contents)
        let op = contents[opIndex];
        let numA = contents[opIndex-1];
        let numB = contents[opIndex+1];
        let result = 0;
        if(compare(op, '+')) {
            result = add(numA, numB);
        } else if(compare(op, '-')) {
            result = subtract(numA, numB);
        } else if(compare(op, '*')) {
            result = multiply(numA, numB);
        } else if(compare(op, '/')) {
            result = divide(numA, numB);
            if(typeof(result) != 'number') {
                return 'ERR';
            }
        }
        contents.splice(opIndex-1, 3);
        contents.splice(opIndex-1, 0, result);
    }
    return contents[0];
};

function getNextOpIndex(contents) {
    let index = -1;
    let isSign_MD = new RegExp(/[/*]/);
    let isSign_AS = new RegExp(/[+-]/);
    for(var i = 0; i < contents.length; i++) {
        if(isSign_AS.test(contents[i])) {
            index = i;
        } else if(isSign_MD.test(contents[i])) {
            return i;
        }
    }
    return index;
};

function compare(input, sign) {
    return input === sign;
};