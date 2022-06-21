import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

// third-party
import ReactApexChart from 'react-apexcharts';

const formatNum = (x) => {
    let numWith2DecimalsMax;
    if (x - Math.trunc(x) < 0.01) {
        numWith2DecimalsMax = Math.trunc(x);
    } else if (x - (Math.trunc(x * 10) / 10) < 0.1) {
        numWith2DecimalsMax = (Math.floor(x * 100) / 100).toFixed(1);
    } else {
        numWith2DecimalsMax = (Math.floor(x * 100) / 100).toFixed(2);
    }
    return numWith2DecimalsMax.toString().replace(".", ",").replace(/\B(?<!\,\d*)(?=(\d{3})+(?!\d))/g, ".");
}

const getDifDays = (start, finish) =>
    Math.floor((finish - start) / (1000 * 60 * 60 * 24) / 30) * 30 + 30

const truncateTwoDecimals = (v) => Number((Math.floor(v * 100) / 100).toFixed(2))

const monthDif = (d1, d2) => {
    const t1 = new Date(d1);
    const t2 = new Date(d2);
    return ((t2.getFullYear() - t1.getFullYear()) * 12 + t2.getMonth() - t1.getMonth())
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot, ammountPeriods = 0, showOnlyInterest = false }) => {
    const theme = useTheme();
    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const { interestAccounts, mainCurrency, currencies, interestOperations } = useSelector((state) => state.money);

    const [datePeriods, setDatePeriods] = useState([])
    const [biggerValues, setBiggerValues] = useState([0, 0])
    const [allSeries, setAllSeries] = useState([
        { name: 'Page Views', resIntAccSerie: [23, 34, 12], intAccSerie: [23, 34, 12], intAccPercSerie: [23, 34, 12] },
        { name: 'Page Views 2', resIntAccSerie: [23, 34, 12], intAccSerie: [23, 34, 12], intAccPercSerie: [23, 34, 12] },
    ]);
    const [series, setSeries] = useState([
        { name: 'Page Views', data: [[new Date().getTime(), 34], [new Date('08/02/2022').getTime(), 54]] },
        { name: 'Page Views 2', data: [[new Date().getTime(), 24], [new Date('08/02/2022').getTime(), 20]] },
    ]);
    const [options, setOptions] = useState({
        chart: {
            height: 500,
            type: 'area',
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

        let newDatePeriods = []
        for (let i = ammountPeriods * slot; i <= ammountPeriods * (slot + 1); i++) {
            const now = new Date(new Date().getFullYear(), 0, 1);
            if (now.getMonth() + i > 11) {
                newDatePeriods.push(new Date(now.getFullYear() + 1, now.getMonth() + i - 12, 1).getTime())
            } else {
                newDatePeriods.push(new Date(now.getFullYear(), now.getMonth() + i, 1).getTime())
            }
        }


        // Series
        let biggerValue = 0;
        const saveBiggerVal = (v) => { if (v > biggerValue) biggerValue = Math.floor(v) }
        let biggerValueInt = 0;
        const saveBiggerValInt = (v) => { if (v > biggerValueInt) biggerValueInt = Math.floor(v) }

        const intComp = (day, termInDays, TNA, initialAmmount, periodicAdd, currencyName) => {
            if (termInDays > day) return 0;

            const TNM = TNA === 0 ? 0.000001 : (TNA / 365 * termInDays);
            const AmmountMonths = Math.floor(day / termInDays);
            const resIntCompLastMonth = (Math.pow((1 + TNM), (AmmountMonths - 1)))
            // parseFloat(v.toFixed(2))
            if (currencyName === mainCurrency) {
                // resIntComp
                const ans1 = (initialAmmount * (Math.pow((1 + TNM), AmmountMonths)));
                const ans2 = (periodicAdd * (resIntCompLastMonth - 1) / TNM * (1 + TNM));
                return (ans1 + ans2);

            } else {
                const TNA_INFL = currencies.find(curr => curr.name === currencyName).inflationTna;
                const TNM_INFL = TNA_INFL / 365 * termInDays;

                // resIntCompUSD
                const ans1 = (initialAmmount * resIntCompLastMonth);
                const ans2 = (periodicAdd * ((Math.pow((1 + TNM), AmmountMonths - 2)) - 1) / TNM * (1 + TNM));
                const ans = ((ans1 + ans2) * (1 + TNM) + periodicAdd * (1 + TNM)) * (Math.pow((1 + TNM_INFL), AmmountMonths));
                return (ans);
            }
        }

        const getInterestAccountSerie = (intAcc) => {
            const resIntAccSerie = [];
            const intAccSerie = [];
            const intAccPercSerie = [];
            const creationPoint = [intAcc.creationDate, intAcc.initialAmmount];
            let lastAccPoint = [...creationPoint];
            const lastPointSerie = () => resIntAccSerie.length ? resIntAccSerie[resIntAccSerie.length - 1] : [newDatePeriods[0], lastAccPoint[1]];
            const savePoint = (date, resInt, lastResInt) => {
                const realInt = resInt - (lastResInt || lastPointSerie()[1])
                intAccSerie.push([date, truncateTwoDecimals(realInt)])
                saveBiggerValInt(realInt)
                // console.log("ACA realInt", realInt, resInt, lastPointSerie()[1])

                const realIntPerc = realInt / lastPointSerie()[1]
                intAccPercSerie.push([date, truncateTwoDecimals(realIntPerc * 100)])

                resIntAccSerie.push([date, resInt])
                saveBiggerVal(resInt)
            }

            if (creationPoint[0] > newDatePeriods[0]) savePoint(creationPoint[0], creationPoint[1])

            // intAccountOperPoints
            Object.values(interestOperations)
                .filter(intOper => (intOper.interestAccount === intAcc.id))
                .sort((a, b) => a.date - b.date)
                .forEach(actIntOper => {
                    const operPoint = [actIntOper.date, actIntOper.value]
                    lastAccPoint = operPoint;
                    if (operPoint[0] > lastPointSerie()[0] && operPoint[0] < newDatePeriods[newDatePeriods.length - 1]) {
                        savePoint(operPoint[0], operPoint[1]);
                    }
                });

            // intAccountFuturePoints
            const monthToFill = [...newDatePeriods].filter(d => d + 1 > lastPointSerie()[0])
            for (let i = 0; i < monthToFill.length; i++) {
                const futurePointDate = new Date(monthToFill[i]).setDate(new Date(lastAccPoint[0]).getDate())

                const daysOfInt = (lastAccPoint[0] < newDatePeriods[0])
                    ? monthDif(new Date(lastAccPoint[0]), new Date(futurePointDate)) * 30
                    : intAcc.termInDays * (i + 1)

                const resIntComp = intComp(daysOfInt, intAcc.termInDays, intAcc.TNA, lastAccPoint[1], intAcc.periodicAdd, intAcc.currencyName);

                // console.log("ACAAAA", i, monthToFill.length, ammountPeriods)
                savePoint(futurePointDate, resIntComp, (monthToFill.length === (ammountPeriods + 1) && i === 0) ?
                    intComp(daysOfInt - 30, intAcc.termInDays, intAcc.TNA, lastAccPoint[1], intAcc.periodicAdd, intAcc.currencyName)
                    : null)
            }

            return {
                name: intAcc.accountName + (intAcc.TNA === 0 ? '' : ' (TNM ' + formatNum(intAcc.TNA / 12 * 100) + '%)'),
                resIntAccSerie, intAccSerie, intAccPercSerie
            }
        }

        const interestAccountsSeries = Object.values(interestAccounts).reduce((prevSeries, intAcc) =>
            (intAcc.currencyName === mainCurrency && intAcc.TNA === 0)
                ? prevSeries : [...prevSeries, getInterestAccountSerie(intAcc)], [])

        // ARREGLAR
        const getTotalSeries = (prevSeries) => {
            const totalData = [];
            const totalDataInt = [];
            const totalDataIntPerc = [];
            for (let i = 0; i < prevSeries[0]?.resIntAccSerie?.length; i++) {
                let totalValue = 0;
                let totalValueInt = 0;
                let totalValueIntPerc = 0;
                for (let j = 0; j < prevSeries.length; j++) {
                    totalValue += prevSeries[j].resIntAccSerie?.[i]?.[1];
                    totalValueInt += prevSeries[j].intAccSerie?.[i]?.[1];
                    totalValueIntPerc += prevSeries[j].intAccPercSerie?.[i]?.[1];
                }
                saveBiggerVal(totalValue);
                saveBiggerValInt(totalValueInt);
                totalData[i] = [prevSeries[0].resIntAccSerie?.[i]?.[0], truncateTwoDecimals(totalValue)]
                totalDataInt[i] = [prevSeries[0].intAccSerie?.[i]?.[0], truncateTwoDecimals(totalValueInt)]
                totalDataIntPerc[i] = [prevSeries[0].intAccPercSerie?.[i]?.[0], truncateTwoDecimals(totalValueIntPerc)]
            }
            return { name: 'Total', resIntAccSerie: totalData, intAccSerie: totalDataInt, intAccPercSerie: totalDataIntPerc };
        }
        const totalSeries = (interestAccountsSeries.length <= 1) ? [] : [getTotalSeries(interestAccountsSeries)];

        // console.log("ACA vars", {
        //     newDatePeriods: newDatePeriods.reduce((prev, act) => [...prev, new Date(act).toDateString()], []),
        //     interestAccountsSeries,
        //     totalSeries: totalSeries[0],
        //     biggerValue,
        // })
        // console.log("ACA params", {
        //     primary: primary,
        //     secondary: secondary,
        //     line: line,
        //     theme: theme,
        //     slot: slot,
        //     ammountPeriods: ammountPeriods,
        //     interestAccounts: interestAccounts,
        //     showOnlyInterest: showOnlyInterest,
        //     mainCurrency: mainCurrency,
        //     currencies: currencies,
        //     interestOperations: interestOperations,
        // })
        const newAllSeries = [...totalSeries, ...interestAccountsSeries]
        // console.log("ACA newAllSeries", newAllSeries, [biggerValue, biggerValueInt])
        setAllSeries(newAllSeries)
        setDatePeriods(newDatePeriods)
        setBiggerValues([biggerValue, biggerValueInt])

    }, [
        slot,
        ammountPeriods,

        interestAccounts,
        mainCurrency,
        currencies,
        interestOperations,
    ]);

    useEffect(() => {
        // Options
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
                    formatter: (v, timestamp, opt) => {
                        /*console.log("ACA", v, opt);*/ return getDifDays(opt?.w?.globals?.minX, opt?.w?.globals?.maxX) >= 360
                            ? months[new Date(datePeriods[opt?.i]).getMonth()] + ', ' + new Date(datePeriods[opt?.i]).getFullYear()
                            : new Date(v).getDate() + ' ' +
                            months[new Date(v).getMonth()] + ', ' + new Date(v).getFullYear()
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
                tickAmount: ammountPeriods - 1
            },
            yaxis: {
                max: Math.round(biggerValues[showOnlyInterest ? 1 : 0] * 1.05),
                labels: {
                    formatter: (v) => "$" + formatNum(v),
                    style: {
                        colors: [secondary]
                    }
                },
            },
            grid: {
                borderColor: line,
                strokeDashArray: 0
            },
            tooltip: {
                theme: 'light',
                // intersect: true,
                x: {
                    formatter: (v) => new Date(v).getDate() + ' ' +
                        months[new Date(v).getMonth()] + ', ' + new Date(v).getFullYear(),
                },
                y: {
                    formatter: (v, { dataPointIndex, seriesIndex }) =>
                        ((v < 0) ? '-$' + formatNum(v) * (-1) : '$' + formatNum(v))
                        + " (" + allSeries[seriesIndex].intAccPercSerie[dataPointIndex][1] + "%)",
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
        ammountPeriods,
        showOnlyInterest,

        datePeriods,
        allSeries,
        biggerValues
    ])


    useEffect(() => {
        if (allSeries[0]?.name !== 'Page Views' && allSeries?.length) {
            setSeries(allSeries.reduce((prevIntAcc, actIntAcc) => [...prevIntAcc, {
                name: actIntAcc.name,
                data: [...(showOnlyInterest ? actIntAcc.intAccSerie : actIntAcc.resIntAccSerie)]
                    .reduce((prevPoint, actPoint) => [...prevPoint, [actPoint[0], truncateTwoDecimals(actPoint[1])]], []),
            }], []))
        }
    }, [showOnlyInterest, allSeries])

    return <ReactApexChart options={options} series={series} type="area" height={500} />;
};

IncomeAreaChart.propTypes = {
    slot: PropTypes.number
};

export default IncomeAreaChart;
