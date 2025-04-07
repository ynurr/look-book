import { MongoClient } from 'mongodb'

const url = 'mongodb+srv://'+process.env.MONGODB_CREDENTIALS+'@cluster0.jd2wo.mongodb.net/lookbook?retryWrites=true&w=majority&appName=Cluster0'

const options = {}
let connectDB: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    if (!global._mongo) {
        global._mongo = new MongoClient(url, options).connect()
    }
    connectDB = global._mongo
} else {
    connectDB = new MongoClient(url, options).connect()
}

export { connectDB }