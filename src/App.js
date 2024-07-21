import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-streaming';
import { Chart } from 'chart.js';
import streamingPlugin from 'chartjs-plugin-streaming';

Chart.register(streamingPlugin);

function App() {
  const [data, setData] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:6789');

    ws.current.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    ws.current.onclose = () => {
      console.log('WebSocket Client Disconnected');
    };

    ws.current.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData((prevData) => [...prevData, newData]);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const chartData = {
    datasets: [{
      label: 'Sonar Data',
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      fill: false,
      data: data.map((d, index) => ({ x: Date.now() + index * 1000, y: d.distance }))
    }]
  };

  const options = {
    scales: {
      x: {
        type: 'realtime',
        realtime: {
          duration: 20000,
          refresh: 1000,
          delay: 1000,
          onRefresh: (chart) => {
            chart.data.datasets[0].data = data.map((d, index) => ({ x: Date.now() + index * 1000, y: d.distance }));
          }
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="App">
      <h1>Live Sonar Data Visualization</h1>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default App;
