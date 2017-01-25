//Les imports
import mqtt from 'mqtt';
import Sensor from '../model/Sensor';
import { addAction, updateAction } from '../redux/actions';
import { store } from '../index';

export function initConnection(chemin) {
  const clientMQTT = mqtt.connect(`mqtt://${chemin}`);
  setTimeout(null, 3000);
  return clientMQTT;
}

export function listening(clientMQTT){
  	clientMQTT.subscribe('#');

  	clientMQTT.on('message', (topic, message) => {

    const json = JSON.parse(message);
    const split = topic.split('/');
    const id = `${split[1]}`;
    const value = `${json.value}`;
    const data = { value };

   
    if (Sensor.idIsValid(id)){
      try {
        const s = new Sensor(split[1], split[1], json.type, data);
        store.dispatch(addAction(s));
      } 
      catch (e){
      }
    } 
    else 
    {
      store.dispatch(updateAction(id, value));
    }
  });
  return clientMQTT;
}

export function close(clientMQTT) {
 	 clientMQTT.end();
    	return {};
}
