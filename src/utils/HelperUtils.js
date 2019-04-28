class HelperUtils {
  static validate() {
    return {
      name: /^[a-zA-Z]+$/,
      email: /^([A-z0-9-_.]+)@([A-z0-9-_.]+)\.([A-z]{2,3})$/,
    };
  }
}

export default HelperUtils;
