const express =require('express');
const app = express();

const server=require('http').createServer(app);
const cors=require('cors');

const io=require('socket.io')(server,{

    cors:{
        origin:'*',
        methods:['GETS','POST']
    }
});
app.use(cors());
const PORT=process.env.PORT||5000;
app.get('/',(req,res)=>{
    res.send('SERVER IS LISTENING ')
});
io.on('connection',(socket)=>{
    socket.emit('me',socket.id);
    socket.on('disconnect',()=>{
        socket.broadcast.emit('callended')
    });
    socket.on('calluser',({userTocall,signalData,from,name})=>{
        io.to(userTocall().emit('calluser',{signal:signalData,from,name}))
    })
    socket.on('answercall',(data)=>{
        io.to(data.io).emit('call accepted',data.signal)
    })
})
server.listen(PORT,()=>console.log(`server is listening at port :${PORT}`))