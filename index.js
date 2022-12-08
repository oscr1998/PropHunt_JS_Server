const app = require('express')();
const http = require('http').Server(app);

const { instrument } = require('@socket.io/admin-ui')
const io = require('socket.io')(http, {
    cors: {
        origin: ['https://admin.socket.io', 'http://localhost:3000' , 'https://revelio.netlify.app'],
        methods: ["GET", "POST"],
        credentials: true,
    }
});

const players = {
    //* Schema
    // room1: {
    //     id1: { id: "", username: "", character: "", x: 0, y: 0, .propIndices : [0, 1] },
    //     id2: { id: "", username: "", character: "", x: 0, y: 0, .propIndices : [0, 1] },
    // },
    // room2: {
    //     id1: { id: "", username: "", character: "", x: 0, y: 0, .propIndices : [0, 1] },
    //     id2: { id: "", username: "", character: "", x: 0, y: 0, .propIndices : [0, 1] },
    // },
}

io.on('connection', (socket) => {
    console.log(`player ${socket.id} connected`);

    socket.on('join-room', (room, isHost, gameInfo, cb) => {
        
        // if not host and room does not exist
        if (!isHost && Object.keys(players).filter(r => r === room).length === 0){
            cb({ id: socket.id, room: null })
        } else {
            if(isHost){
                console.log(`Host ${socket.id} has created room ${room}`);
                players[room] = {}
                players[room][socket.id] = {
                    id: socket.id,
                    username: "",
                    isHost: isHost,
                    gameInfo: gameInfo,
                }
            } else {
                console.log(`player ${socket.id} joined room ${room}`);
                players[room][socket.id] = {
                    id: socket.id,
                    username: "",
                    isHost: isHost,
                    gameInfo: Object.values(players[room]).filter(p => p.isHost === true)[0].gameInfo
                } 
            }
            socket.join(room)
            cb({ id: socket.id, room: room })
            io.to(room).emit('update-room', players[room])
        }
    })

    socket.on('start-game', (room) => {
        // Get game info
        const mapIdx = players[room][socket.id].gameInfo.map 

        // Algorithm to decide who is the seeker
        const listOfPlayers = Object.keys(players[room])
        const seekerIdx = Math.floor(Math.random() * listOfPlayers.length)
        const seekerID = listOfPlayers[seekerIdx]
        const listOfHiders = Object.keys(players[room]).filter(p => p !== seekerID)
        const listOfSeekers = Object.keys(players[room]).filter(p => p === seekerID)

        //Algorithm to decide each players' spawn location
        const hiders_coords = [
            [{ x: 880, y: 700 }, { x: 930, y: 700 }, { x: 980, y: 700 }, { x: 1030, y: 700 }],
            [{ x: 1900, y: 320 }, { x: 1950, y: 320 }, { x: 2000, y: 320 }, { x: 2050, y: 320 }]
        ]

        const seekers_coords = [
            [{ x: 1800, y: 900 }, { x: 1800, y: 950 }],
            [{ x: 300, y: 2000 }, { x: 320, y: 2000 }]
        ]

        listOfHiders.forEach((id, idx) => {
            players[room][id] = {
                ...players[room][id],
                character: "hider",
                velocity: 350,
                isAlive: true,
                x: hiders_coords[mapIdx-1][idx].x,
                y: hiders_coords[mapIdx-1][idx].y,
                propIndices: null
            }
        })

        listOfSeekers.forEach((id, idx) => {
                players[room][id] = {
                    ...players[room][id],
                    character: "seeker",
                    velocity: 425,
                    isAlive: true,
                    x: seekers_coords[mapIdx-1][idx].x,
                    y: seekers_coords[mapIdx-1][idx].y,
                    propIndices: null
                }
            })

        //Ignore
        io.to(room).emit('update-room', players[room])
        //Ignore

        console.log(players[room]);

        io.to(room).emit('teleport-players')

    })

    socket.on("in-game", (room) => {
        io.to(room).emit('update-client', players[room])
    })

    socket.on("moved", (coords, room) => {
        players[room][socket.id].x = coords.x
        players[room][socket.id].y = coords.y
        io.to(room).emit('update-client', players[room])
    })

    socket.on("endGame", (room, results) => {
        io.to(room).emit('results', results)
        // delete players[room]
    })
    
    socket.on("killed", (room, H_id) => {
        players[room][H_id].isAlive = false
        players[room][H_id].propIndices = null
        io.to(room).emit('update-client', players[room])
    })

    socket.on("changedProp", (room, randomSize, randomId ) => {
        players[room][socket.id].propIndices = [randomSize, randomId]
        io.to(room).emit('update-client', players[room])
    })

    //!
    // socket.on('exit-all-rooms', () => {
    //     Array.from(socket.rooms).forEach(
    //         room => {
    //             if (room !== socket.id && players[room]) {
    //                 socket.leave(room)
    //                 delete players[room][socket.id]
    //                 io.to(room).emit('update-room', players[room])
    //                 console.log(`player ${socket.id} left room ${room}`);
    //             }
    //         }
    //     )
    // })

    socket.on('disconnecting', () => {
        Array.from(socket.rooms).forEach(
            room => {
                if (room !== socket.id && players[room]) {
                    delete players[room][socket.id]
                    io.to(room).emit('update-room', players[room])
                    console.log(`player ${socket.id} left room ${room}`);
                }
            }
        )
    })

    socket.on('disconnect', () => {
        console.log(`player ${socket.id} disconnected`);
    });
});

const port = process.env.PORT || 3030
http.listen(port, () => {
    console.log(`server listening on ${port}`);
});


instrument(io, {
    auth: false
});
