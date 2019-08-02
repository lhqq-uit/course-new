module.exports = {
  'secret': process.env.SECRET || 'LeThiMyHanh',
  // 'database': 'mongodb://localhost:27017/courses'
  'database': process.env.DATABASE || 'mongodb+srv://trantanloc279:Admin123456@cluster0-vet4b.mongodb.net/test?retryWrites=true&w=majority'
};
