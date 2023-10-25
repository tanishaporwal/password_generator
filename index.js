const inputSlider=document.querySelector("[data-lengthSlider");
const lengthdisplay=document.querySelector("[data-lengthNumber]");

const passworddisplay=document.querySelector("[data-passwordDisplay]");
const copybtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numbercheck=document.querySelector("#numbers")
const symbolcheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generatebtn=document.querySelector(".generateButton");
const allcheckbox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_+-={[}}\|:;"<,>.?/';


let password="";
let passwordlength=10;
let checkcount=0;
handleSlider();


setIndicator("#ccc");
//set passwordLength
function handleSlider(){
    inputSlider.value=passwordlength;
    lengthdisplay.innerText=passwordlength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordlength-min)*100/(max-min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
   return Math.floor( Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calStrength(){
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassym=false;
    if(uppercasecheck.checked) hasupper=true;
    if(lowercasecheck.checked) haslower=true;
    if(numbercheck.checked) hasnum=true;
    if(symbolcheck.checked) hassym=true;
    if(hasupper && haslower && (hasnum || hassym) && passwordlength>=8){
        setIndicator("#0f0");
    }
    else if((haslower || hasupper) && (hasnum || hassym) && (passwordlength>=6)){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copycontent(){
    try{
        await navigator.clipboard.writeText(passworddisplay.value);
        copyMsg.innerText="copied";
}
    catch(e){
        copyMsg.innerText="Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    },1000);
}
function shufflepassword(array){
    //fisher yates method algo
    for(let i=array.length-1; i>0 ; i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el) => (str += el));
    return str;
    
}

function handleCheckBoxChange(){
    checkcount=0;
    allcheckbox.forEach((checkbox) => {
        if(checkbox.checked)
        checkcount++;
    });



if(passwordlength < checkcount){
    passwordlength = checkcount;
    handleSlider();
}
}

allcheckbox.forEach((checkbox) => {
   checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordlength=e.target.value;
    handleSlider();
})

copybtn.addEventListener('click',()=>{
    if(passworddisplay.value){
        copycontent();
    }
})

generatebtn.addEventListener('click', ()=>{


    if(checkcount==0)
        return ;

    if(passwordlength < checkcount){
        passwordlength = checkcount;
        handleSlider();
    }
    console.log("starting the journey")
    //remove old password
    password="";
    //let's put the stuff mentioned by checkboxes

    // if(uppercasecheck.checked){
    //     password+=generateUpperCase;
    // }
    // if(lowercasecheck.checked){
    //     password+=generateLowerCase;
    // }
    // if(numbercheck.checked){
    //     password+=generateRandomNumber;
    // }
    // if(symbolcheck.checked){
    //     password+=generateSymbol;
    // }

    let funcArr=[];
    if(uppercasecheck.checked)
    funcArr.push(generateUpperCase);

    if(lowercasecheck.checked)
    funcArr.push(generateLowerCase);

    if(numbercheck.checked)
    funcArr.push(generateRandomNumber);

    if(symbolcheck.checked)
    funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password+=funcArr[i]();
    }
    console.log("Compulsory addititon done");

    //remaining addititon
    for(let i=0; i<passwordlength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex" +randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remainaing addition done");
    //shuffle the password
    password = shufflepassword(Array.from(password));

    console.log("shuffle done");

    passworddisplay.value = password;
    console.log("UI addititon done");
    //calculate strength
    calStrength();

    });