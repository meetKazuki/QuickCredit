import bcrypt from 'bcryptjs';
import DB from '../database';

export default class User {
  /**
   * Creates an instance of User
   *
   * @param {Object} attributes user attributes
   */
  constructor({
    firstName,
    lastName,
    address,
    email,
    password,
  }) {
    User.incrementCount();
    this.id = User.count;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.email = email;
    this.password = bcrypt.hashSync(password, 8);
    this.status = 'unverified';
    this.isAdmin = false;
  }

  toString() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      email: this.email,
      isAdmin: this.isAdmin,
    };
  }

  static incrementCount() {
    User.count += 1;
  }

  /**
   * Returns a list of user resources
   *
   * @returns {[User]} a list of user resources
   */
  static all() {
    return User.table;
  }

  /**
   * Find resource by given ID
   *
   * @param {string} id resource identity number
   * @returns {User} a User resource
   */
  static find(id) {
    return User.table.find(user => user.id === id);
  }

  /**
   * Find resource by given email
   *
   * @param {string} email resource email
   * @returns {User} a User resource
   */
  static findByEmail(email) {
    return User.table.find(user => user.email === email);
  }

  /**
   * Create a new resource
   *
   * @param {object} attributes the resource attributes
   * @returns {User} a User resource
   */
  static create(attributes) {
    const user = new User(attributes);
    User.table.push(user);
    return user;
  }

  /**
   * Assign admin privilege to user resource
   *
   * @param {User} user user object
   */
  static assignAdmin(user) {
    const userObject = User.find(user.id);
    userObject.isAdmin = true;
  }

  /**
   * Resets user table
   */
  static resetTable() {
    User.table = [];
    User.count = 0;
  }
}

User.table = DB.users;
User.count = User.table.length;
