const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: 3001, path: '/' });
const http = require('http');
const socketIO = require('socket.io');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room');

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);

const io = socketIO(server);

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB', err));

app.use('/api/auth', authRoutes);   
app.use('/api/rooms', roomRoutes);  

io.on('connection', (socket) => {
    console.log('Novo cliente conectado: ' + socket.id);

    socket.on('join-room', (roomId, userId) => {
        console.log(`Usuário ${userId} entrou na sala ${roomId}`);
        socket.join(roomId);
        
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('disconnect', () => {
            console.log(`Usuário ${userId} desconectou da sala ${roomId}`);
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });

    socket.on('signal', (data) => {
        const { roomId, signalData } = data;
        socket.to(roomId).emit('signal', signalData);
    });
});

app.get('/', (req, res) => {
    res.send('Servidor rodando...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
