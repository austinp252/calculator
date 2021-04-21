let isResult = false;

let isNumber = new RegExp(/[\d.]/);
let isSign_MD = new RegExp(/[/*]/);
let isSign_AS = new RegExp(/[+-]/);
let isSign = new RegExp(/[/*+-]/);
let isExp = new RegExp(/e\+/);

const display_text = document.querySelector('.display-text');

const btn_clr = document.querySelector('.btn.clr');
const btn_calc = document.querySelector('.btn.calc');
const btn_frac = document.querySelector('.btn.frac');
const btn_back = document.querySelector('.btn.back');

const btns_num = document.querySelectorAll('.btn.num');
const btns_sign = document.querySelectorAll('.btn.sign');

btn_clr.addEventListener('click', () => {
    isResult = false;
    display_text.innerHTML = '';
});

btn_back.addEventListener('click', () => {
    if(isResult) {
        display_text.innerText = '';
        isResult = false;
    } else {
        display_text.innerText = display_text.innerText.substring(0, display_text.innerText.length-1);
    }
});

btn_calc.addEventListener('click', () => {
    if(display_text.innerText === '' || display_text.innerText === 'ERR') {
        display_text.innerText = '';
        return;
    } else if(isSign.test(display_text.innerText.charAt(display_text.innerText.length-1))) {
        display_text.innerText = 'ERR';
        isResult = true;
        return;
    }
    let data = parseEquation(display_text.innerHTML);
    let result = handleEquation(data);
    if(isExp.test(result)) {
        result = formatExponents(result.toString());
    }
    isResult = true;
    display_text.innerText = `${result}`;
});

btn_frac.addEventListener('click', () => {
    clearERR();
    display_text.innerHTML += btn_frac.innerHTML;
});

btns_num.forEach(btn_num => {
    btn_num.addEventListener('click', ()=> {
        clearERR();
        isResult = false;
        display_text.innerText += btn_num.innerHTML;
    });
});

btns_sign.forEach(btn_sign => {
    btn_sign.addEventListener('click', () => {
        clearERR();
        isResult = false;
        if(display_text.innerText === '') {
            return;
        } 
        else if(isSign.test(display_text.innerText.charAt(display_text.innerText.length-1))) {
            return;
        }
        display_text.innerText += btn_sign.id;
    });
});

function clearERR() {
    if(display_text.innerText === 'ERR') {
        display_text.innerText = '';
    }
};

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
    for(var i = 0; i < string.length; i++) { //get all digits of each number
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

function getNextOpIndex(contents) { //issue lies here
    let index = -1;
    let firstFlag = false;
    for(var i = 0; i < contents.length; i++) {
        if(!((contents[i].toString().length > 1 && contents[i].toString().charAt(0) === '-'))) {
            if(isSign_AS.test(contents[i]) && !firstFlag) {
                firstFlag = true;
                index = i;
            } else if(isSign_MD.test(contents[i])) {
                return i;
            }
        }
    }
    return index;
};

function compare(input, sign) {
    return input === sign;
};

function formatExponents(numString) {
    let splitString = numString.split('e');
    let coef = parseFloat(splitString[0]).toFixed(2);
    let result = coef+'e'+splitString[1];
    return result;
}