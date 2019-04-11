const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");



const app = express();
const server = require("http").Server(app);
const io =  require("socket.io")(server);

io.on("connection", socket=>{
    socket.on("connectTRoom", box=>{
        socket.join(box);
    });
});

mongoose.connect(
    "mongodb+srv://admin:admin@cluster0-nc1ba.mongodb.net/test?retryWrites=true",
    {
        useNewUrlParser: true
    }
);


app.use((req,res,next)=> {
    req.io = io; 
    return next();
})

//midleware responsavel em gerenciar o cors da aplicacao crossdomain
app.use(cors());

/*Midleware que ajuda o servidor a 
*  entender requisicoes no formato JSON
*/
app.use(express.json());

/*Midleware que ajuda o servidor a 
*  entender arquivo via upload
*/
app.use(express.urlencoded({extended:true}));

//configurando o servidor para resolver o path e direcionar o arquivo que esta na pasta tmp 
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));    


//importando o arquivo de rotas
app.use(require('./routes'));



server.listen(process.env.PORT || 3333);