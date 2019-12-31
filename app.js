const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//get the config file
var {mqtt_server} = require('./mqtt_config');

//simulator model for leaky tank
let smodel = {
    tank_level: 805,
    capacity: 1000,
    high_level: 800,
    low_level: 200,
    hl_alarm: false,
    ll_alarm: false,
    pump: false
};


/* Websocket Configuration Section */

//on connection, join the socket to the leakytank room
io.on("connection", socket => {
    socket.join("leakytank");
    console.log("a user connected . . . ");
});

/* MQTT Section */
//connect to an MQTT server using the mqtt_config.json file
const mqtt = require('mqtt');
const client = mqtt.connect(mqtt_server);

//on connecting to the server, subscribe the command level topics for leakytank
client.on('connect', () => {
    client.subscribe('/leakytank/cmnd/#', err => {
        if(err) console.log(err);
    });
});

//on a message, update the simulator and send the message over the websocket
client.on("message", (topic, msg) => {
    const smsg = msg.toString();
    
    //if the topic matches leakytank pump -> handle the message
    if(topic === "/leakytank/cmnd/pump") {
        //set pump model value
        smodel.pump = (smsg == "1" || smsg.toLowerCase() == "on" );

        //send back the status for the pump
        client.publish('/leakytank/status/pump', smodel.pump ? "on" : "off");
    }
});


/* Web Server Section */
//send a static file that will connect to the websocket for retrieveing information related to the simulator
//File is sent on the base route and is titled index.html
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});


//start the web server
http.listen(3000, () => {
    console.log("Listening on port 3000");
});

/* Simulator Section */
//tick function to perform calculations and update model
const tick = function() {

    //update the tank level based on pump operation -- if the pump is running, raise tank level by 1/second
    // if the pump is not running, lower the tank level by 1/second
    smodel.tank_level = smodel.tank_level + (smodel.pump ? 1 : -1);

    //make sure the tank level never exceeds capacity or is negative
    smodel.tank_level = smodel.tank_level > smodel.capacity ? smodel.capacity : smodel.tank_level;
    smodel.tank_level = smodel.tank_level < 0 ? 0 : smodel.tank_level;

    //send tank level every second over MQTT
    client.publish("/leakytank/stat/level", smodel.tank_level.toString());

    //update the high and low level alarms based on the tank level
    //send an update over MQTT if a change has happened
    if(smodel.hl_alarm != smodel.tank_level > smodel.high_level){
        smodel.hl_alarm = smodel.tank_level > smodel.high_level;
        client.publish("/leakytank/stat/hla", smodel.hl_alarm ? "alarm" : "reset");
    }

    if(smodel.ll_alarm != smodel.tank_level < smodel.low_level){
        smodel.ll_alarm = smodel.tank_level < smodel.low_level;
        client.publish("/leakytank/stat/lla", smodel.ll_alarm ? "alarm" : "reset");
    }

    //send the entire model over the socket every second
    io.to("leakytank").emit("data", smodel);
}

//start the interval at 1000ms and perform calculations to update the simulator model
setInterval(tick, 1000);

