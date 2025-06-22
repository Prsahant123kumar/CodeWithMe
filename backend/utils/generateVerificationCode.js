const generateVerificationCode = (length = 6) => {
    const characters = '0123456789';
    let verificationCode = '';
  
    for (let i = 0; i < length; i++) {
        verificationCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log(verificationCode)
    return verificationCode;
  };
  
  module.exports = { generateVerificationCode };  // ✅ Correct export
  