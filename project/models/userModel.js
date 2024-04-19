const { db, food } = require("../config/db.js");
const bcrypt = require("bcrypt");

module.exports = {
  createUser: async (user) => {
    const { username, password, email, height, weight, age, activity, goal_weight, goal_time} = user;
    const trx = await db.transaction();
    try {
      // Insert user data into the 'users' table
      const [userid] = await trx("users").insert(
        { email, username},
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
  },
  //for register
  getUserByEmail: async (email) => {
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
  },
  getAllUsers: async () => {
    try {
      const users = await db("users");
      return users;
    } catch (error) {
      throw error;
    }
  },
  getUserById: async (id) => {
    try {
      const user = await db("users").where({ id }).first();
      return user;
    } catch (error) {
      throw error;
    }
  },
  getDetailsById: async (id) => {
    try {
      const user = await db("user_details").where({ user_id: id }).first();
      return user;
    } catch (error) {
      throw error;
    }
  },
  updateUserById: async (id, updatedUser) => {
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
        await db("hashpwd").where({ userid: id }).update({ password });
      }
    } catch (error) {
      throw error;
    }
  },
  updateDetailsById: async (id, updatedDetails) => {
    try {
      await db("user_details").where({ user_id: id }).update(updatedDetails);
    } catch (error) {
      throw error;
    }
  },
  updateGoalById: async (id, updatedDetails) => {
    try {
      await db("user_details").where({ user_id: id }).update(updatedDetails);
    } catch (error) {
      throw error;
    }
  },
};
