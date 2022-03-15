import './App.css';
import { useCallback, useEffect, useState } from 'react';
import WebWorker from 'react-web-workers'
import Worker1 from './Workers/rrbf_worker';
import Worker2 from './Workers/callput_worker';
import CallPut from './components/callput';
import Heatmaps from './components/heatmaps';
import VolCurve from './components/volcurve';
import VolSmile from './components/volsmile';
import RRBF from './components/rrbf';

const Tabs = [
  'RR/BF Table',
  'Call/Put Table',
  'Vol Curve',
  'Vol Smile',
  'Heatmaps'
];

const TabComponenets = [
  RRBF,
  CallPut,
  VolCurve,
  VolSmile,
  Heatmaps
];

function App() {

  const [rrbfrows, setRRBFRows] = useState([]);
  const [callPutrows, setCallPutRows] = useState([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const [rrbf_worker] = new WebWorker([Worker1]);
    rrbf_worker.postMessage('Start');
    rrbf_worker.onmessage = ({ data }) => {
         // console.log('Message from Workers: ', data);
          // buffer it
          setRRBFRows(data); // every 400 ms, after first frame milliseconds
      };
      const [callput_worker] = new WebWorker([Worker2]);
      callput_worker.postMessage('Start');
      callput_worker.onmessage = ({ data }) => {
            //console.log('Message from Workers: ', data);
            // buffer it
            setCallPutRows(data);
        };
      return () => {
        if(rrbf_worker){
          rrbf_worker.postMessage('End');
          rrbf_worker.terminate();
        }
        if(callput_worker){
          callput_worker.postMessage('End');
          callput_worker.terminate();
        }
      }
  }, []);

  const renderTableComponents = useCallback(() => {
    switch(tab) {
      case 0: 
        return (<RRBF rows={rrbfrows}></RRBF>);
        break;
      case 1: 
        return (<CallPut rows={callPutrows}></CallPut>);
        break;
      case 2:
        return (<VolCurve></VolCurve>);
        break;
      case 3:
        return (<VolSmile></VolSmile>);
        break;
      case 4:
          return (<Heatmaps></Heatmaps>);
          break;
    }
  });

  const onClick =  useCallback((idx) => {
    setTab(idx)
  })
  // render tabs and corresponding rows
  return (
    <div className="App">
      <ul className="Appul">
      {Tabs && Tabs.map((tabs, idx) => {
        return (<li key={`${tabs}-${idx}`} onClick={() => setTab(idx)} className={tab === idx ? "li-selected" : "li-unselected" }>{tabs}</li>)
      })}
      </ul>
      <table className='table'>
        <tr>
          <th>Exp Date</th>
          <th>ATM</th>
          <th>25d R/R</th>
          <th>10d R/R</th>
          <th>25d B/F</th>
          <th>10d B/F</th>
        </tr>
        {/* <Table tab={tab} rrbfrows={rrbfrows} callPutrows={callPutrows}/> */}
        {renderTableComponents()}
      </table>
    </div>
  );
}

export default App;
