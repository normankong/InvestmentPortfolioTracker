// const WebSocket = require("ws");
const uuid = require("uuid");
class SocketHelper {

  wsList = [];
  subscribeCallback = null;

  constructor(wss) {
    let _self = this;

    // const wss = new WebSocket.Server({server});
    console.log(`Initial WebSocketServer`)

    wss.on("connection", function connection(ws) {
      ws.id = uuid.v4();
      _self.wsList.push(ws);
      console.log(`Length of wsList: ${_self.wsList.length}`);

      ws.on("message", function message(data) {
                
        let symbol = data.toString();
        
        console.log("Received: %s from %s", symbol, ws.id);
        ws.symbol = symbol;
        _self.sendMessage(ws, "Received ! " + symbol);

        if (_self.subscribeCallback) {
          _self.subscribeCallback((symbol));
        }
      });

      ws.on('close', req => {
        console.log(`Connection ${ws.id} is closed`);
        _self.wsList.splice(_self.wsList.indexOf(ws), 1);
      });

      _self.sendMessage(ws, "Connection established");
    });
  }

  sendMessage = (ws, message) => {
    try {
      console.log(`Sending message to ${ws.id}`);
      ws.send(message);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  broadcasting = (quote) => {
    console.log(`Broadcasting to ${this.wsList.length} clients`);

    try{
      quote.data[0].s;
    }
    catch(ex){
      console.log(`Receiving unexpected message ${quote}`)
      return;
    }

    let message = JSON.stringify(quote, null, 2)
    let symbol = quote.data[0].s;
    let failedList = [];
    this.wsList.forEach((ws) => {

      if (ws.symbol !== symbol){ 
        console.log(`${ws.id} is not subscribed to ${symbol}`);
        return;
      }
      
      if (!this.sendMessage(ws, message)) {
        failedList.push(ws);
      }
    });

    // console.log(`Fail deliver record : ${failedList.length}`);
    for (let i = 0; i < failedList.length; i++) {
      console.log(`Removing failed connection ${failedList[i].id}`);
     this.wsList.splice(this.wsList.indexOf(failedList[i]), 1);
    }
  };

  addSubscriptionHandler = (subscribeCallback) => {
    this.subscribeCallback = subscribeCallback;
  }
}

module.exports = SocketHelper;
