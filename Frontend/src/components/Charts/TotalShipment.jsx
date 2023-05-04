// import React from 'react'
// // import { data } from "../Config/Data";

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


  
// const TotalShipment = ({ReactFC}) => {
//     const chartConfigs = {
//         type: "column2d", // The chart type
//         width: "100%", // Width of the chart
//         height: "400", // Height of the chart
//         dataFormat: "json", // Data type
//         dataSource: {
//           // Chart Configuration
//           chart: {
//             caption: "Countries With Most Oil Reserves [2017-18]",    //Set the chart caption
//             subCaption: "In MMbbl = One Million barrels",             //Set the chart subcaption
//             xAxisName: "Country",           //Set the x-axis name
//             yAxisName: "Reserves (MMbbl)",  //Set the y-axis name
//             numberSuffix: "K",
//             theme: "fusion"                 //Set the theme for your chart
//           },
//           // Chart Data - from step 2
//           data: data
//         }
//       };
    
//   return (<ReactFC {...chartConfigs}/>)
// }

// export default TotalShipment


// import React, { useState, useEffect } from 'react'
// import axios from 'axios'

// export const TotalShipment = ({ ReactFC }) => {
//   const [data, setData] = useState([])

//   useEffect(() => {
//     axios.get('https://dummyjson.com/products')
//       .then(response => {
//         const chartData = [{
//           label: response.data.brand,
//           value: response.data.stock
//         }]
//         setData(chartData)
//       })
//       .catch(error => console.log(error))
//   }, [])

//   const chartConfigs = {
//     type: 'column2d',
//     width: '100%',
//     height: '400',
//     dataFormat: 'json',
//     dataSource: {
//       chart: {
//         caption: 'Stock by Brand',
//         subCaption: 'Number of units in stock by brand',
//         xAxisName: 'Brand',
//         // yAxisName: 'Stock (units)',
//         theme: 'fusion'
//       },
//       data: data
//     }
//   }

//   return (
//     <ReactFC {...chartConfigs} />
//   )
// }

// export default TotalShipment


// import React, { useState, useEffect } from 'react'
// import axios from 'axios'

// const MyChart = ({ReactFC}) => {
//   const [products, setProducts] = useState([])

//   useEffect(() => {
//     axios.get('https://dummyjson.com/products')
//       .then(res => {
//         const productsData = res.data.products.map(product => {
//           return {
//             label: product.title,
//             value: product.price
//           }
//         })
//         setProducts(productsData)
//       })
//       .catch(err => console.log(err))
//   }, [])

//   const chartConfigs = {
//     type: "column2d",
//     width: "100%",
//     height: "400",
//     dataFormat: "json",
//     dataSource: {
//       chart: {
//         caption: "Product Prices",
//         subCaption: "Prices of various products",
//         xAxisName: "Product",
//         yAxisName: "Price (USD)",
//         numberSuffix: "$",
//         theme: "fusion"
//       },
//       data: products
//     }
//   }

//   return (
//     <ReactFC {...chartConfigs} />
//   )
// }

// export default MyChart


import React, { useState, useEffect } from 'react'
import userRequest from '../../utils/userRequest'

const MyChart = ({ReactFC}) => {
  const [shipmentData, setShipmentData] = useState({})

  useEffect(() => {
    userRequest.get('/getTblShipmentReceivedCLStats')
      .then(res => {
        const shipmentData = res.data
        setShipmentData(shipmentData)
      })
      .catch(err => console.log(err))
  }, [])

  const chartConfigs = {
    type: "column2d",
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Shipment Statistics",
        subCaption: "Statistics for shipped products",
        xAxisName: "Metric",
        yAxisName: "Value",
        theme: "fusion"
      },
      data: [
        {
          label: "Unique Shipment Count",
          value: shipmentData.uniqueShipmentCount || 0
        },
        {
          label: "Total Receipts",
          value: shipmentData.totalReceipts || 0
        },
        {
          label: "Total Items",
          value: shipmentData.totalItems || 0
        }
      ]
    }
  }

  return (
    <ReactFC {...chartConfigs} />
  )
}

export default MyChart
