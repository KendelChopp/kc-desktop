import io from 'socket.io-client';

const Socket = {
  endpoint: 'http://127.0.0.1:3001',
  socket: null,

  onCreatedRoom: null,

  connect() {
    this.socket = io('http://127.0.0.1:3001');
  },

  addEventListener(eventName, callback) {
    this.socket.on(eventName, callback);
    // TODO: allow multiple events
    // if (!this.eventListeners[eventName]) {
    //   this.eventListeners[eventName] = [callback];
    //   this.socket.on(eventName, (response) => {
    //
    //   })
    // } else {
    //   this.eventListeners[eventName].push(callback);
    // }
  },

  createRoom() {
    this.socket.emit('createRoom');

    if (this.onCreatedRoom) {
      this.socket.on('createdRoom', this.onCreatedRoom);
    }
  }
};

export default Socket;
