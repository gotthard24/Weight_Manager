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
    let count = 1
    let recipe
    const mainroot = doc.getElementById('mainroot')
    e.preventDefault()
    doc.getElementById('getMeals').style.display='none'
    mainroot.style.display='flex'

    
    
    const root = doc.getElementById('root')
    const rationEndpoint = `/users/ration/${currentUser}`
    const ration = await get(rationEndpoint)
    let arrayMealId=[]
    ration.ration.forEach(meal => {
      arrayMealId.push(meal.id)
      if(meal.instructions.length>0){
        doc.getElementById(`recipe${count}`).innerHTML+=`<div class="recipeInfo">
        <h3>${count}.${meal.title}</h3>
        <div class="ingredientsAndImage">
        <img class="recipeImage" width="35%" src="${meal.image}">
        <div id="ingredients${count}"><h3>Ingredients:</h3></div>
        </div>
        <h3>Instructions:</h3>
        <p>${meal.instructions}</p>
        <button class="backButton" onclick="backToMain(event)">Back</button>
        </div>`
        root.innerHTML+=`<div class="meals">
        <h3>${count}.${meal.title}: ${meal.calories / meal.servings} cal</h3>
        <img class="recipeImage" width="100%" src="${meal.image}">
        <button class="recipeButton" onclick="getInfo${count}(event)">Get full recipe info</button>
        </div>`
      
      } else{
        doc.getElementById(`recipe${count}`).innerHTML+=`<div class="recipeInfo">
        <h3>${count}.${meal.title}</h3>
        <div class="ingredientsAndImage">
        <img class="recipeImage" width="30%" src="${meal.image}">
        <div id="ingredients${count}"><h3>Ingredients:</h3></div>
        </div>
        <h3>Instructions:</h3>
        <p>${meal.summary}</p>
        <button class="backButton" onclick="backToMain(event)">Back</button>
        </div>`
        root.innerHTML+=`<div class="meals">
        <h3>${count}.${meal.title}: ${meal.calories / meal.servings} cal</h3>
        <img class="recipeImage" width="100%" src="${meal.image}">
        <button class="recipeButton" onclick="getInfo${count}(event)">Get full recipe info</button>
        </div>`
        
      }
      count++ 
  });
    let countIds = 1
    for (item of arrayMealId){
      let countIng = 1
      let ingredientEndpoint = `/ingredients/${item}`
      let ingredient = await get(ingredientEndpoint)
      for (item of ingredient){
        doc.getElementById(`ingredients${countIds}`).innerHTML+=`<div><span class="numbers">${countIng}:</span> ${item.amount} ${item.unit} of ${item.name}<div>`
        countIng++
      }
      
      countIds++
    }
    
    let newDiv = doc.createElement('div');
    newDiv.innerHTML = `<p style="margin-top:10px;"> After those 3 meals you have <span id="kcal3">${Math.floor(ration.remainingCalories)}</span> more calories 
    Which you can fill with fruits, sweets or any other food at your desire</p>`;
    mainroot.appendChild(newDiv);
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

    doc.getElementById('usernameN2').innerHTML =`${username}`
    doc.getElementById('kcal2').innerHTML =`${userCalLimit} cal`
}

function getInfo1(e) {
  const mainroot = doc.getElementById('mainroot')
  const recipe = doc.getElementById('recipe1')
  mainroot.style.display="none"
  recipe.style.display='flex'
}
function getInfo2(e) {
  const mainroot = doc.getElementById('mainroot')
  const recipe = doc.getElementById('recipe2')
  mainroot.style.display="none"
  recipe.style.display='flex'
}
function getInfo3(e) {
  const mainroot = doc.getElementById('mainroot')
  const recipe = doc.getElementById('recipe3')
  mainroot.style.display="none"
  recipe.style.display='flex'
}
function backToMain(e) {
  const mainroot = doc.getElementById('mainroot')
  const recipe1 = doc.getElementById('recipe1')
  const recipe2 = doc.getElementById('recipe2')
  const recipe3 = doc.getElementById('recipe3')
  recipe1.style.display='none'
  recipe2.style.display='none'
  recipe3.style.display='none'
  mainroot.style.display="flex"
}