const five = require('johnny-five');
const PubNub = require('pubnub');
const uuid = PubNub.generateUUID();
const pubnub = new PubNub({
  subscribeKey: 'sub-c-fa806a90-f675-11e9-8dd7-ca99873d233c',
  publishKey: 'pub-c-7c75b730-15fd-4037-9c5d-81d072993831',
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