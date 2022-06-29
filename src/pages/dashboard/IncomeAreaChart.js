import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import {
    formatNum,
    getDifDays,
    truncateTwoDecimals,
} from 'utils/utils';



// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({
    slot,
    ammountPeriods = 0,
    showOnlyInterest = false,
    datePeriods,
    allSeries,
    biggerValues,
    allChecked,
    height,
    width }) => {
    const theme = useTheme();
    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({
        chart: {
            toolbar: {
                show: false
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight',
            width: 2
        },
        markers: {
            size: 4,
        },
        legend: {
            show: false,
            // height: 0,
            // itemMargin: {
            //     horizontal: 0
            // }
            // fontSize: 'px',
        },
        annotations: {
            xaxis: [
                {
                    x: new Date().getTime(),
                    strokeDashArray: 8,
                    borderColor: '#775DD0',
                    label: {
                        borderWidth: 0,
                        orientation: 'horizontal',
                        style: {
                            background: '#775DD0',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 800,
                        },
                        text: 'Estimación según TNM'
                    }
                }
            ]
        }
    });

    useEffect(() => {
        // Options
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        const biggerValuesBySerie = biggerValues[showOnlyInterest ? 1 : 0];
        const biggerValueOfSelected = Math.round(Object.keys(biggerValuesBySerie)
            .reduce((bV, serieKey) => ((allChecked[serieKey] && biggerValuesBySerie[serieKey] > bV)
                ? biggerValuesBySerie[serieKey] : bV), 0));

        setOptions((prevState) => ({
            ...prevState,
            // chart: {
            //     ...prevState.chart,
            //     events: { zoomed: () => setZoomed(true) }
            // },
            colors: [theme.palette.primary.main, theme.palette.primary[700]],
            xaxis: {
                // categories: datePeriods.reduce((all, date) => [
                //     ...all,
                //     months[date.getMonth()] + ", " + date.getFullYear()
                // ], []),
                // overwriteCategories: [1622516400000, 1625108400000, 1627786800000, 1630465200000, 1633057200000, 1635735600000, 1638327600000, 1641006000000, 1643684400000, 1646103600000, 1648782000000, 1651374000000],
                // categories: [1622516400000, 1625108400000, 1627786800000, 1630465200000, 1633057200000, 1635735600000, 1638327600000, 1641006000000, 1643684400000, 1646103600000, 1648782000000, 1651374000000],
                type: 'numeric',
                min: datePeriods[0],
                max: new Date(datePeriods[datePeriods.length - 2]).setDate(31),
                labels: {
                    // formatter: (v, timestamp, opt) => {
                    //     /*console.log("ACA", v, opt);*/
                    //     const difDays = getDifDays(opt?.w?.globals?.minX, opt?.w?.globals?.maxX)
                    //     if (difDays >= 360) {
                    //         console.log("1ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                    //         return (new Date(v).getDate() + ' ' + months[new Date(v).getMonth()] + ', ' + new Date(v).getFullYear())
                    //     } else if (difDays < 800) {
                    //         console.log("2ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                    //         return (months[new Date(datePeriods[opt?.i]).getMonth()] + ', ' + new Date(datePeriods[opt?.i]).getFullYear())
                    //     } else {
                    //         console.log("3ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                    //         return (new Date(datePeriods[opt?.i]).getFullYear())
                    //     }
                    // },
                    formatter: (v, timestamp, opt) => {
                        /*console.log("ACA", v, opt);*/ return getDifDays(opt?.w?.globals?.minX, opt?.w?.globals?.maxX) >= 360
                            ? months[new Date(datePeriods[opt?.i]).getMonth()] + ', ' + new Date(datePeriods[opt?.i]).getFullYear()
                            : new Date(v).getDate() + ' ' + months[new Date(v).getMonth()] + ', ' + new Date(v).getFullYear()
                    },
                    // datetimeFormatter: {
                    //     year: 'yyyy',
                    //     month: 'MMM \'yy',
                    //     day: 'dd MMM',
                    //     hour: 'HH:mm'
                    // },
                    trim: true,
                    showDuplicates: false,
                    style: {
                        colors: [
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary
                        ]
                    }
                },
                axisBorder: {
                    show: true,
                    color: line
                },
                tickAmount: 12 - 1
            },
            yaxis: {
                max: biggerValueOfSelected,
                labels: {
                    formatter: (v) => "$" + formatNum(v),
                    style: {
                        colors: [secondary]
                    }
                },
            },
            grid: {
                borderColor: line,
                strokeDashArray: 0,
                // padding: {
                //     left: 30,
                //     right: 90,
                //     bottom: 0,
                // }
            },
            tooltip: {
                theme: 'light',
                // intersect: true,
                x: {
                    formatter: (v) => new Date(v).getDate() + ' ' +
                        months[new Date(v).getMonth()] + ', ' + new Date(v).getFullYear(),
                },
                y: {
                    formatter: (v, { dataPointIndex, seriesIndex }) => {
                        const accountSerie = Object.values(allSeries).filter(s => allChecked[s.id])?.[seriesIndex]
                        const actualPointDate = showOnlyInterest
                            ? accountSerie?.intAccSerie?.[dataPointIndex]?.[0]
                            : accountSerie?.resIntAccSerie?.[dataPointIndex]?.[0]
                        const percValue = accountSerie?.intAccPercSerie?.find(percPoint => percPoint[0] === actualPointDate)?.[1];
                        return ((v < 0) ? '-$' + formatNum(v) * (-1) : '$' + formatNum(v))
                            + (percValue ? " (" + (percValue < 0 ? "-" : "+") + percValue + "%)" : "")
                    },
                },
                onDatasetHover: {
                    highlightDataSeries: true,
                },
            },
        }));
    }, [
        primary,
        secondary,
        line,
        theme,

        slot,
        allChecked,
        ammountPeriods,
        showOnlyInterest,

        datePeriods,
        allSeries,
        biggerValues
    ])


    useEffect(() => {
        if (allSeries?.length) {
            setSeries(allSeries.reduce((prevIntAcc, actIntAcc) => (allChecked[actIntAcc.id] ? [...prevIntAcc,
            {
                name: actIntAcc.name,
                data: [...(showOnlyInterest ? actIntAcc.intAccSerie : actIntAcc.resIntAccSerie)]
                    .reduce((prevPoint, actPoint) => [...prevPoint, [actPoint[0], truncateTwoDecimals(actPoint[1])]], []),
            }] : prevIntAcc), []))
        }
    }, [showOnlyInterest, allSeries, allChecked])
    return <ReactApexChart options={options} series={series.length ? series : [{ data: [[0, 0]] }]} type="area" height={height} width={width} />;
};

IncomeAreaChart.propTypes = {
    slot: PropTypes.number,
    height: PropTypes.string,
    width: PropTypes.string,
};

export default IncomeAreaChart;
