// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    session: {
        localStoragePin: localStorage.getItem('moneyPin') || '',
        invalidPin: false,
        isAuth: false,
        openCreatePin: false,
        openAskPin: false,
        openBackdrop: false,
    },
    data: {
        mainCurrency: '',
        currencies: [
            // {
            //     name: 'ARS',
            //     actualValue: 1,
            //     inflationTna: 0
            // },
            // {
            //     name: 'USD',
            //     actualValue: 200,
            //     inflationTna: 0.5
            // },
        ],
        periodicOperations: [
            // {
            //     title: 'Sueldo Technisys',
            //     accountName: 'Santander',
            //     currencyName: 'ARS',
            //     initialAmount: 50000.25,
            //     type: 'INCOME',
            //     creationDate: 1641066015820,
            //     termInDays: 30
            // },
            // {
            //     title: 'Lavar Platos',
            //     accountName: 'Santander',
            //     currencyName: 'ARS',
            //     initialAmount: 2000,
            //     type: 'INCOME',
            //     creationDate: 1641066015821,
            //     termInDays: 30
            // }
        ],
        accounts: {
            // 8: {
            //     id: 8,
            //     accountName: 'Nexo',
            //     currencyName: 'DAI',
            //     initialAmount: 97.35 * 200,
            //     creationDate: new Date('06/05/2022').getTime(),
            //     termInDays: 30,
            //     TNA: 0.08,
            //     periodicAdd: 20000,
            // operations: {
            // 1: {
            //     interestAccount: 3,
            //     date: new Date('06/06/2022').getTime(),
            //     value: 104032.91,
            // },
            // }, 
            // },
            // 100: {
            //     id: 100,
            //     accountName: 'Euros Efectivo',
            //     currencyName: 'EUR',
            //     initialAmount: 80 * 200,
            //     creationDate: new Date('06/05/2022').getTime(),
            //     termInDays: 30,
            //     TNA: 0,
            //     periodicAdd: 0
            // },
            // 1000: {
            //     id: 1000,
            //     accountName: 'Euros Efectivo',
            //     currencyName: 'EUR',
            //     initialAmount: 80 * 200,
            //     creationDate: new Date('06/05/2022').getTime(),
            //     termInDays: 30,
            //     TNA: 0,
            //     periodicAdd: 0
            // },
            // 10000: {
            //     id: 10000,
            //     accountName: 'Euros Efectivo',
            //     currencyName: 'EUR',
            //     initialAmount: 80 * 200,
            //     creationDate: new Date('06/05/2022').getTime(),
            //     termInDays: 30,
            //     TNA: 0,
            //     periodicAdd: 0
            // },
            // 100000: {
            //     id: 100000,
            //     accountName: 'Euros Efectivo',
            //     currencyName: 'EUR',
            //     initialAmount: 80 * 200,
            //     creationDate: new Date('06/05/2022').getTime(),
            //     termInDays: 30,
            //     TNA: 0,
            //     periodicAdd: 0
            // },
        },
        operations: {
            // 1: {
            //     fromAccount: 3,
            //     fromAccountName: "",
            //     operType: "INTEREST" || "INCOME" || "EXPENSES" || "INTER_TRANSACTION"
            //     date: new Date('06/06/2022').getTime(),
            //     initialValue: 104032.91,
            // },
        },
    },
    data: {
        "mainCurrency": "ARS",
        "currencies": [
            {
                "name": "ARS",
                "actualValue": 1,
                "inflationTna": 0
            },
            {
                "name": "USD",
                "actualValue": 200,
                "inflationTna": 0.5
            },
            {
                "name": "DAI",
                "actualValue": 200,
                "inflationTna": 0.5
            },
            {
                "name": "EUR",
                "actualValue": 200,
                "inflationTna": 0.5
            }
        ],
        "accounts": {
            "121": {
                "id": 121,
                "accountName": "Efectivo ARS",
                "currencyName": "ARS",
                "initialAmount": 6930,
                "creationDate": 1651806000000,
                "termInDays": 0,
                "TNA": 0,
                "periodicAdd": 0
            },
            "122": {
                "id": 122,
                "accountName": "Efectivo USD",
                "currencyName": "USD",
                "initialAmount": 895,
                "creationDate": 1651806000000,
                "termInDays": 0,
                "TNA": 0,
                "periodicAdd": 0
            },
            "123": {
                "id": 123,
                "accountName": "Efectio EUR",
                "currencyName": "EUR",
                "initialAmount": 80,
                "creationDate": 1651806000000,
                "termInDays": 0,
                "TNA": 0,
                "periodicAdd": 0
            },
            "124": {
                "id": 124,
                "accountName": "Brubank",
                "currencyName": "ARS",
                "initialAmount": 2405,
                "creationDate": 1651806000000,
                "termInDays": 0,
                "TNA": 0,
                "periodicAdd": 0
            },
            "1": {
                "id": 1,
                "accountName": "Santander CC",
                "currencyName": "ARS",
                "initialAmount": 0,
                "creationDate": 1651806000000,
                "termInDays": 0,
                "TNA": 0,
                "periodicAdd": 0
            },
            "2": {
                "id": 2,
                "accountName": "Santander PF",
                "currencyName": "ARS",
                "initialAmount": 100000,
                "creationDate": 1651806000000,
                "termInDays": 30,
                "TNA": 0.48,
                "periodicAdd": 20000
            },
            "300": {
                "id": 300,
                "accountName": "Santander USD",
                "currencyName": "USD",
                "initialAmount": 892,
                "creationDate": 1651806000000,
                "termInDays": 0,
                "TNA": 0,
                "periodicAdd": 0
            },
            "3": {
                "id": 3,
                "accountName": "BlockFi",
                "currencyName": "DAI",
                "initialAmount": 28074,
                "creationDate": 1649127600000,
                "termInDays": 30,
                "TNA": 0.0725,
                "periodicAdd": 20000
            },
            // "4": {
            //     "id": 4,
            //     "accountName": "AMX",
            //     "currencyName": "ARS",
            //     "initialAmount": 620.6,
            //     "creationDate": 1641092400000,
            //     "termInDays": 30,
            //     "TNA": 0.55,
            //     "periodicAdd": 0
            // },
            // "5": {
            //     "id": 5,
            //     "accountName": "GOOGL",
            //     "currencyName": "ARS",
            //     "initialAmount": 245.2,
            //     "creationDate": 1641092400000,
            //     "termInDays": 30,
            //     "TNA": 0.55,
            //     "periodicAdd": 0
            // },
            // "6": {
            //     "id": 6,
            //     "accountName": "WMT",
            //     "currencyName": "ARS",
            //     "initialAmount": 96.2,
            //     "creationDate": 1641092400000,
            //     "termInDays": 30,
            //     "TNA": 0.55,
            //     "periodicAdd": 0
            // },
            "7": {
                "id": 7,
                "accountName": "Bitso",
                "currencyName": "DAI",
                "initialAmount": 16622,
                "creationDate": 1654484400000,
                "termInDays": 30,
                "TNA": 0.15,
                "periodicAdd": 20000
            },
            "8": {
                "id": 8,
                "accountName": "Nexo",
                "currencyName": "DAI",
                "initialAmount": 19470,
                "creationDate": 1654398000000,
                "termInDays": 30,
                "TNA": 0.08,
                "periodicAdd": 20000
            },
        },
        "periodicOperations": [
            {
                "title": "Sueldo Technisys",
                "account": "1",
                "accountName": "Santander",
                "currencyName": "ARS",
                "initialAmount": 100000,
                "type": "INCOME",
                "creationDate": 1641066015820,
                "termInDays": 30
            },
            {
                "title": "Sueldo Technisys MP",
                "account": "1",
                "accountName": "Santander",
                "currencyName": "ARS",
                "initialAmount": 11000,
                "type": "INCOME",
                "creationDate": 1641066015820,
                "termInDays": 30
            },
            {
                "title": "Lavar Platos",
                "account": "1",
                "accountName": "Santander",
                "currencyName": "ARS",
                "initialAmount": 2000,
                "type": "INCOME",
                "creationDate": 1641066015821,
                "termInDays": 30
            }
        ],
        "operations": {
            "1": {
                "fromAccount": 2,
                "fromAccountName": "Santander PF",
                "date": 1654484400000,
                "operType": "INTEREST",
                "interest": 4033.66,
                "newValue": 104033.66
            },
            "2": {
                "fromAccount": 2,
                "fromAccountName": "Santander PF",
                "date": 1654570800000,
                "operType": "INCOME",
                "income": 37756.12,
                "newValue": 141789.78
            },
            "200": {
                "fromAccount": 2,
                "fromAccountName": "Santander PF",
                "date": 1657076400000,
                "operType": "INTEREST",
                "newValue": 147383.68
            },
            "3": {
                "fromAccount": 4,
                "fromAccountName": "",
                "date": 1643943600000,
                "operType": "INTEREST",
                "newValue": 749.9
            },
            "4": {
                "fromAccount": 4,
                "fromAccountName": "",
                "date": 1646362800000,
                "operType": "INTEREST",
                "newValue": 641.7
            },
            "5": {
                "fromAccount": 4,
                "fromAccountName": "",
                "date": 1649214000000,
                "operType": "INTEREST",
                "newValue": 659
            },
            "6": {
                "fromAccount": 4,
                "fromAccountName": "",
                "date": 1651460400000,
                "operType": "INTEREST",
                "newValue": 670.8
            },
            "7": {
                "fromAccount": 4,
                "fromAccountName": "",
                "date": 1654138800000,
                "operType": "INTEREST",
                "newValue": 656
            },
            "8": {
                "fromAccount": 5,
                "fromAccountName": "",
                "date": 1643943600000,
                "operType": "INTEREST",
                "newValue": 269.5
            },
            "9": {
                "fromAccount": 5,
                "fromAccountName": "",
                "date": 1646362800000,
                "operType": "INTEREST",
                "newValue": 218.8
            },
            "10": {
                "fromAccount": 5,
                "fromAccountName": "",
                "date": 1649214000000,
                "operType": "INTEREST",
                "newValue": 219
            },
            "11": {
                "fromAccount": 5,
                "fromAccountName": "",
                "date": 1651460400000,
                "operType": "INTEREST",
                "newValue": 203
            },
            "12": {
                "fromAccount": 5,
                "fromAccountName": "",
                "date": 1654138800000,
                "operType": "INTEREST",
                "newValue": 199.7
            },
            "13": {
                "fromAccount": 6,
                "fromAccountName": "",
                "date": 1643943600000,
                "operType": "INTEREST",
                "newValue": 103.4
            },
            "14": {
                "fromAccount": 6,
                "fromAccountName": "",
                "date": 1646362800000,
                "operType": "INTEREST",
                "newValue": 95.8
            },
            "15": {
                "fromAccount": 6,
                "fromAccountName": "",
                "date": 1649214000000,
                "operType": "INTEREST",
                "newValue": 95.5
            },
            "16": {
                "fromAccount": 6,
                "fromAccountName": "",
                "date": 1651460400000,
                "operType": "INTEREST",
                "newValue": 106.5
            },
            "17": {
                "fromAccount": 6,
                "fromAccountName": "",
                "date": 1654138800000,
                "operType": "INTEREST",
                "newValue": 88.5
            },
            "18": {
                "fromAccount": 4,
                "fromAccountName": "",
                "date": 1656730800000,
                "operType": "INTEREST",
                "newValue": 615
            },
            "19": {
                "fromAccount": 5,
                "fromAccountName": "",
                "date": 1656730800000,
                "operType": "INTEREST",
                "newValue": 212
            },
            "20": {
                "fromAccount": 6,
                "fromAccountName": "",
                "date": 1656730800000,
                "operType": "INTEREST",
                "newValue": 97.5
            },
            "21": {
                "fromAccount": 6,
                "fromAccountName": "",
                "date": 1656730800000,
                "operType": "INTEREST",
                "newValue": 97.5
            },
            "22": {
                "fromAccount": 3,
                "fromAccountName": "",
                "date": 1653966000000,
                "operType": "INCOME",
                "newValue": 28214
            },
            "23": {
                "fromAccount": 7,
                "fromAccountName": "",
                "date": 1655089200000,
                "operType": "INTEREST",
                "newValue": 16666
            },
            "24": {
                "fromAccount": 7,
                "fromAccountName": "",
                "date": 1655694000000,
                "operType": "INTEREST",
                "newValue": 16710
            },
            "25": {
                "fromAccount": 8,
                "fromAccountName": "",
                "date": 1654484400000,
                "operType": "INTEREST",
                "newValue": 19474
            },
            "26": {
                "fromAccount": 8,
                "fromAccountName": "",
                "date": 1654570800000,
                "operType": "INTEREST",
                "newValue": 19478
            },
            "27": {
                "fromAccount": 8,
                "fromAccountName": "",
                "date": 1654657200000,
                "operType": "INTEREST",
                "newValue": 19482
            },
            "28": {
                "fromAccount": 8,
                "fromAccountName": "",
                "date": 1654743600000,
                "operType": "INTEREST",
                "newValue": 19486
            },
            "29": {
                "fromAccount": 8,
                "fromAccountName": "",
                "date": 1654830000000,
                "operType": "INTEREST",
                "newValue": 19490
            },
            "30": {
                "fromAccount": 8,
                "fromAccountName": "",
                "date": 1654916400000,
                "operType": "INTEREST",
                "newValue": 19494
            },
            "31": {
                "fromAccount": 8,
                "fromAccountName": "",
                "date": 1655002800000,
                "operType": "INTEREST",
                "newValue": 19498
            },
            "32": {
                "fromAccount": 8,
                "fromAccountName": "",
                "date": 1655089200000,
                "operType": "INTEREST",
                "newValue": 19502
            },
            "33": {
                "fromAccount": 8,
                "fromAccountName": "",
                "date": 1655175600000,
                "operType": "INTEREST",
                "newValue": 19506
            },
            "34": {
                "fromAccount": 8,
                "fromAccountName": "",
                "date": 1655780400000,
                "operType": "INTEREST",
                "newValue": 19532.74
            },
            "1001": {
                "fromAccount": 3,
                "fromAccountName": "",
                "date": 1654570800000,
                "operType": "INCOME",
                "newValue": 141789.78
            }
        }
    }
};

// ==============================|| SLICE - MONEY ||============================== //

const money = createSlice({
    name: 'money',
    initialState,
    reducers: {
        saveMoneyString(state, action) {
            state.data = JSON.parse(action.payload)
            // const moneyKeys = Object.keys(state);
            // for (let i = 0; i < moneyKeys.length; i++) {
            //     state[moneyKeys[i]] = newMoneyData[moneyKeys[i]];
            // }
        },
        setOpenCreatePin(state, action) {
            state.session.openCreatePin = action.payload;
        },
        setOpenAskPin(state, action) {
            state.session.openAskPin = action.payload;
        },
        setIsAuth(state, action) {
            state.session.isAuth = action.payload;
        },
        setInvalidPin(state, action) {
            state.session.invalidPin = action.payload;
        },
        setLocaleStoragePin(state, action) {
            state.session.localStoragePin = action.payload;
            localStorage.setItem('moneyPin', action.payload);
        },
        saveMoneyInLocalStorage(state, action) {
            localStorage.setItem('moneyData', action.payload || JSON.stringify(state.data));
        },
        setOpenBackdrop(state, action) {
            state.session.openBackdrop = action.payload;
        },
    }
});

export default money.reducer;

export const { saveMoneyString, setOpenCreatePin, setOpenAskPin, setIsAuth, setInvalidPin, setLocaleStoragePin, saveMoneyInLocalStorage, setOpenBackdrop } = money.actions;
