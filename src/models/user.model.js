export default class User {
  constructor(userId, name, email, password) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  // to add user in the user list
  static addUser(name, email, password) {
    const checkIfUserExists = users.find((u) => u.email === email);
    if (checkIfUserExists) return { msg: "Email already Exists. Please login.", user: null };
    users.push(new User(users.length + 1, name, email, password));
    return { msg: null, user: User.fetchUser(users.length-1) };
  }

  // function to get user details by id
  static fetchUser(userId) {
    return users.find((u) => u.userId === userId);
  }

  // function to authenticate user while logging in
  static authenticateUser(userData) {
    return users.find((u) => u.email === userData.email && u.password === userData.password);
  }
}

// Memory variable to store all the registered users
let users = new Array();

User.addUser("Chanakya", "chanakyapt@gmail.com", "12345");
