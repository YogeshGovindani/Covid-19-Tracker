import React from 'react';
import { Line } from "react-chartjs-2";
import { useState, useEffect } from 'react';

const options = {
    legend: {
        display: false
    }
}

const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data[casesType]) {
        if (lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint
            }
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
}

function Graph(props) {
    const [data, setData] = useState({});

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=30')
            .then(response => response.json())
            .then(data => {
                const chartData = buildChartData(data, props.casesType);
                setData(chartData);
            })
    }, [props.casesType]);

    return (
        <div>
            {data.length > 0 &&
                <Line
                    options={options}
                    data={{
                        datasets: [
                            {
                                backgroundColor: "rgb(204, 5, 4)",
                                borderColor: 'CC1034',
                                data: data
                            }
                        ]
                    }}
                />
            }

        </div>
    )
}

export default Graph
