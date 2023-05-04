// import React from 'react'
// // import { data } from '../Config/Data';



// // Preparing the chart data
// export const data = [
//     {
//       label: "Venezuela",
//       value: "290"
//     },
//     {
//       label: "Saudi",
//       value: "260"
//     },
//     {
//       label: "Canada",
//       value: "180"
//     },
//     {
//       label: "Iran",
//       value: "140"
//     },
//     {
//       label: "Russia",
//       value: "115"
//     },
//     {
//       label: "UAE",
//       value: "100"
//     },
//     {
//       label: "US",
//       value: "30"
//     },
//     {
//       label: "China",
//       value: "30"
//     }
//   ];




// const ShipementReceivedChart = ({ReactFC}) => {
//     const chartConfigs = {
//         type: "pie3d", // The chart type
//         width: "100%", // Width of the chart
//         height: "400", // Height of the chart
//         dataFormat: "json", // Data type
//         dataSource: {
//           // Chart Configuration
//           chart: {
//             caption: "Shipment Statistics",
//             subCaption: "Statistics for shipped products",
//             enableSmartLabels: "0",
//             startingAngle: "0",
//             showPercentValues: "1",
//             decimals: "1",
//             useDataPlotColorForLabels: "1",
//             theme: "fusion"
//         },
//           // Chart Data - from step 2
//           data: data
//         }
//       };

//   return (<ReactFC {...chartConfigs}/>)
// }

// export default ShipementReceivedChart



import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import userRequest from '../../utils/userRequest';

const ShipementReceivedChart = ({ ReactFC }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch data from API
    userRequest.get('/getTblShipmentReceivedCLStats')
      .then(response => {
        const data = response.data;
        // Update chart data with API data
        const updatedData = [
          { label: 'Unique Shipment Count', value: data.uniqueShipmentCount },
          { label: 'Total Receipts', value: data.totalReceipts },
          { label: 'Total Items', value: data.totalItems || 0 }
        ];
        setChartData(updatedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const chartConfigs = {
    type: 'pie3d', // The chart type
    width: '100%', // Width of the chart
    height: '400', // Height of the chart
    dataFormat: 'json', // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        caption: 'Shipment Statistics',
        subCaption: 'Statistics for shipped products',
        enableSmartLabels: '0',
        startingAngle: '0',
        showPercentValues: '1',
        decimals: '1',
        useDataPlotColorForLabels: '1',
        theme: 'fusion'
      },
      // Chart Data - from step 2
      data: chartData
    }
  };

  return <ReactFC {...chartConfigs} />;
};

export default ShipementReceivedChart;
