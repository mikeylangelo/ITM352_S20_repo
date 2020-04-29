var day = 10
var month = 9
var year = 1999

step1 = 99;
step2 = parseInt(step1/4);
step3 = step1 + step2;
if(day!=1){
    step4 = 5;}
else{
    step5 = step3 + day
}
step6 = step3 + step4;
step7 = step6 + day;
step8 = (typeof step5 !== 'undefined') ? step5 : step7
if(year>=2000){
    step8-1;
    step9 = step8 % 7;
}
else{
    step9 = step8 % 7;
}

dow = 5
console.log(dow);