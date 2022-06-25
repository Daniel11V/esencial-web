// material-ui
import { Divider, Grid, Stack, Typography, Button, Box, TextField, MenuItem, Checkbox, FormControlLabel, IconButton, List } from '@mui/material';
import { setOpenBackdrop } from 'store/reducers/money';
import { useDispatch, useSelector } from 'react-redux';
// import { activeItem } from 'store/reducers/money';

// project import
import MainCard from 'components/MainCard';
import { useState, useEffect, useRef } from 'react';
import IncomeAreaChart from 'pages/dashboard/IncomeAreaChart';
// import MonthlyBarChart from 'pages/dashboard/MonthlyBarChart';
import { EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import IncomeTable from './IncomeTable';
import {
    formatNum,
    truncateTwoDecimals,
    getDifMonths,
} from 'utils/utils';


// ==============================|| COMPONENTS - TYPOGRAPHY ||============================== //

const DashboardDefault = () => {
    const dispatch = useDispatch();
    const { interestAccounts, mainCurrency, currencies, operations } = useSelector((state) => state.money.data);

    const fullHeight = 'calc(80vh)';
    const GraphCardRef = useRef(null);
    const [GraphCardSize, setGraphCardSize] = useState(['100%', '100%'])
    useEffect(() => {
        const handleResize = () => {
            setGraphCardSize(GraphCardRef.current ? [
                GraphCardRef.current.offsetWidth - 30 + "px",
                GraphCardRef.current.offsetHeight - 10 + "px"
            ] : ['100%', '100%'])
        }
        window.addEventListener('resize', handleResize)
        return () => { window.removeEventListener('resize', handleResize) }
    }, [GraphCardRef?.current?.offsetWidth])

    const [interestAccountsPlot, setInterestAccountsPlot] = useState([])
    const [extraPlot, setExtraPlot] = useState([
        { id: 'total', accountName: 'Total' },
        { id: 'totalSelection', accountName: 'Total Seleccionados', cantOnlySeeThis: true },
        { id: 'inflation', accountName: 'Inflación' }
    ])
    const [accountChecked, setAccountChecked] = useState({})
    const [extraChecked, setExtraChecked] = useState({
        total: false, totalSelection: false, inflation: false
    })
    const [lastTotalSelection, setLastTotalSelection] = useState({})

    useEffect(() => {
        const interestAccountsValues = Object.values(interestAccounts);
        if (interestAccountsValues?.length) {
            const newInterestAccountsPlot = interestAccountsValues.reduce((prevSeries, intAcc) =>
                [...prevSeries, intAcc], [])

            setInterestAccountsPlot(newInterestAccountsPlot);

            setAccountChecked([...newInterestAccountsPlot, ...extraPlot].reduce((prevSeries, intAcc, index) =>
                ({ ...prevSeries, [intAcc.id]: (!index) ? true : false }), {}))
        }

        dispatch(setOpenBackdrop(false));
    }, [interestAccounts, extraPlot, setInterestAccountsPlot, setAccountChecked, dispatch])

    const checkAll = () => {
        setAccountChecked(lv =>
            Object.keys(lv).reduce((allValues, lvKey) => ({ ...allValues, [lvKey]: true }), {})
        )
    }

    const checkOnlyOne = (intAccId) => {
        const checkedIsExtra = Object.keys(extraChecked).includes(intAccId);
        setAccountChecked(lv => {
            const negativeValues = Object.keys(lv).reduce((allValues, lvKey) => ({ ...allValues, [lvKey]: false }), {})
            if (checkedIsExtra) return negativeValues;
            return { ...negativeValues, [intAccId]: true };
        })
        setExtraChecked(lv => {
            const negativeValues = Object.keys(lv).reduce((allValues, lvKey) => ({ ...allValues, [lvKey]: false }), {})
            if (!checkedIsExtra) return negativeValues;
            return { ...negativeValues, [intAccId]: true };
        })
    }

    const [ammountPeriods, setAmmountPeriods] = useState(12);
    const status = [
        {
            value: 12,
            label: '1 Año'
        },
        {
            value: 24,
            label: '2 Años'
        },
        {
            value: 72,
            label: '6 Años'
        }
    ];
    const [slot, setSlot] = useState(0);
    const [showOnlyInterest, setShowOnlyInterest] = useState(false);


    // START POINTS
    const [datePeriods, setDatePeriods] = useState([])
    const [biggerValues, setBiggerValues] = useState([{}, {}])
    const [accountSeries, setAccountSeries] = useState([]);
    const [extraSeries, setExtraSeries] = useState({});


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
        let biggerValue = {};
        const saveBiggerVal = (v, id) => { if (!biggerValue?.[id] || v > biggerValue[id]) biggerValue[id] = Math.floor(v) }
        let biggerValueInt = {};
        const saveBiggerValInt = (v, id) => { if (!biggerValueInt?.[id] || v > biggerValueInt[id]) biggerValueInt[id] = Math.floor(v) }

        const intComp = (day, termInDays, TNA, initialAmount, periodicAdd, currencyName) => {
            if (termInDays > day) return 0;

            const TNM = TNA === 0 ? 0.000001 : (TNA / 365 * termInDays);
            const AmmountMonths = Math.floor(day / termInDays);
            const resIntCompLastMonth = (Math.pow((1 + TNM), (AmmountMonths - 1)))
            // parseFloat(v.toFixed(2))
            if (currencyName === mainCurrency) {
                // resIntComp
                const ans1 = (initialAmount * (Math.pow((1 + TNM), AmmountMonths)));
                const ans2 = (periodicAdd * (resIntCompLastMonth - 1) / TNM * (1 + TNM));
                return (ans1 + ans2);

            } else {
                const TNA_INFL = currencies.find(curr => curr.name === currencyName).inflationTna;
                const TNM_INFL = TNA_INFL / 365 * termInDays;

                // resIntCompUSD
                const ans1 = (initialAmount * resIntCompLastMonth);
                const ans2 = (periodicAdd * ((Math.pow((1 + TNM), AmmountMonths - 2)) - 1) / TNM * (1 + TNM));
                const ans = ((ans1 + ans2) * (1 + TNM) + periodicAdd * (1 + TNM)) * (Math.pow((1 + TNM_INFL), AmmountMonths));
                return (ans);
            }
        }

        const getInterestAccountSerie = (intAcc) => {
            const resIntAccSerie = [];
            const intAccSerie = [];
            const intAccPercSerie = [];
            const creationPoint = [intAcc.creationDate, intAcc.initialAmount];
            let lastAccPoint = [...creationPoint];
            const lastPointSerie = () => resIntAccSerie.length ? resIntAccSerie[resIntAccSerie.length - 1] : [newDatePeriods[0], lastAccPoint[1]];
            const savePoint = (date, resInt, lastResInt, hasPeriodAdd = false) => {
                const realInt = ((resInt - (lastResInt || lastPointSerie()[1])) - ((hasPeriodAdd) ? intAcc.periodicAdd : 0));
                intAccSerie.push([date, truncateTwoDecimals(realInt)])
                saveBiggerValInt(realInt, intAcc.id)
                // console.log("ACA realInt", realInt, resInt, lastPointSerie()[1])

                const realIntPerc = realInt / lastPointSerie()[1]
                intAccPercSerie.push([date, truncateTwoDecimals(realIntPerc * 100)])

                resIntAccSerie.push([date, resInt])
                saveBiggerVal(resInt, intAcc.id)
            }

            if (creationPoint[0] > newDatePeriods[0]) savePoint(creationPoint[0], creationPoint[1])

            // intAccountOperPoints
            Object.values(operations)
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
                    ? getDifMonths(new Date(lastAccPoint[0]), new Date(futurePointDate)) * 30
                    : intAcc.termInDays * (i + 1)

                const resIntComp = intComp(daysOfInt, intAcc.termInDays, intAcc.TNA, lastAccPoint[1], intAcc.periodicAdd, intAcc.currencyName);
                // console.log("ACA", intAcc.accountName, daysOfInt, resIntComp, monthToFill)
                // console.log("ACAAAA", i, monthToFill.length, ammountPeriods)
                savePoint(futurePointDate, resIntComp, (monthToFill.length === (ammountPeriods + 1) && i === 0) ?
                    intComp(daysOfInt - 30, intAcc.termInDays, intAcc.TNA, lastAccPoint[1], intAcc.periodicAdd, intAcc.currencyName)
                    : null, daysOfInt >= 60)
            }

            return {
                id: intAcc.id,
                name: intAcc.accountName + (intAcc.TNA === 0 ? '' : ' (TNM ' + formatNum(intAcc.TNA / 12 * 100) + '%)'),
                resIntAccSerie, intAccSerie, intAccPercSerie
            }
        }

        const interestAccountsSeries = Object.values(interestAccounts).reduce((prevSeries, intAcc) =>
            [...prevSeries, getInterestAccountSerie(intAcc)], [])

        // ARREGLAR
        const getTotalSeries = (prevSeries) => {
            const totalData = [];
            const totalDataInt = [];
            const totalDataIntPerc = [];
            // const ex = { Jan: {}, Feb: {}, Mar: {}, Apr: {}, May: {}, Jun: {}, Jul: {}, Aug: {}, Sep: {}, Oct: {}, Nov: {}, Dec: {} }
            // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

            for (let i = 1; i < newDatePeriods.length; i++) {
                let totalValue = 0;
                for (let j = 0; j < prevSeries.length; j++) {
                    totalValue += [...prevSeries[j].resIntAccSerie]?.reverse()
                        ?.find(point => point[0] < newDatePeriods[i])?.[1] || 0;

                    // ex[months[new Date(newDatePeriods[i]).getMonth()]][prevSeries[j].name] =
                    //     [...prevSeries[j].resIntAccSerie]?.reverse()
                    //         ?.find(point => point[0] < newDatePeriods[i])?.[1] || 0

                }

                // ex[months[new Date(newDatePeriods[i]).getMonth()]]['Total'] = totalValue;
                const pointDate = newDatePeriods[i];
                totalData[i - 1] = [pointDate, truncateTwoDecimals(totalValue)]
                saveBiggerVal(totalValue, 'total');
                const totalValueInt = totalValue - (totalData[i - 2]?.[1] || 0)
                totalDataInt[i - 1] = [pointDate, truncateTwoDecimals(totalValueInt)]
                saveBiggerValInt(totalValueInt, 'total');
                const totalValueIntPerc = totalData[i - 2]?.[1] ? totalValueInt / (totalData[i - 2]?.[1]) * 100 : 100
                totalDataIntPerc[i - 1] = [pointDate, truncateTwoDecimals(totalValueIntPerc)]
            }
            // console.log("ACA ex", ex);
            return { id: 'total', name: 'Total', resIntAccSerie: totalData, intAccSerie: totalDataInt, intAccPercSerie: totalDataIntPerc };
        }
        const totalSeries = (interestAccountsSeries.length <= 1) ? {} : getTotalSeries(interestAccountsSeries);

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
        //     operations: operations,
        // })
        // console.log("ACA newAllSeries", { interestAccountsSeries, totalSeries, biggerValue, biggerValueInt, newDatePeriods })
        setAccountSeries(interestAccountsSeries)
        setExtraSeries(prevSeries => ({ ...prevSeries, total: totalSeries }))
        setDatePeriods(newDatePeriods)
        setBiggerValues([biggerValue, biggerValueInt])

    }, [
        slot,
        ammountPeriods,

        interestAccounts,
        mainCurrency,
        currencies,
        operations,

        setAccountSeries,
        setExtraSeries,
        setDatePeriods,
        setBiggerValues
    ]);

    // Total Selection
    useEffect(() => {
        const selectedAccountSeries = Object.keys(accountChecked).filter(s => !!accountChecked[s])
        // console.log("ACA Total Selection", selectedAccountSeries)
        if (!!extraChecked?.totalSelection && selectedAccountSeries.length > 1 && JSON.stringify(selectedAccountSeries) !== JSON.stringify(lastTotalSelection)) {

            let biggerValue = 0;
            const saveBiggerVal = (v) => { if (v > biggerValue) biggerValue = Math.floor(v) }
            let biggerValueInt = 0;
            const saveBiggerValInt = (v) => { if (v > biggerValueInt) biggerValueInt = Math.floor(v) }


            const getTotalSelectionSeries = (selectedAccountSeries) => {
                const totalData = [];
                const totalDataInt = [];
                const totalDataIntPerc = [];

                for (let i = 1; i < datePeriods.length; i++) {
                    let totalValue = 0;
                    for (let j = 0; j < selectedAccountSeries.length; j++) {
                        totalValue += [...selectedAccountSeries[j].resIntAccSerie]?.reverse()
                            ?.find(point => point[0] < datePeriods[i])?.[1] || 0;
                    }

                    const pointDate = datePeriods[i];
                    totalData[i - 1] = [pointDate, truncateTwoDecimals(totalValue)]
                    saveBiggerVal(totalValue);
                    const totalValueInt = totalValue - (totalData[i - 2]?.[1] || 0)
                    totalDataInt[i - 1] = [pointDate, truncateTwoDecimals(totalValueInt)]
                    saveBiggerValInt(totalValueInt);
                    const totalValueIntPerc = totalData[i - 2]?.[1] ? totalValueInt / (totalData[i - 2]?.[1]) * 100 : 100
                    totalDataIntPerc[i - 1] = [pointDate, truncateTwoDecimals(totalValueIntPerc)]
                }
                return { id: 'totalSelection', name: 'Total Seleccionados', resIntAccSerie: totalData, intAccSerie: totalDataInt, intAccPercSerie: totalDataIntPerc };
            }
            const totalSelectionSeries = getTotalSelectionSeries(Object.values(accountSeries).filter(s => s.id !== 'total' && accountChecked[s.id]));

            setExtraSeries((prevSeries) => ({ ...prevSeries, "totalSelection": totalSelectionSeries }))
            setBiggerValues((bigTypes) => [{ ...bigTypes[0], totalSelection: biggerValue }, { ...bigTypes[1], totalSelection: biggerValueInt }]);
            setLastTotalSelection(selectedAccountSeries);
            // console.log("ACA Total Selection 2", totalSelectionSeries)
        }

    }, [accountChecked, extraChecked, datePeriods, accountSeries, lastTotalSelection, setBiggerValues, setExtraSeries, setLastTotalSelection])




    return (
        <Grid container columnSpacing={2.5} rowSpacing={2.5} >
            {/* row 1 */}
            <Grid item xs={12} md={8} lg={9} >
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Visualización de Cuentas</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <TextField
                                id="standard-select-ammount-periods"
                                size="small"
                                select
                                value={ammountPeriods}
                                onChange={(e) => setAmmountPeriods(e.target.value)}
                                sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
                            >
                                {status.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="standard-select-show-only-interest"
                                size="small"
                                select
                                value={showOnlyInterest}
                                onChange={(e) => setShowOnlyInterest(e.target.value)}
                                sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
                            >
                                <MenuItem value={false}>Capital + Intereses</MenuItem>
                                <MenuItem value={true}>Solo Intereses</MenuItem>
                            </TextField>
                            <Stack direction="row" alignItems="center" spacing={0} >
                                <Button
                                    size="small"
                                    onClick={() => setSlot(val => val - 1)}
                                    color={slot < 0 ? 'primary' : 'secondary'}
                                    variant={slot < 0 ? 'outlined' : 'text'}
                                    style={{ minWidth: '33px', padding: '7px 9px' }}
                                >
                                    <LeftOutlined />
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => setSlot(0)}
                                    color={slot === 0 ? 'primary' : 'secondary'}
                                    variant={slot === 0 ? 'outlined' : 'text'}
                                    style={{ minWidth: '50px' }}
                                >
                                    Hoy
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => setSlot(val => val + 1)}
                                    color={slot > 0 ? 'primary' : 'secondary'}
                                    variant={slot > 0 ? 'outlined' : 'text'}
                                    style={{ minWidth: '33px', padding: '7px 9px' }}
                                >
                                    <RightOutlined />
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
                <MainCard ref={GraphCardRef} content={false} sx={{ mt: 1.5, pt: 1, pr: 2, pl: 1, height: fullHeight }}>
                    <IncomeAreaChart
                        slot={slot}
                        ammountPeriods={ammountPeriods}
                        datePeriods={datePeriods}
                        biggerValues={biggerValues}
                        allSeries={[...accountSeries, ...Object.values(extraSeries)]}
                        allChecked={{ ...accountChecked, ...extraChecked }}
                        showOnlyInterest={showOnlyInterest}
                        width={GraphCardSize[0]} height={GraphCardSize[1]} />
                </MainCard>
            </Grid>
            <Grid item xs={12} md={4} lg={3} >
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Ajuste de Grafico</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2, height: fullHeight }} content={false}>
                    <Box>
                        <List style={{ maxHeight: fullHeight, overflow: 'auto' }}>
                            <Stack spacing={0} sx={{ p: 0 }}>
                                <Grid item xs={12} sx={{ mt: -1, p: 3, pb: '3px' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" >
                                        <Typography variant="h6" color="textSecondary">
                                            Funciones Extras
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sx={{ p: 0, m: 0 }}>
                                    <Button variant="text" sx={{ pb: '5px', pt: '9px', pl: '22px', pr: '14px', width: "100%" }} onClick={checkAll}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                                            <Typography variant="h6" color="textPrimary">
                                                Ver todas las cuentas
                                            </Typography>
                                            <IconButton
                                                sx={{ fontSize: '0.875rem', m: 0, p: 0 }}
                                                size="medium"
                                                color={Object.keys(accountChecked).every(c => accountChecked[c] === true) ? 'primary' : 'secondary'}
                                            >
                                                <EyeOutlined />
                                            </IconButton>
                                        </Stack>
                                    </Button>
                                </Grid>
                                {extraPlot?.map(extraAcc => (
                                    <Grid item xs={12} sx={{ mt: -1, p: 0, }} key={extraAcc.id}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={!!extraChecked[extraAcc.id]}
                                                        sx={{ p: 2, pl: 2, ml: 2 }}
                                                        onChange={(event) => setExtraChecked(lv => ({ ...lv, [extraAcc.id]: event.target.checked }))}
                                                        name={extraAcc.id}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                }
                                                label={<Typography variant="h6">{extraAcc.accountName}</Typography>}
                                            />
                                            {!extraAcc.cantOnlySeeThis && (
                                                <IconButton
                                                    sx={{ fontSize: '0.875rem', pr: 4, pl: 4 }}
                                                    size="medium"
                                                    color={extraChecked[extraAcc.id] ? 'primary' : 'secondary'}
                                                    onClick={() => checkOnlyOne(extraAcc.id)}
                                                >
                                                    <EyeOutlined />
                                                </IconButton>
                                            )}
                                        </Stack>
                                    </Grid>
                                ))}
                                <Divider />
                                <Typography variant="h6" color="textSecondary" sx={{ pl: 3, pt: 2 }}>
                                    Cuentas
                                </Typography>
                                {interestAccountsPlot?.map(intAcc => (
                                    <Grid item xs={12} key={intAcc.id} >
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={accountChecked[intAcc.id]}
                                                        sx={{ p: 1.5, ml: 2.5 }}
                                                        onChange={(event) => setAccountChecked(lv => ({ ...lv, [intAcc.id]: event.target.checked }))}
                                                        name={String(intAcc.id)}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                }
                                                label={<Typography variant="h6">{intAcc.accountName}</Typography>}
                                            />
                                            <IconButton
                                                sx={{ fontSize: '0.875rem', pr: 4, pl: 4 }}
                                                size="medium"
                                                color={accountChecked[intAcc.id] ? 'primary' : 'secondary'}
                                                onClick={() => checkOnlyOne(intAcc.id)}
                                            >
                                                <EyeOutlined />
                                            </IconButton>
                                        </Stack>
                                    </Grid>
                                ))}
                            </Stack>
                        </List>
                    </Box>
                    {/* <MonthlyBarChart /> */}
                </MainCard>
            </Grid>
            <Grid item xs={12} md={12} lg={12} >
                <IncomeTable account={interestAccountsPlot?.find(intAcc => !!accountChecked[intAcc.id])} mainCurrency={mainCurrency} currencies={currencies} />
            </Grid>
        </Grid>
    );
};

export default DashboardDefault;
