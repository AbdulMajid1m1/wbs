import React from 'react'
// import { data } from '../Config/Data';



// Preparing the chart data
export const data = [
    {
      label: "Venezuela",
      value: "290"
    },
    {
      label: "Saudi",
      value: "260"
    },
    {
      label: "Canada",
      value: "180"
    },
    {
      label: "Iran",
      value: "140"
    },
    {
      label: "Russia",
      value: "115"
    },
    {
      label: "UAE",
      value: "100"
    },
    {
      label: "US",
      value: "30"
    },
    {
      label: "China",
      value: "30"
    }
  ];




const ShipementReceivedChart = ({ReactFC}) => {
    const chartConfigs = {
        type: "pie3d", // The chart type
        width: "100%", // Width of the chart
        height: "400", // Height of the chart
        dataFormat: "json", // Data type
        dataSource: {
          // Chart Configuration
          chart: {
            // caption: "Split of Visitors by Age Group",
            // subCaption: "Last year",
            enableSmartLabels: "0",
            startingAngle: "0",
            showPercentValues: "1",
            decimals: "1",
            useDataPlotColorForLabels: "1",
            theme: "fusion"
        },
          // Chart Data - from step 2
          data: data
        }
      };

  return (<ReactFC {...chartConfigs}/>)
}

export default ShipementReceivedChart