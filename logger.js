
module.exports =  (req, res, next) => {
    console.log(`this is the first middleware`);
    next()
  }