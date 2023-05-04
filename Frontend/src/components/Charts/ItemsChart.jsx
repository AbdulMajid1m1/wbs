// import React from 'react'
// // import { charts } from '../Config/Data';


// export const charts = [
//     {
//         "label": "Jan",
//         "value": "420000"
//     },
//     {
//         "label": "Feb",
//         "value": "810000"
//     },
//     {
//         "label": "Mar",
//         "value": "720000"
//     },
//     {
//         "label": "Apr",
//         "value": "550000"
//     },
//     {
//         "label": "May",
//         "value": "910000"
//     },
//     {
//         "label": "Jun",
//         "value": "510000"
//     },
//     {
//         "label": "Jul",
//         "value": "680000"
//     },
//     {
//         "label": "Aug",
//         "value": "620000"
//     },
//     {
//         "label": "Sep",
//         "value": "610000"
//     },
//     {
//         "label": "Oct",
//         "value": "490000"
//     },
//     {
//         "label": "Nov",
//         "value": "900000"
//     },
//     {
//         "label": "Dec",
//         "value": "730000"
//     }
// ]


// const ItemsChart = ({ ReactFC }) => {
//   const chartConfigs = {
//     type: "column3d", // The chart type
//     width: "100%", // Width of the chart
//     height: "400", // Height of the chart
//     dataFormat: "json", // Data type
//     dataSource: {
//       // Chart Configuration
//       chart: {
//         caption: "Monthly revenue for last year",
//         subCaption: "Harry's SuperMart",
//         xAxisName: "Month",
//         yAxisName: "Revenues (In USD)",
//         theme: "fusion"
//     },
//       // Chart Data - from step 2
//       data: charts
//     }
//   };

//   return (<ReactFC {...chartConfigs}/>)
// }

// export default ItemsChart


import React, { useState, useEffect } from 'react'
import axios from 'axios'
import userRequest from '../../utils/userRequest'

const ItemsChart = ({ ReactFC }) => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    userRequest.get('/getTblShipmentReceivedCLStats')
      .then(res => {
        const chartData = [
          {
            label: "Unique Shipment Count",
            value: res.data.uniqueShipmentCount
          },
          {
            label: "Total Receipts",
            value: res.data.totalReceipts
          },
          {
            label: "Total Items",
            value: res.data.totalItems || 0 
          }
        ]
        setChartData(chartData)
      })
      .catch(err => console.log(err))
  }, [])

  const chartConfigs = {
    type: "column3d", // The chart type
    width: "100%", // Width of the chart
    height: "400", // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        caption: "Shipment Statistics",
        subCaption: "Statistics for shipped products",
        xAxisName: "Metric",
        yAxisName: "Value",
        theme: "fusion"
      },
      // Chart Data - from step 2
      data: chartData
    }
  }

  return (<ReactFC {...chartConfigs}/>)
}

export default ItemsChart
