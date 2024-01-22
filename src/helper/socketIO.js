let io;
function initializeSocket(httpServer) {
    const socketIO = require("socket.io");
    io = socketIO(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    });
    io.on("connection", (socket) => {       
        console.log("User " + socket.id + " connected into room");
        socket.emit("getId", socket.id);       
        socket.on("sendDataClient", function (data) { // vừa nhận vừa gửi
            console.log(data);
            io.emit("sendDataServer", { data });
        });
        socket.on("eventChange", function (data2) {
            console.log(data2)
            // Thực hiện xử lý hoặc truyền thông tin đến các client khác nếu cần
        });
        socket.on("client-event", function (data3) { // vừa nhận vừa gửi
            console.log(data3)
           // io.emit("sendDataServer", { data });
        });
        socket.on("disconnect", () => {
            console.log("User " + socket.id + " leave room");
        });
    });
}
function getIO() {
    if (!io) {
        throw new Error("Socket.IO is not initialized");
    }
    return io;
}
module.exports = {
    initializeSocket,
    getIO,
    io, //global invariable
};
