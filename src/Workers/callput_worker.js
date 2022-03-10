const callput_worker = () => {
    const MAX_FRAME_SIZE = 40;
    const SEND_UPDATE_ON_NTH_TIME = 100;
    let interval = -1
    let frame = []
    let counter = 0;
  
    const sendData = (data) => {
      // eslint-disable-next-line no-restricted-globals
      self.postMessage(data)
    }
  
    const generateRandomDate = () => {
        return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
    }

    const createRabdomRow = () => {
        function appendLeadingZeroes(n){
            if(n <= 9){
              return "0" + n;
            }
            return n
          }
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }
        const componenets = generateRandomDate().toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
          }).split(' ');
        const e = appendLeadingZeroes(componenets[0]) + ' ' + componenets[1] + ', ' + componenets[2];
        const a = Math.trunc(getRandomArbitrary(1, 10) * 100) / 100;
        const r1 = -Math.trunc(getRandomArbitrary(0, 1) * 100) / 100;
        const r2 = -Math.trunc(getRandomArbitrary(0, 1) * 100) / 100;
        const b1 = -Math.trunc(getRandomArbitrary(0, 1) * 100) / 100;
        const b2 = -Math.trunc(getRandomArbitrary(0, 1) * 100) / 100;

        return {
            e,
            a,
            r1,
            r2,
            b1,
            b2
        };
    }

    // eslint-disable-next-line no-restricted-globals
    self.onmessage = ({ data }) => {
        switch (data) {
            case 'Start':{
                if(interval < 0){ 
                    // faking receiving of websocket messages 
                    interval = setInterval(() => { 
                            if(frame.length < MAX_FRAME_SIZE){
                                // intially when frame size is less, we send every update, i.e., every 1 ms
                                frame.push(createRabdomRow());
                                sendData(frame);
                            } else {
                                counter++;
                                frame.push(createRabdomRow());
                                frame.shift();
                                // every 400 milliseconds(that is every 4 mesage, we update the UI)
                                if(counter === SEND_UPDATE_ON_NTH_TIME){
                                    sendData(frame);
                                    counter = 0;
                                }
                            }
                    }, 1) // every 1 millisecons we receive a message
                }
                break;
            }
            case 'End': {
                if(interval){ 
                    console.log('clearing the innterval');
                    frame = [];
                    clearInterval(interval);
                }
                break;
            }
    
        }
    }
  }
  
  export default callput_worker;

  
  