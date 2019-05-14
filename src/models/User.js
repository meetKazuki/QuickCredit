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

  static incrementCount() {
    User.count += 1;
  }

  /**
   * Creates a new resource
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
   * Update resource attribute
   *
   * @param {object} data attributes to modify
   * @returns {User} user resource
   */
  update(data) {
    this.firstName = data.firstName || this.firstName;
    this.lastName = data.lastName || this.lastName;
    this.address = data.address || this.address;
    this.email = data.email || this.email;
    this.status = data.status || this.status;

    return this;
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
