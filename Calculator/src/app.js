/*Can Do

let $ = 52
let $num = 52
let num$ = 52
let _ = 69
let _num = 69
let num_ = 69
let krutoiNik = 12 
let num52 = 42
*/
/*Can't do 

let 52num = 22
let my-num = 42
let let/const/true/false = 52
*/
/*Операторы
let num = 42

console.log( num + 10)
console.log( num - 10)
console.log( num * 10)
console.log( num / 10)
*/
/* Действия с операторами


let num = 10
let num2 = num + 10
let num3 = num * num2 + 10

console.log(num, num2, num3)
*/
/* Действия со строками (Конкотенация строк)
const userName = 'Vasilii'
const fullName = userName + ' Zgurskii'
console.log(fullName)
*/ 

const resultElement = document.getElementById('result')
const input1 = document.getElementById('input1')
const input2 = document.getElementById('input2')
const submitBtn = document.getElementById('submit')
const minusBtn = document.getElementById ('minus')
const plusBtn = document.getElementById ('plus')
let action = '+' 
const sum = Number(input1.value) + Number(input2.value)
const min = Number(input1.value ) - Number(input2.value)

resultElement.textContent = sum

submitBtn.onclick = function(){

    if(action == '+'){
    const sum = Number(input1.value) + Number(input2.value)
    resultElement.textContent = sum
}
    else {
    const sum = Number(input1.value) - Number(input2.value)
    resultElement.textContent = sum
 }
}
 
minusBtn.onclick = function(){
action = '-'
}

plusBtn.onclick = function(){
action = '+'
}









