var mongoose = require('mongoose');
mongoose.connect('mongodb://taskapp:navjotsingh@cluster0-shard-00-00-4xokv.mongodb.net:27017,cluster0-shard-00-01-4xokv.mongodb.net:27017,cluster0-shard-00-02-4xokv.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true,
useCreateIndex:true,
useUnifiedTopology: true,
useFindAndModify:false
});
