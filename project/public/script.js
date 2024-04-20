const doc = document

const serverUrl = 'http://localhost:5000/api'
let currentUser
let username
let userDetails = {}
let userCalLimit

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
async function login(e) {
    e.preventDefault()
    const frm = doc.forms[0]
    const email = frm.email.value
    const password = frm.password.value
    const body = {email, password}
    const loginEndpoint = '/login'

    try {
        let loginResponse = await post(body, loginEndpoint)
        currentUser = loginResponse.userid
        console.log('currentUser' + ' ' + currentUser);

        mainInfoUpdate()

        doc.getElementById('registration').style.display='none'
        doc.getElementById('login').style.display='none'
        doc.getElementById('main').style.display='flex'
    } catch (error) {
        alert('Wrong email or password')
        console.log(error);
    }
}
function registration(e) {
    e.preventDefault()
    const frm = doc.forms[1]
    const regEndpoint = '/register'
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
    const body = {email, password, username, gender, age, height, weight, goal_weight: desiredweight, goal_time: time, activity: bmr}
    if (Object.values(body).includes(undefined)){
        alert('Please fill in all fields')
    } else {
        try {
            post(body, regEndpoint)
            doc.getElementById('registration').style.display='none'
            doc.getElementById('login').style.display='flex'
            doc.getElementById('main').style.display='none'
        } catch (error) {
            console.log('Please fill in all fields')
        }
    }
    console.log(email,password,username,gender,age,height,weight,desiredweight,time,bmr);
}
function update(e) {
    e.preventDefault()
    const frm = doc.forms[2]
    const updateUserEndpoint = `/users/${currentUser}`
    const updateDetailsEndpoint = `/users/details/${currentUser}`
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
    const userBody = {email, password, username}
    const detailsBody = {gender, age, height, weight, goal_weight: desiredweight, goal_time: time, activity: bmr}
    //Deleting empty keys from body objects
    Object.keys(userBody).forEach(key => {
        if (userBody[key] === "") {
          delete userBody[key];
        }})
    Object.keys(detailsBody).forEach(key => {
        if (detailsBody[key] === "") {
            delete detailsBody[key];
        }})
    console.log(userBody);
    console.log(detailsBody);
    try {
        if (!Object.values(userBody).every(value => value === undefined)){
            put(userBody, updateUserEndpoint)
        }
        put(detailsBody, updateDetailsEndpoint)

        mainInfoUpdate()

        doc.getElementById('update').style.display='none'
        doc.getElementById('main').style.display='flex'
    } catch (error) {
        console.log('Please fill in all fields')
    }
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
async function getMeals(e) {
    e.preventDefault()
    doc.getElementById('getMeals').style.display='none'

    const root = doc.getElementById('root')
    const rationEndpoint = `/users/ration/${currentUser}`
    const ration = await get(rationEndpoint)

    ration.ration.forEach(meal => {
        let newDiv = doc.createElement('div');
        let img = doc.createElement('img')
        img.src = meal.image;
        newDiv.innerHTML = meal.summary;
        newDiv.appendChild(img)
        root.appendChild(newDiv);
    });
    console.log(ration);

    let newDiv = doc.createElement('div');
    newDiv.innerHTML = `<p> After those 3 meals you have ${ration.remainingCalories} more calories 
    Which you can fill with fruits, sweets or any other food at your desire</p>`;
    root.appendChild(newDiv);
}

async function post(body, endpoint) {
    try {
      const response = await fetch(`${serverUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      return data
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
}

async function put(body, endpoint) {
    try {
      const response = await fetch(`${serverUrl}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      return data
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
}

async function get(endpoint) {
    try {
      const response = await fetch(`${serverUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
}

async function mainInfoUpdate(){
    const userEndpoint = `/users/${currentUser}`
    const detailsEndpoint = `/users/details/${currentUser}`
    const caloriesEndpoint = `/users/calculate/${currentUser}`
    let userResponse = await get(userEndpoint)
    let detailsResponse = await get(detailsEndpoint)
    let caloriesResponse = await get(caloriesEndpoint)
    username = userResponse.username
    userDetails = detailsResponse
    userCalLimit = caloriesResponse

    doc.getElementById('usernameN2').innerHTML = ` ${username}`
    doc.getElementById('kcal2').innerHTML = ` ${userCalLimit} cal`
}