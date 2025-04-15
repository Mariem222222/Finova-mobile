import React from 'react';
import { WebView } from 'react-native-webview';

const ECharts = ({ option, backgroundColor, width, height }) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.2/dist/echarts.min.js"></script>
        <style>
          body, html {
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          #chart {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="chart"></div>
        <script type="text/javascript">
          var myChart = echarts.init(document.getElementById('chart'));
          myChart.setOption(${JSON.stringify(option)});
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      style={{ backgroundColor, width, height }}
    />
  );
};

export default ECharts;