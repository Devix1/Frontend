const wrapper = document.querySelector('.wrapper')
const loginLink = document.querySelector('.login-link')
const registLink = document.querySelector('.register-link')
const btnPopup = document.querySelector('.btnLogin-popup')
const iconClose = document.querySelector('.icon-close')

btnPopup.addEventListener('click',()=>{
    wrapper.classList.add('active-popup')
})

iconClose.addEventListener('click',()=>{
    wrapper.classList.remove('active-popup')
})



registLink.addEventListener('click',()=> {
    wrapper.classList.add('active')
})

loginLink.addEventListener('click',()=> {
    wrapper.classList.remove('active')
})