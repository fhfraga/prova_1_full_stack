const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth'); 
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const validateRoom = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        description: Joi.string().optional(),
        capacity: Joi.number().integer().min(1).required(), 
    });
    return schema.validate(data);
};

router.post('/', auth, async (req, res) => {
    const { error } = validateRoom(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const newRoom = new Room({
            _id: uuidv4(),
            name: req.body.name,
            description: req.body.description,
            capacity: req.body.capacity,
            participants: [req.user.id], 
            isActive: true,
            createdAt: new Date(),
        });

        await newRoom.save();
        res.status(201).json({ msg: 'Sala criada com sucesso', room: newRoom });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar a sala' });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

router.post('/join', auth, async (req, res) => {
    const { roomId } = req.body;

    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ msg: 'Sala não encontrada' });
        }

        if (room.participants.includes(req.user.id)) {
            return res.status(400).json({ msg: 'Você já está na sala' });
        }

        if (room.participants.length >= room.capacity) {
            return res.status(400).json({ msg: 'A sala está cheia' });
        }

        room.participants.push(req.user.id);
        await room.save();

        const vagasRestantes = room.capacity - room.participants.length - 1;

        res.json({
            msg: `Você entrou na sala: ${room.name}`,
            room,
            vagasRestantes,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;

// Documentação

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - name
 *         - capacity
 *       properties:
 *         id:
 *           type: string
 *           description: O ID da sala
 *         name:
 *           type: string
 *           description: O nome da sala
 *         description:
 *           type: string
 *           description: A descrição da sala
 *         capacity:
 *           type: integer
 *           description: A capacidade máxima de participantes
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: A data de criação da sala
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *           description: Os IDs dos participantes da sala
 */

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Criar uma nova sala com um token JWT
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar a sala
 */

/**
 * @swagger
 * /api/rooms/join:
 *   post:
 *     summary: Entrar em uma sala já criada
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Entrou na sala com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 room:
 *                   $ref: '#/components/schemas/Room'
 *                 vagasRestantes:
 *                   type: integer
 *       400:
 *         description: Sala cheia ou usuário já na sala
 *       404:
 *         description: Sala não encontrada
 *       500:
 *         description: Erro ao entrar na sala
 */