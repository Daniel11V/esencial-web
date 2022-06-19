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
        size: 4,
    },
    grid: {
        strokeDashArray: 0
    }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot, ammountPeriods = 0, showOnlyInterest, interestAccounts, mainCurrency, currencies }) => {
    const theme = useTheme();

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState(areaChartOptions);
    const [datePeriods, setDatePeriods] = useState([])

    useEffect(() => {
        let periodsArray = []
        for (let i = ammountPeriods * slot; i < ammountPeriods * (slot + 1); i++) {
            const now = new Date();
            if (now.getMonth() + i > 11) {
                periodsArray.push(new Date(now.getFullYear() + 1, now.getMonth() + i - 12, 1))
            } else {
                periodsArray.push(new Date(now.getFullYear(), now.getMonth() + i, 1))
            }
        }
        setDatePeriods(periodsArray)
    }, [ammountPeriods, slot])


    useEffect(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
                tickAmount: datePeriods.length
            },
            yaxis: {
                labels: {
                    formatter: (v) => "$" + v,
                    style: {
                        colors: [secondary]
                    }
                }
            },
            grid: {
                borderColor: line
            },
            tooltip: {
                theme: 'light',
                onDatasetHover: {
                    highlightDataSeries: true,
                },
            }
        }));
    }, [primary, secondary, line, theme, slot, datePeriods]);

    const [series, setSeries] = useState([
        {
            name: 'Page Views',
            data: [31, 40, 28, 51, 42, 109, 100, 28, 115, 48, 210, 136]
        },
        {
            name: 'Sessions',
            data: [11, 32, 45, 32, 34, 52, 41, 820, 430, 354, 210, 136]
        }
    ]);

    useEffect(() => {
        if (slot >= 0) {

            const truncateTwoDecimals = (v) => Number((Math.floor(v * 100) / 100).toFixed(2))

            const getIntAccSerie = ({
                currencyName,
                initialAmmount,
                firstEvent,
                termInDays,
                TNA,
                periodicAdd }) => {

                const getDifDays = (date) =>
                    Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) / 30) * 30 + 30


                const intComp = (day, termInDays, TNA, initialAmmount, periodicAdd, currencyName) => {
                    if (termInDays > day) return 0;

                    const TNM = TNA === 0 ? 0.000001 : (TNA / 365 * termInDays);
                    const AmmountMonths = Math.floor(day / termInDays);
                    const resIntCompLastMonth = (Math.pow((1 + TNM), (AmmountMonths - 1)))
                    // parseFloat(v.toFixed(2))
                    if (currencyName === mainCurrency) {
                        if (showOnlyInterest) {
                            // intComp
                            const ans1 = (initialAmmount * resIntCompLastMonth * TNM);
                            const ans2 = (termInDays * 2 > day) ? 0 : (periodicAdd * (resIntCompLastMonth - 1));
                            return truncateTwoDecimals(ans1 + ans2);
                        } else {
                            // resIntComp
                            const ans1 = (initialAmmount * (Math.pow((1 + TNM), AmmountMonths)));
                            const ans2 = (periodicAdd * (resIntCompLastMonth - 1) / TNM * (1 + TNM));
                            return truncateTwoDecimals(ans1 + ans2);
                        }

                    } else {
                        const TNA_INFL = currencies[currencyName].inflationTna;
                        const TNM_INFL = TNA_INFL / 365 * termInDays;

                        if (!showOnlyInterest) {
                            // resIntCompUSD
                            const ans1 = (initialAmmount * (Math.pow((1 + TNM), AmmountMonths)));
                            const ans2 = (periodicAdd * (resIntCompLastMonth - 1) / TNM * (1 + TNM));
                            return truncateTwoDecimals((ans1 + ans2) * (Math.pow((1 + TNM_INFL), AmmountMonths)));
                        } else if (day < 60) {
                            // intCompUSD Month 1
                            return truncateTwoDecimals(initialAmmount * ((1 + TNM) * TNM_INFL + TNM));
                        } else {
                            // intCompUSD Month >1 (Analizar con TNA 0)
                            const ans1 = (1 + TNM) * (Math.pow((1 + TNM), (AmmountMonths - 2)) * (initialAmmount + periodicAdd / TNM) - periodicAdd / TNM) * (((1 + TNM) * (1 + TNM_INFL) - 1) * Math.pow((1 + TNM_INFL), (AmmountMonths - 1)) - TNM);
                            const ans2 = periodicAdd * ((1 + TNM) * Math.pow((1 + TNM_INFL), AmmountMonths) - TNM - 1);
                            const ans3 = initialAmmount * resIntCompLastMonth * TNM;
                            const ans4 = periodicAdd * (resIntCompLastMonth - 1);
                            return truncateTwoDecimals(ans1 + ans2 + ans3 + ans4);
                        }
                    }
                }

                return datePeriods.reduce((lasts, date) =>
                    [...lasts, intComp(getDifDays(date), termInDays, TNA, initialAmmount, periodicAdd, currencyName)]
                    , []);
            }

            const futureSeries = interestAccounts.reduce((preSeries, intAcc) =>
                (intAcc.currencyName === mainCurrency && intAcc.TNA === 0)
                    ? preSeries : [...preSeries, {
                        name: intAcc.accountName,
                        data: getIntAccSerie(intAcc)
                    }], [])

            const totalSeries = datePeriods.reduce((totalIntSeries, date, dateIndex) => [
                ...totalIntSeries,
                futureSeries.reduce((sumInt, actSerie) =>
                    truncateTwoDecimals(sumInt + actSerie.data[dateIndex])
                    , 0)
            ], [])

            console.log("ACA totalSeries", futureSeries, totalSeries)

            setSeries([
                {
                    name: 'Total',
                    data: totalSeries,
                },
                ...futureSeries,
            ])
        } else {
            setSeries([
                {
                    name: 'Page Views',
                    data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35]
                },
                {
                    name: 'Sessions',
                    data: [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41]
                }
            ]);
        }
    }, [slot, interestAccounts, showOnlyInterest, datePeriods, mainCurrency, currencies]);

    return <ReactApexChart options={options} series={series} type="area" height={500} />;
};

IncomeAreaChart.propTypes = {
    slot: PropTypes.number
};

export default IncomeAreaChart;
