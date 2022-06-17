import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
    chart: {
        height: 500,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight',
        width: 2
    },
    markers: {
        size: 5,
    },
    grid: {
        strokeDashArray: 0
    }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot, ammountPeriods, interestAccounts }) => {
    const theme = useTheme();

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState(areaChartOptions);
    const [datePeriods, setDatePeriods] = useState([])

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    useEffect(() => {
        let periodsArray = []
        for (let i = 0; i < ammountPeriods; i++) {
            const now = new Date();
            if (now.getMonth() + i > 11) {
                periodsArray.push(new Date(now.getFullYear() + 1, now.getMonth() + i - 12, 1))
            } else {
                periodsArray.push(new Date(now.getFullYear(), now.getMonth() + i, 1))
            }
        }
        setDatePeriods(periodsArray)
    }, [ammountPeriods])


    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary.main, theme.palette.primary[700]],
            xaxis: {
                categories: datePeriods.reduce((all, date) => [
                    ...all,
                    months[date.getMonth()] + ", " + date.getFullYear()
                ], []),
                labels: {
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
                tickAmount: ammountPeriods
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [secondary]
                    }
                }
            },
            grid: {
                borderColor: line
            },
            tooltip: {
                theme: 'light'
            }
        }));
    }, [primary, secondary, line, theme, slot, datePeriods]);

    const [series, setSeries] = useState({
        PAST: [
            {
                name: 'Page Views',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35]
            },
            {
                name: 'Sessions',
                data: [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41]
            }
        ],
        FUTURE: [
            {
                name: 'Page Views',
                data: [31, 40, 28, 51, 42, 109, 100, 28, 115, 48, 210, 136]
            },
            {
                name: 'Sessions',
                data: [11, 32, 45, 32, 34, 52, 41, 820, 430, 354, 210, 136]
            }
        ]
    });
    const [actualSeries, setActualSeries] = useState(series.FUTURE);

    useEffect(() => {
        const getIntAccSerie = ({
            currencyName,
            initialAmmount,
            firstEvent,
            termInDays,
            TNA,
            periodicAdd }) => {

            const getDifDays = (date) =>
                Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) / 30) * 30 + 30

            const intComp = (day, termInDays, TNA, initialAmmount, periodicAdd) => {
                if (termInDays > day) return 0;
                const TNM = TNA / 365 * termInDays;
                const AmmountMonths = Math.floor(day / termInDays) - 1;
                const resIntCompLastMonth = (Math.pow((1 + TNM), (AmmountMonths)))
                const ans = (initialAmmount * resIntCompLastMonth * TNM);
                const ans2 = (termInDays * 2 > day) ? 0 : (periodicAdd * (resIntCompLastMonth - 1));
                return Math.floor(ans + ans2)
            }

            return datePeriods.reduce((lasts, date) =>
                [...lasts, intComp(getDifDays(date), termInDays, TNA, initialAmmount, periodicAdd)]
                , []);
        }

        const futureSeries = interestAccounts.reduce((preSeries, intAcc) =>
            [...preSeries, {
                name: intAcc.accountName,
                data: getIntAccSerie(intAcc)
            }], [])

        const totalSeries = datePeriods.reduce((totalIntSeries, date, dateIndex) => [
            ...totalIntSeries,
            futureSeries.reduce((sumInt, actSerie) => sumInt + actSerie.data[dateIndex], 0)
        ], [])

        console.log("ACA totalSeries", totalSeries)

        setSeries({
            PAST: [
                {
                    name: 'Page Views',
                    data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35]
                },
                {
                    name: 'Sessions',
                    data: [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41]
                }
            ],
            FUTURE: [
                {
                    name: 'Total',
                    data: totalSeries,
                },
                ...futureSeries,
            ]
        });
    }, [interestAccounts, datePeriods]);

    useEffect(() => {
        setActualSeries(series[slot]);
    }, [slot, series]);

    return <ReactApexChart options={options} series={actualSeries} type="area" height={500} />;
};

IncomeAreaChart.propTypes = {
    slot: PropTypes.string
};

export default IncomeAreaChart;
