const five = require('johnny-five');
const PubNub = require('pubnub');
const uuid = PubNub.generateUUID();
const pubnub = new PubNub({
  subscribeKey: 'sub-demo',
  publishKey: 'pub-demo',
  uuid: uuid
});


const board = new five.Board();

board.on('ready', function () {
  const tiltSensor = new five.Sensor.Digital({ pin: 2, freq: 250 });
  tiltSensor.on('change', function (event) {
    // event == 0 not tilted
    // event == 1 tilted
    console.log(event);
    if (event) {
      console.log('tilted');
    }
    pubnub.publish({
      channel: 'smart_pill_bottle_events',
      message: {
        sender: uuid,
        content: {
          bottle_tilted: !!event
        }
      }
    }, function (status, response) {
      console.log(status, response);
    });
  });
});