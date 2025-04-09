const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if(!firstName || !lastName || !emailId || !password) {
    return "All fields are mandatory";
  }
};

module.exports = {
  validateSignUpData,
};
