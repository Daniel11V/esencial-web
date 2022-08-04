import React, {useState, useEffect} from 'react'
// import { setLoading } from 'store/reducers/money';
import { useDispatch, useSelector } from 'react-redux';
import {
    // formatNum,
    truncateTwoDecimals,
    getDifMonths,
    calcResIntComp,
    getKeys,
} from 'utils/utils';

const Context = React.createContext({})

export function DashboardContextProvider ({children}) {
    // const dispatch = useDispatch();
    const { accounts, mainCurrency, currencies, operations } = useSelector((state) => state.money.data);

    // Visual Configuration
    const [slot, setSlot] = useState(0) // 1 January of this Year
    const [selectedAmountPeriods, setSelectedAmountPeriods] = useState(12); // 12 periods (months)
    const [showOnlyInterest, setShowOnlyInterest] = useState(false);

    // Accounts and ExtraInfo Checked
    const [selectableAccounts, setSelectableAccounts] = useState([])
    const [accountChecked, setAccountChecked] = useState({})
    useEffect(() => {
        const newSelectableAccounts = accounts?.filter(acc => true);
        setSelectableAccounts(newSelectableAccounts)
        setAccountChecked(newSelectableAccounts.reduce((lastAccCh, actAcc) => ({
            ...lastAccCh, 
            [(actAcc.creationDate)]: (!Object.values(lastAccCh).some(lastAccChValue => !!lastAccChValue) && !!actAcc.TNA) ? true : false
        }), {}))
    }, [accounts, setAccountChecked, setSelectableAccounts])
    // console.log("ACA accountChecked", accountChecked)
    const [extraInfoChecked, setExtraInfoChecked] = useState({
        total: false, totalSelection: false, inflation: false
    })
    
    // MAIN DATA
    // let accountsData = [
    //     {    
    //         accInfo: {
    //             id: 123, // creationDate
    //             title: '',
    //             currencyId: '1',
    //             ...
    //         },
    //         params: {
    //             //selectedAmountPeriods: 6,
    //             //startPeriod: -3,
    //             savedPeriods: [1, 2, 3]
    //         },
    //         operations: [
    //             {  
//                     "fromAccount": 2,
//                     "fromAccountName": "Santander PF",
//                     "finalDate": 1654484400000,
//                     "operType": "CREATION",
//                     "title": "",
//                     "description": "",
//                     "totalFromAmount": 100000
    //                 amount: 1234
    //                 percAmount: 1234
    //                 totalAmount: 1234
    //             }
    //         ]
    //     }
    // }
    
    const [accountsData, setAccountsData] = useState([])
    const [extraInfoData, setExtraInfoData] = useState([
        { accInfo: {creationDate: 'total', accountName: 'Total'} },
        { accInfo: {creationDate: 'totalSelection', accountName: 'Total Seleccionados'}, params: {cantOnlySeeThis: true} },
        { accInfo: {creationDate: 'inflation', accountName: 'Inflación'} }
    ])
    const [datePeriods, setDatePeriods] = useState([])
    const [biggerValues, setBiggerValues] = useState([{}, {}])
    // const [accountSeries, setAccountSeries] = useState([]);
    // const [lastAccountSeriesProps, setLastAccountSeriesProps] = useState([]);
    // const [extraSeries, setExtraSeries] = useState({});
    
    useEffect(() => {

        // Calculate newDatePeriods
        const selectedStartPeriod = (slot * selectedAmountPeriods) - 1;
        const selectedEndPeriod = ((slot + 1) * selectedAmountPeriods) + 1;
        const getDatePeriod = (numPeriod) => {
            const yearNum = Math.floor(numPeriod / 12);
            const monthNum = (numPeriod % 12 < 0) ? 12 + numPeriod % 12 : numPeriod % 12;
            return new Date(new Date().getFullYear() + yearNum, monthNum, 1).getTime();
        }
        const newDatePeriods = []
        for(let periodIndex = selectedStartPeriod; periodIndex < selectedEndPeriod; periodIndex++) {
            newDatePeriods.push(getDatePeriod(periodIndex))
        }
        // console.log("ACA Periods:", "("+selectedStartPeriod+"-"+selectedEndPeriod+")", newDatePeriods)

        // Start BiggerValues
        let biggerValue = {};
        const saveBiggerVal = (v, id) => { if (!biggerValue?.[id] || v > biggerValue[id]) biggerValue[id] = Math.floor(v) }
        let biggerValueInt = {};
        const saveBiggerValInt = (v, id) => { if (!biggerValueInt?.[id] || v > biggerValueInt[id]) biggerValueInt[id] = Math.floor(v) }


        // Function getAccountData
        const getAccountData = (actAcc) => {

            const accountOperations = Object.values(operations)
                .filter(accOper => (accOper.fromAccount === actAcc.creationDate || accOper?.toAccount === actAcc.creationDate))
                .sort((a, b) => a.finalDate - b.finalDate);

            const savedOperations = [];

            // actAccountOperations
            const lastOperationSaved = () => savedOperations.length 
                ? savedOperations[savedOperations.length - 1] 
                : {  finalDate: newDatePeriods[0], totalFromAmount: 0 };
            let lastOperation = { finalDate: newDatePeriods[0], totalFromAmount: 0 };
            // console.log("ACA accountOperations", accountOperations)
            for (let i = 0; i < accountOperations.length; i++) {

                let newAmount = 0;
                let newTotalAmount = 0;
                // Operation between datePeriods
                if (accountOperations[i].finalDate >= newDatePeriods[0] && accountOperations[i].finalDate <= newDatePeriods[newDatePeriods.length - 1]) {
                    
                    // SaveOperation
                    newAmount = accountOperations[i]?.fromAmount;
                    newTotalAmount = accountOperations[i]?.totalFromAmount;

                    if (newTotalAmount !== undefined && newAmount === undefined) {
                        newAmount = (newTotalAmount - (lastOperation.totalFromAmount));
                    } else if (newAmount !== undefined && newTotalAmount === undefined) {
                        newTotalAmount = (newAmount + (lastOperation.totalFromAmount));
                    }

                    saveBiggerValInt(newAmount, actAcc.creationDate)
                    saveBiggerVal(newTotalAmount, actAcc.creationDate)

                    savedOperations.push({
                        ...accountOperations[i],
                        amount: newAmount,
                        percAmount: (lastOperation.totalFromAmount !== 0 && accountOperations[i].operType === "INTEREST") ? (newAmount / lastOperation.totalFromAmount * 100) : 0,
                        totalAmount: newTotalAmount,
                    })
                }
                lastOperation = {...accountOperations[i], fromAmount: newAmount, totalFromAmount: newTotalAmount }
            }

            // actAccountFutureInterest
            const monthToFill = [...newDatePeriods].filter(d => d + 1 > lastOperationSaved()?.finalDate && d > new Date())
            const getFutureAmount = (resInt, lastResInt) => 
                (resInt - (lastResInt || lastOperationSaved()?.totalAmount));

            for (let i = 0; i < monthToFill.length; i++) {
                const futureIntDate = new Date(monthToFill[i]).setDate(new Date(lastOperation?.finalDate).getDate())
                
                const daysOfInt = (lastOperation?.finalDate < newDatePeriods[0])
                    ? getDifMonths(new Date(lastOperation?.finalDate), new Date(futureIntDate)) * 30
                    : (actAcc.termInDays || 30) * (i + 1)
                
                const futureTotalAmount = calcResIntComp(daysOfInt, (actAcc.termInDays || 30), actAcc.TNA, lastOperation?.totalFromAmount, actAcc.periodicAdd, actAcc.currency);
                const futureAmount = getFutureAmount(futureTotalAmount, (monthToFill.length === (selectedAmountPeriods + 1) && i === 0) ?
                    calcResIntComp(daysOfInt - 30, (actAcc.termInDays || 30), actAcc.TNA, lastOperation?.totalFromAmount, actAcc.periodicAdd, actAcc.currency)
                    : null)

                // if(actAcc.accountName === "Santander PF") console.log("ACA futureTotalAmount", futureTotalAmount, daysOfInt, actAcc.termInDays, actAcc.TNA, lastOperation?.totalFromAmount, actAcc.periodicAdd, actAcc.currency)

                saveBiggerValInt(futureTotalAmount, actAcc.creationDate)
                saveBiggerVal(futureAmount, actAcc.creationDate)

                savedOperations.push({
                    fromAccount: actAcc.creationDate, 
                    fromAccountName: actAcc.accountName, 
                    finalDate: futureIntDate,
                    operType: 'FUTURE_INTEREST',
                    title: 'Interes futuro estimado',
                    amount: futureAmount,
                    percAmount: (lastOperationSaved()?.totalAmount !== 0) ? (futureAmount / lastOperationSaved()?.totalAmount * 100) : 0,
                    totalAmount: futureTotalAmount,
                })

                if (daysOfInt >= 30 && actAcc.periodicAdd !== 0) {
                    savedOperations.push({
                        fromAccount: actAcc.creationDate, 
                        fromAccountName: actAcc.accountName, 
                        finalDate: futureIntDate + 1,
                        operType: 'FUTURE_INCOME',
                        title: 'Ingreso futuro estimado',
                        amount: actAcc.periodicAdd,
                        percAmount: 0,
                        totalAmount: futureTotalAmount + actAcc.periodicAdd,
                    })
                }
            }

            return { accInfo: { ...actAcc }, operations: savedOperations }
            // name: actAcc.accountName + (actAcc.TNA === 0 ? '' : ' (TNM ' + formatNum(actAcc.TNA / 365 * 30 * 100) + '%)'),
        }

        // Function getTotalSerie (ARREGLAR)
        const getTotalSerie = (prevSeries) => {
            const totalData = [];
            const totalDataInt = [];
            const totalDataIntPerc = [];
            // const ex = { Jan: {}, Feb: {}, Mar: {}, Apr: {}, May: {}, Jun: {}, Jul: {}, Aug: {}, Sep: {}, Oct: {}, Nov: {}, Dec: {} }
            // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

            for (let i = 1; i < newDatePeriods.length; i++) {
                let totalValue = 0;
                for (let j = 0; j < prevSeries.length; j++) {
                    totalValue += [...prevSeries[j].accFinalAmounts]?.reverse()
                        ?.find(point => point[0] < newDatePeriods[i])?.[1] || 0;

                    // ex[months[new Date(newDatePeriods[i]).getMonth()]][prevSeries[j].name] =
                    //     [...prevSeries[j].accFinalAmounts]?.reverse()
                    //         ?.find(point => point[0] < newDatePeriods[i])?.[1] || 0

                }

                // ex[months[new Date(newDatePeriods[i]).getMonth()]]['Total'] = totalValue;
                const pointDate = newDatePeriods[i];
                totalData[i - 1] = [pointDate, truncateTwoDecimals(totalValue)]
                saveBiggerVal(totalValue, 'total');
                const totalValueInt = totalValue - (totalData[i - 2]?.[1] || 0)
                totalDataInt[i - 1] = [pointDate, truncateTwoDecimals(totalValueInt)]
                saveBiggerValInt(totalValueInt, 'total');
                const totalValueIntPerc = totalData[i - 2]?.[1] ? totalValueInt / (totalData[i - 2]?.[1]) * 100 : 0
                totalDataIntPerc[i - 1] = [pointDate, truncateTwoDecimals(totalValueIntPerc)]
            }
            // console.log("ACA ex", ex);
            return { id: 'total', name: 'Total', accFinalAmounts: totalData, intAccSerie: totalDataInt, intAccPercSerie: totalDataIntPerc };
        }

        // Function getTotalSelectionSerie
        const getTotalSelectionSerie = (selectedAccountSeries) => {
            const totalData = [];
            const totalDataInt = [];
            const totalDataIntPerc = [];

            for (let i = 1; i < datePeriods.length; i++) {
                let totalValue = 0;
                for (let j = 0; j < selectedAccountSeries.length; j++) {
                    totalValue += [...selectedAccountSeries[j].accFinalAmounts]?.reverse()
                        ?.find(point => point[0] < datePeriods[i])?.[1] || 0;
                }

                const pointDate = datePeriods[i];
                totalData[i - 1] = [pointDate, truncateTwoDecimals(totalValue)]
                saveBiggerVal(totalValue, 'totalSelection');
                const totalValueInt = totalValue - (totalData[i - 2]?.[1] || 0)
                totalDataInt[i - 1] = [pointDate, truncateTwoDecimals(totalValueInt)]
                saveBiggerValInt(totalValueInt, 'totalSelection');
                const totalValueIntPerc = totalData[i - 2]?.[1] ? totalValueInt / (totalData[i - 2]?.[1]) * 100 : 0
                totalDataIntPerc[i - 1] = [pointDate, truncateTwoDecimals(totalValueIntPerc)]
            }
            return { id: 'totalSelection', name: 'Total Seleccionados', accFinalAmounts: totalData, intAccSerie: totalDataInt, intAccPercSerie: totalDataIntPerc };
        }


        //// START

        // Get selectedAccountsSeries
        const newAccountsData = selectableAccounts.reduce((allNewAccountsData, actAcc) => {
            if (!!accountChecked[actAcc.creationDate] || !!extraInfoChecked?.total) {
                if (1) { // different that lastSaved
                    return [...allNewAccountsData, getAccountData(actAcc)]
                }
            } else {
                return allNewAccountsData
            }
        }, [])
        console.log("ACA newAccountsData", newAccountsData)
        setAccountsData(newAccountsData);

        // CHART
        setDatePeriods(newDatePeriods)
        setBiggerValues([biggerValue, biggerValueInt])

        

        // const newAccountSeriesProps = [slot, selectedAmountPeriods, accounts, mainCurrency, currencies, operations, accountChecked, extraInfoChecked]
        // if (JSON.stringify(newAccountSeriesProps) !== JSON.stringify(lastAccountSeriesProps)) {

            // // Get selectedExtrasSeries
            // const newSelectedExtraSeries = {}

            // if (!!extraInfoChecked?.total && newSelectedAccountSeries.length > 1) {
            //     newSelectedExtraSeries.total = getTotalSerie(newSelectedAccountSeries)
            // }

            // if (!!extraInfoChecked?.totalSelection && newSelectedAccountSeries.length > 1) {
            //     newSelectedExtraSeries.totalSelection = getTotalSelectionSerie(newSelectedAccountSeries.filter(s => !!accountChecked[s.id]));
            // }



        //     // console.log("ACA newAllSeries", { newSelectedAccountSeries, newSelectedExtraSeries, biggerValue, biggerValueInt, newDatePeriods })
        //     setAccountSeries(prevSeries => ([...prevSeries.filter(pS => !newSelectedAccountSeries.some(nS => nS.name === pS.name)), ...newSelectedAccountSeries]))
        //     setLastAccountSeriesProps(newAccountSeriesProps)
        //     setExtraSeries(prevSeries => ({ ...prevSeries, ...newSelectedExtraSeries }))
        //     setDatePeriods(newDatePeriods)
        //     setBiggerValues([biggerValue, biggerValueInt])

        //     // Select accTableRows
        //     // console.log("ACA newAccountsTableRows", newAccountsTableRows)
        //     setAccountsData(prevTables => ({ ...prevTables, ...newAccountsTableRows }));
        // }

    }, [
        slot, selectedAmountPeriods,

        accountChecked, extraInfoChecked,

        selectableAccounts, operations,
        mainCurrency, currencies,

        // setAccountSeries,
        // setLastAccountSeriesProps,
        // setExtraSeries,
        setDatePeriods,
        setBiggerValues,
        setAccountsData
    ]);



    // FUNCTIONS

    const checkAll = () => {
        setAccountChecked(lv =>
            Object.keys(lv).reduce((allValues, lvKey) => ({ ...allValues, [lvKey]: true }), {})
        )
    }

    const checkOnlyOne = (intAccId) => {
        const checkedIsExtra = Object.keys(extraInfoChecked).includes(intAccId);
        setAccountChecked(lv => {
            const negativeValues = Object.keys(lv).reduce((allValues, lvKey) => ({ ...allValues, [lvKey]: false }), {})
            if (checkedIsExtra) return negativeValues;
            return { ...negativeValues, [intAccId]: true };
        })
        setExtraInfoChecked(lv => {
            const negativeValues = Object.keys(lv).reduce((allValues, lvKey) => ({ ...allValues, [lvKey]: false }), {})
            if (!checkedIsExtra) return negativeValues;
            return { ...negativeValues, [intAccId]: true };
        })
    }

    return <Context.Provider value={{
        slot, setSlot, 
        selectedAmountPeriods, setSelectedAmountPeriods,  
        showOnlyInterest, setShowOnlyInterest,
        
        selectableAccounts,
        accountsData, setAccountsData,
        extraInfoData, setExtraInfoData,
        accountChecked, setAccountChecked,
        extraInfoChecked, setExtraInfoChecked,
        
        datePeriods, setDatePeriods,
        biggerValues, setBiggerValues,
        // accountSeries, setAccountSeries,
        // lastAccountSeriesProps, setLastAccountSeriesProps,
        // extraSeries, setExtraSeries,

        checkAll, checkOnlyOne,
        }} >
        {children}
    </Context.Provider>
}

export default Context;












 // useEffect(() => {


    //     //// START

    //     setAccountsData(lastAccountsData => {
    //         const newAccountsData = { ...lastAccountsData }

    //         const accountsChKeys = Object.keys(accountChecked).reduce((accountCheckedArr, actAccChKey) => [
    //             ...accountCheckedArr, ...(!!accountChecked[actAccChKey]?actAccChKey:[])
    //         ],[]);
    //         for(let accChIndex = 0; accChIndex < accountsChKeys.length; accChIndex++) {

    //             const alreadyInAccountData = Object.keys(lastAccountsData).includes(accountsChKeys[accChIndex])
    //             if (!alreadyInAccountData) {
    //                 newAccountsData[accountsChKeys[accChIndex]] = {
    //                     id: accountsChKeys[accChIndex],
    //                     accountInfo: accounts[accountsChKeys[accChIndex]],
    //                     params: {
    //                         amountPeriods: 0,
    //                         startPeriod: 0,
    //                     },
    //                     operations: {}
    //                 }
    //             } 


    //             // Only get not already periods
    //             // const {startPeriod, amountPeriods: savedAmountPeriods } = newAccountsData[accountsChKeys[accChIndex]].params;
    //             // const savedStartPeriod = startPeriod;
    //             // const savedEndPeriod = (savedAmountPeriods + savedStartPeriod);
    //             // const {savedPeriods} = newAccountsData[accountsChKeys[accChIndex]].params;
                
    //             const selectedStartPeriod = (slot * selectedAmountPeriods) - 1;
    //             const selectedEndPeriod = ((slot + 1) * selectedAmountPeriods) + 1;

    //             const getDatePeriod = (numPeriod) => {
    //                 const yearNum = Math.floor(numPeriod / 12);
    //                 const monthNum = (numPeriod % 12 < 0) ? 12 + numPeriod % 12 : numPeriod % 12;
    //                 return new Date(new Date().getFullYear() + yearNum, monthNum, 1);
    //             }

    //             const toDoDatePeriods = []
    //             for(let periodIndex = selectedStartPeriod; periodIndex < selectedEndPeriod; periodIndex++) {
    //                 toDoDatePeriods.push(getDatePeriod(periodIndex))
    //             }
    //             console.log("ACA Periods:", "("+selectedStartPeriod+"-"+selectedEndPeriod+")", toDoDatePeriods)


    //             const accountOperations = Object.values(operations).filter(oper => oper.fromAccount === accountsChKeys[accChIndex])
    //             toDoDatePeriods.map(datePeriod => {
                    
    //             });

    //         }

    //         // Get accountsData
    //         const newAccountsData = Object.values(accounts).reduce((allAccDatas, actAcc) => {
    //             if (!!accountChecked[actAcc.id] || !!extraInfoChecked?.total) {
    //                 if (1) { // different that lastSaved
    //                     return [...allAccDatas, getAccountData(actAcc)]
    //                 }
    //             } else {
    //                 return allAccDatas
    //             }
    //         }, [])
    //         // console.log("ACA newSelectedAccountSeries", newSelectedAccountSeries)

    //         return newAccountsData;
    //     })
        
    //     dispatch(setLoading(false));
    // }, [ 
    //     accounts, 
    //     accountChecked, extraInfoChecked,   
    //     slot, selectedAmountPeriods, showOnlyInterest,
    //     setAccountsData, setDatePeriods, setBiggerValues,
    //     dispatch
    // ])











// useEffect(() => {

//         // Calculate newDatePeriods
//         // let newDatePeriods = []
//         // for (let i = selectedAmountPeriods * slot; i <= selectedAmountPeriods * (slot + 1); i++) {
//         //     const now = new Date(new Date().getFullYear(), 0, 1);
//         //     if (now.getMonth() + i > 11) {
//         //         newDatePeriods.push(new Date(now.getFullYear() + 1, now.getMonth() + i - 12, 1).getTime())
//         //     } else {
//         //         newDatePeriods.push(new Date(now.getFullYear(), now.getMonth() + i, 1).getTime())
//         //     }
//         // }

//         const selectedStartPeriod = (slot * selectedAmountPeriods) - 1;
//         const selectedEndPeriod = ((slot + 1) * selectedAmountPeriods) + 1;
//         const getDatePeriod = (numPeriod) => {
//             const yearNum = Math.floor(numPeriod / 12);
//             const monthNum = (numPeriod % 12 < 0) ? 12 + numPeriod % 12 : numPeriod % 12;
//             return new Date(new Date().getFullYear() + yearNum, monthNum, 1).getTime();
//         }
//         const newDatePeriods = []
//         for(let periodIndex = selectedStartPeriod; periodIndex < selectedEndPeriod; periodIndex++) {
//             newDatePeriods.push(getDatePeriod(periodIndex))
//         }
//         console.log("ACA Periods:", "("+selectedStartPeriod+"-"+selectedEndPeriod+")", newDatePeriods)

//         // Start BiggerValues
//         let biggerValue = {};
//         const saveBiggerVal = (v, id) => { if (!biggerValue?.[id] || v > biggerValue[id]) biggerValue[id] = Math.floor(v) }
//         let biggerValueInt = {};
//         const saveBiggerValInt = (v, id) => { if (!biggerValueInt?.[id] || v > biggerValueInt[id]) biggerValueInt[id] = Math.floor(v) }

//         const newAccountsTableRows = {}

//         // Function getAccountData
//         const getAccountData = (actAcc) => {
//             const accFinalAmounts = [];
//             const accInterests = [];
//             const accPercInterests = [];

//             const creationPoint = [actAcc.creationDate, actAcc.initialAmount];
//             let lastOperation = [...creationPoint];
//             const lastPointSerie = () => accFinalAmounts.length ? accFinalAmounts[accFinalAmounts.length - 1] : [newDatePeriods[0], lastOperation[1]];
//             const saveOperation = (date, resInt, hasInterest = true, hasPeriodicAdd = false, lastResInt) => {
//                 if (hasInterest) {
//                     const realInt = ((resInt - (lastResInt || lastPointSerie()[1])) - (hasPeriodicAdd ? actAcc.periodicAdd : 0));
//                     accInterests.push([date, truncateTwoDecimals(realInt)])
//                     saveBiggerValInt(realInt, actAcc.id)
//                     // console.log("ACA realInt", realInt, resInt, lastPointSerie()[1])

//                     const realIntPerc = realInt / lastPointSerie()[1]
//                     accPercInterests.push([date, truncateTwoDecimals(realIntPerc * 100)])
//                 }

//                 accFinalAmounts.push([date, resInt])
//                 saveBiggerVal(resInt, actAcc.id)
//             }

//             if (creationPoint[0] > newDatePeriods[0]) saveOperation(creationPoint[0], creationPoint[1])
//             newAccountsTableRows[actAcc.id] = [{
//                 // initialDate: 0,
//                 // days: 0,
//                 finalDate: actAcc.creationDate,
//                 title: "Creación",
//                 // initialAmount: 0,
//                 dif: actAcc.initialAmount,
//                 difPorc: 0,
//                 finalAmount: actAcc.initialAmount,
//             }]

//             // accountOperPoints
//             const accountOperations = Object.values(operations)
//                 .filter(intOper => (intOper.fromAccount === actAcc.id))
//                 .sort((a, b) => a.date - b.date);

//             for (let i = 0; i < accountOperations.length; i++) {
//                 //accOper in Serie
//                 const operPoint = [accountOperations[i].date, accountOperations[i].newValue]
//                 if (operPoint[0] > lastPointSerie()[0] && operPoint[0] < newDatePeriods[newDatePeriods.length - 1]) {
//                     if (accountOperations[i].operType === "INTEREST") {
//                         saveOperation(operPoint[0], operPoint[1]);
//                     } else {
//                         saveOperation(operPoint[0], operPoint[1], false);
//                     }
//                 }

//                 if (accountOperations[i].operType === "INTEREST") {
//                     newAccountsTableRows[actAcc.id].push({
//                         // initialDate: accountOperations[i].initialDate ||
//                         //     ((accountOperations[i].date && actAcc.termInDays)
//                         //         ? accountOperations[i].date - actAcc.termInDays : 0),
//                         // days: actAcc.termInDays ? actAcc.termInDays : 0,
//                         finalDate: accountOperations[i].date,
//                         title: "Intereses",
//                         // initialAmount: lastOperation[1],
//                         dif: accountOperations[i].newValue - lastOperation[1],
//                         difPorc: (accountOperations[i].newValue - lastOperation[1]) / lastOperation[1],
//                         finalAmount: accountOperations[i].newValue,
//                     })
//                 } else if (accountOperations[i].operType === "INCOME") {
//                     newAccountsTableRows[actAcc.id].push({
//                         // initialDate: 0,
//                         // days: 0,
//                         finalDate: accountOperations[i].date,
//                         title: "Ingreso",
//                         // initialAmount: lastOperation[1],
//                         dif: accountOperations[i].fromAmount || accountOperations[i].newValue - lastOperation[1],
//                         difPorc: 0,
//                         finalAmount: accountOperations[i].newValue,
//                     })
//                 }

//                 lastOperation = operPoint;
//             }

//             // actAccountFuturePoints
//             const monthToFill = [...newDatePeriods].filter(d => d + 1 > lastPointSerie()[0])
//             for (let i = 0; i < monthToFill.length; i++) {
//                 const futurePointDate = new Date(monthToFill[i]).setDate(new Date(lastOperation[0]).getDate())

//                 const daysOfInt = (lastOperation[0] < newDatePeriods[0])
//                     ? getDifMonths(new Date(lastOperation[0]), new Date(futurePointDate)) * 30
//                     : actAcc.termInDays * (i + 1)

//                 const resIntComp = calcResIntComp(daysOfInt, actAcc.termInDays, actAcc.TNA, lastOperation[1], actAcc.periodicAdd, actAcc.currencyName);
//                 // if (actAcc.id === 2) console.log("ACA", resIntComp, daysOfInt)
//                 // console.log("ACAAAA", i, monthToFill.length, selectedAmountPeriods)
//                 saveOperation(futurePointDate, resIntComp, true, (daysOfInt >= 60), (monthToFill.length === (selectedAmountPeriods + 1) && i === 0) ?
//                     calcResIntComp(daysOfInt - 30, actAcc.termInDays, actAcc.TNA, lastOperation[1], actAcc.periodicAdd, actAcc.currencyName)
//                     : null)
//             }

//             return {
//                 id: actAcc.id,
//                 name: actAcc.accountName + (actAcc.TNA === 0 ? '' : ' (TNM ' + formatNum(actAcc.TNA / 365 * 30 * 100) + '%)'),
//                 accFinalAmounts, accInterests, accPercInterests
//             }
//         }

//         // Function getTotalSerie (ARREGLAR)
//         const getTotalSerie = (prevSeries) => {
//             const totalData = [];
//             const totalDataInt = [];
//             const totalDataIntPerc = [];
//             // const ex = { Jan: {}, Feb: {}, Mar: {}, Apr: {}, May: {}, Jun: {}, Jul: {}, Aug: {}, Sep: {}, Oct: {}, Nov: {}, Dec: {} }
//             // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

//             for (let i = 1; i < newDatePeriods.length; i++) {
//                 let totalValue = 0;
//                 for (let j = 0; j < prevSeries.length; j++) {
//                     totalValue += [...prevSeries[j].accFinalAmounts]?.reverse()
//                         ?.find(point => point[0] < newDatePeriods[i])?.[1] || 0;

//                     // ex[months[new Date(newDatePeriods[i]).getMonth()]][prevSeries[j].name] =
//                     //     [...prevSeries[j].accFinalAmounts]?.reverse()
//                     //         ?.find(point => point[0] < newDatePeriods[i])?.[1] || 0

//                 }

//                 // ex[months[new Date(newDatePeriods[i]).getMonth()]]['Total'] = totalValue;
//                 const pointDate = newDatePeriods[i];
//                 totalData[i - 1] = [pointDate, truncateTwoDecimals(totalValue)]
//                 saveBiggerVal(totalValue, 'total');
//                 const totalValueInt = totalValue - (totalData[i - 2]?.[1] || 0)
//                 totalDataInt[i - 1] = [pointDate, truncateTwoDecimals(totalValueInt)]
//                 saveBiggerValInt(totalValueInt, 'total');
//                 const totalValueIntPerc = totalData[i - 2]?.[1] ? totalValueInt / (totalData[i - 2]?.[1]) * 100 : 100
//                 totalDataIntPerc[i - 1] = [pointDate, truncateTwoDecimals(totalValueIntPerc)]
//             }
//             // console.log("ACA ex", ex);
//             return { id: 'total', name: 'Total', accFinalAmounts: totalData, intAccSerie: totalDataInt, intAccPercSerie: totalDataIntPerc };
//         }

//         // Function getTotalSelectionSerie
//         const getTotalSelectionSerie = (selectedAccountSeries) => {
//             const totalData = [];
//             const totalDataInt = [];
//             const totalDataIntPerc = [];

//             for (let i = 1; i < datePeriods.length; i++) {
//                 let totalValue = 0;
//                 for (let j = 0; j < selectedAccountSeries.length; j++) {
//                     totalValue += [...selectedAccountSeries[j].accFinalAmounts]?.reverse()
//                         ?.find(point => point[0] < datePeriods[i])?.[1] || 0;
//                 }

//                 const pointDate = datePeriods[i];
//                 totalData[i - 1] = [pointDate, truncateTwoDecimals(totalValue)]
//                 saveBiggerVal(totalValue, 'totalSelection');
//                 const totalValueInt = totalValue - (totalData[i - 2]?.[1] || 0)
//                 totalDataInt[i - 1] = [pointDate, truncateTwoDecimals(totalValueInt)]
//                 saveBiggerValInt(totalValueInt, 'totalSelection');
//                 const totalValueIntPerc = totalData[i - 2]?.[1] ? totalValueInt / (totalData[i - 2]?.[1]) * 100 : 100
//                 totalDataIntPerc[i - 1] = [pointDate, truncateTwoDecimals(totalValueIntPerc)]
//             }
//             return { id: 'totalSelection', name: 'Total Seleccionados', accFinalAmounts: totalData, intAccSerie: totalDataInt, intAccPercSerie: totalDataIntPerc };
//         }


//         //// START

//         // Get selectedAccountsSeries
//         const newAccountsData = Object.values(accounts).reduce((allNewAccountsData, actAcc) => {
//             if (!!accountChecked[actAcc.id] || !!extraInfoChecked?.total) {
//                 if (1) { // different that lastSaved
//                     return [...allNewAccountsData, getAccountData(actAcc)]
//                 }
//             } else {
//                 return allNewAccountsData
//             }
//         }, [])
//         // console.log("ACA newSelectedAccountSeries", newSelectedAccountSeries)

//         const newAccountSeriesProps = [slot, selectedAmountPeriods, accounts, mainCurrency, currencies, operations, accountChecked, extraInfoChecked]
//         if (JSON.stringify(newAccountSeriesProps) !== JSON.stringify(lastAccountSeriesProps)) {

//             // Get selectedExtrasSeries
//             const newSelectedExtraSeries = {}

//             if (!!extraInfoChecked?.total && newSelectedAccountSeries.length > 1) {
//                 newSelectedExtraSeries.total = getTotalSerie(newSelectedAccountSeries)
//             }

//             if (!!extraInfoChecked?.totalSelection && newSelectedAccountSeries.length > 1) {
//                 newSelectedExtraSeries.totalSelection = getTotalSelectionSerie(newSelectedAccountSeries.filter(s => !!accountChecked[s.id]));
//             }



//             // console.log("ACA newAllSeries", { newSelectedAccountSeries, newSelectedExtraSeries, biggerValue, biggerValueInt, newDatePeriods })
//             setAccountSeries(prevSeries => ([...prevSeries.filter(pS => !newSelectedAccountSeries.some(nS => nS.name === pS.name)), ...newSelectedAccountSeries]))
//             setLastAccountSeriesProps(newAccountSeriesProps)
//             setExtraSeries(prevSeries => ({ ...prevSeries, ...newSelectedExtraSeries }))
//             setDatePeriods(newDatePeriods)
//             setBiggerValues([biggerValue, biggerValueInt])

//             // Select accTableRows
//             // console.log("ACA newAccountsTableRows", newAccountsTableRows)
//             setAccountsData(prevTables => ({ ...prevTables, ...newAccountsTableRows }));
//         }

//     }, [
//         slot, selectedAmountPeriods,

//         accountChecked, extraInfoChecked,

//         accounts, operations,
//         mainCurrency, currencies,

//         setAccountSeries,
//         setLastAccountSeriesProps,
//         setExtraSeries,
//         setDatePeriods,
//         setBiggerValues,
//         setAccountsData
//     ]);