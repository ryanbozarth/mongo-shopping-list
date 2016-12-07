exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://ryanbozarth:QmdrKcFz3UB@ds031681.mlab.com:31681/mongo-shopping-list-db' :
                            'mongodb://localhost/shopping-list-dev');
exports.PORT = process.env.PORT || 8080;
