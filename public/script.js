const doc = document
function signUpL(e) {
    e.preventDefault()
    doc.getElementById('login').style.display='none'
    doc.getElementById('registration').style.display='flex'
}
function logInR(e) {
    e.preventDefault()
    doc.getElementById('registration').style.display='none'
    doc.getElementById('login').style.display='flex'
}
function login(e) {
    e.preventDefault()
    const frm = doc.forms[0]
    doc.getElementById('registration').style.display='none'
    doc.getElementById('login').style.display='none'
    doc.getElementById('main').style.display='flex'
    let email = frm.email.value
    let password = frm.password.value
    console.log(email,password);
}
function registration(e) {
    e.preventDefault()
    doc.getElementById('registration').style.display='none'
    doc.getElementById('login').style.display='none'
    doc.getElementById('main').style.display='flex'
    const frm = doc.forms[1]
    let email = frm.email.value
    let password = frm.password.value
    let username = frm.username.value
    let gender = frm.gender.value   
    let age = frm.age.value
    let height = frm.height.value   
    let weight = frm.weight.value
    let desiredweight = frm.desiredweight.value
    let time = frm.time.value
    let bmr = frm.bmr.value
    console.log(email,password,username,gender,age,height,weight,desiredweight,time,bmr);
}
function update(e) {
    e.preventDefault()
    doc.getElementById('update').style.display='none'
    doc.getElementById('main').style.display='flex'
    const frm = doc.forms[2]
    let email = frm.email.value
    let password = frm.password.value
    let username = frm.username.value
    let gender = frm.gender.value   
    let age = frm.age.value
    let height = frm.height.value   
    let weight = frm.weight.value
    let desiredweight = frm.desiredweight.value
    let time = frm.time.value
    let bmr = frm.bmr.value
    console.log(email,password,username,gender,age,height,weight,desiredweight,time,bmr);
}
function back(e) {
    e.preventDefault()
    doc.getElementById('update').style.display='none'
    doc.getElementById('main').style.display='flex'
    
}
function change(e) {
    e.preventDefault()
    doc.getElementById('main').style.display='none'
    doc.getElementById('update').style.display='flex'
}
function getMeals(e) {
    e.preventDefault()
    doc.getElementById('getMeals').style.display='none'
}