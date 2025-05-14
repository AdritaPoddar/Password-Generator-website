const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generate-button");
const allCheckbox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_-+={[}]|\:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
// set strength color to grey 
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    const percentage = ((passwordLength - min) * 100) / (max - min);

    inputSlider.style.backgroundSize = `${percentage}% 100%`;
}
function setIndicator(color){
    indicator.style.backgroundColor= color;
    // shadow
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
function getRndInteger(min,max){
     return Math.floor(Math.random() * (max-min)) + min;
}
function getRndNumber(){
    return getRndInteger(0,10);
}
function getRndLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function getRndUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function getRndSymbols(){
    const rndNum=getRndInteger(0, symbols.length);
    return symbols.charAt(rndNum);
}

function calcStrength(){
    // create 4 varibales for 4 including types
    let hasUpper=false;
    let hasLower=false;
    let hasNumber=false;
    let hassymbol=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNumber=true;
    if(symbolsCheck.checked) hassymbol=true;
    if(hasUpper && hasLower && (hasNumber||hassymbol) && passwordLength>=8){
        setIndicator("#0f0");
    } else if(
       ( hasUpper||hasLower) &&
        (hasNumber||hassymbol) &&
        passwordLength>=6
    ){
        setIndicator("#ff0");
    } else {
       setIndicator("#f00");
    }
    
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied!";
    }
   catch(e){
    copyMsg.innerText="failed";
   }
//    to make copy wala span visisble for some time and then vanish
  copyMsg.classList.add("active");
  setTimeout( () => {
    copyMsg.classList.remove("active");
  },2000);
}

function shufflePassword(array) {
    // Fisher Yates Method 
    for(let i= array.length-1; i>0;i--){
        // ranjom j find
        const j=Math.floor(Math.random()*(i+1));
        // swap 
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    //after swap take an empty string and add the elements of the array of after swaping and 
    //return it(string) as a password
    let str="";
    array.forEach((el) => (str += el));
    return str;
}
function handleCheckboxChange() {
    checkCount=0;
    allCheckbox.forEach((checkbox)=>{
     if(checkbox.checked)
        checkCount++;
    });
    // special condition  
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckboxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength=e.target.value;
    // handleSlider();  for ui to show the changes in passwordlength by moving the head of the slider 
    handleSlider();
})
copyBtn.addEventListener('click', (e) => {
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',(e)=>{
    if(checkCount === 0) 
        return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    password="";
    console.log("Starting the journey");
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }
    
    let funcArr=[];

    if(uppercaseCheck.checked)
        funcArr.push(getRndUppercase);
    if(lowercaseCheck.checked)
        funcArr.push(getRndLowercase);
    if(numbersCheck.checked)
        funcArr.push(getRndNumber);
    if(symbolsCheck.checked)
        funcArr.push(getRndSymbols);
 
    for(let i=0; i<funcArr.length; i++){
        password+=funcArr[i]();
    }
    console.log("compulsory addition done");
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex=getRndInteger(0, funcArr.length);
        console.log("randIndex" +randIndex);
        password+=funcArr[randIndex]();
    }
    console.log("remaining addition done");
     password=shufflePassword(Array.from(password));
     console.log("shuffling done");
     // show in ui
     passwordDisplay.value=password;
    // calculate strength
     calcStrength();





})