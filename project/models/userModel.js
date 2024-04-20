const { db, food } = require("../config/db.js");
const bcrypt = require('bcrypt');

async function createUser(user) {
  const { username, password, email, height, weight, age, gender, activity, goal_weight, goal_time } = user;
  const trx = await db.transaction();
  try {
    // Insert user data into the 'users' table
    const [userid] = await trx("users").insert(
      { email, username },
      ["id"]
    );

    // Hash the password and insert it into the 'passwords' table
    const hashedPassword = await bcrypt.hash(password + "", 10);
    await trx("passwords").insert({
      user_id: userid.id,
      password: hashedPassword,
    });

    // Insert props into the 'user_details' table
    await trx("user_details").insert({
      user_id: userid.id,
      height,
      weight,
      age,
      gender,
      activity,
      goal_weight,
      goal_time,
    });

    await trx.commit();

    return userid;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const user = await db("users")
      .select("passwords.password", "users.id")
      .join("passwords", { "users.id": "passwords.user_id" })
      .where({ email })
      .first();
    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const users = await db("users");
    return users;
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const user = await db("users").where({ id }).first();
    return user;
  } catch (error) {
    throw error;
  }
}

async function getDetailsById(id) {
  try {
    const user = await db("user_details").where({ user_id: id }).first();
    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUserById(id, updatedUser) {
  let userpassword;
  if (updatedUser?.password) {
    userpassword = updatedUser?.password;
    delete updatedUser.password;
  }
  try {
    await db("users").where({ id }).update(updatedUser);

    if (userpassword) {
      // Hash the password and insert it into the 'hashpwd' table
      const password = await bcrypt.hash(userpassword + "", 10);
      await db("passwords").where({ userid: id }).update({ password });
    }
  } catch (error) {
    throw error;
  }
}

async function updateDetailsById(id, updatedDetails) {
  try {
    await db("user_details").where({ user_id: id }).update(updatedDetails);
  } catch (error) {
    throw error;
  }
}

async function updateGoalById(id, updatedDetails) {
  try {
    await db("user_details").where({ user_id: id }).update(updatedDetails);
  } catch (error) {
    throw error;
  }
}

async function getAllRecipes() {
  try {
    const users = await food("recipes").orderBy('calories');
    return users;
  } catch (error) {
    throw error;
  }
}

async function getAllIngredients() {
  try {
    const users = await food("ingredients");
    return users;
  } catch (error) {
    throw error;
  }
}

async function getIngredientsById(id) {
  try {
    const users = await food("ingredients").where({recipe_id: id});
    return users;
  } catch (error) {
    throw error;
  }
}

async function calculateForUserById(id) {
  try {
    const user = await getDetailsById(id);
    console.log(user);
    const oneKg = 7700
    const diff = user.weight - user.goal_weight
    let calories = 0
    let BMR = 0
    if (user.gender === 'male') {
      BMR = 10 * parseFloat(user.weight) + 6.25 * parseFloat(user.height) - 5 * parseFloat(user.age) + 5
    } else {
      BMR = 10 * parseFloat(user.weight) + 6.25 * parseFloat(user.height) - 5 * parseInt(user.age) - 161
    }
    calories = BMR * parseFloat(user.activity)
    console.log(calories);

    if (diff === 0) return calories;

    let goalCalories = calories - (oneKg * diff) / parseInt(user.goal_time)
    return Math.ceil(goalCalories)
  } catch (error) {
    throw error;
  }
}

async function getDailyRationById(id) {
  try {
    const calories = await calculateForUserById(id);
    const recipes = await getAllRecipes()
    let remainingCalories = calories
    let relevantRecipes = []
    let ration = []
    let counter = 0

    for(recipe of recipes){
      if((recipe.calories / recipe.servings) <= (calories / 3) + (calories/8) && (recipe.calories / recipe.servings) >= (calories / 3) - (calories/8)){
        relevantRecipes.push(recipe)
      }
    }

    do {
      let randInt = Math.floor(Math.random() * relevantRecipes.length)
      if (!ration.includes(relevantRecipes[randInt])){
        ration.push(relevantRecipes[randInt])
        remainingCalories -= (relevantRecipes[randInt].calories / relevantRecipes[randInt].servings)
      }
      counter ++
    } while (ration.length < 3 && counter < 100);

    return {ration, remainingCalories}
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  getDetailsById,
  updateUserById,
  updateDetailsById,
  updateGoalById,
  getAllRecipes,
  getAllIngredients,
  calculateForUserById,
  getDailyRationById,
  getIngredientsById,
};