import userDB from './mock-users';

export default class User {
  constructor(attributes) {
    User.incrementCount();
    this.id = User.count;
    this.firstName = attributes.firstName;
    this.lastName = attributes.lastName;
    this.address = attributes.address;
    this.email = attributes.email;
    this.password = attributes.password;
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

  adminPrivilege(value) {
    this.isAdmin = value;
  }

  static assignAdmin(user) {
    user.adminPrivilege(true);
  }

  static incrementCount() {
    User.count += 1;
  }
}

User.count = userDB.length;
