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
            //     initialAmmount: 50000.25,
            //     type: 'INCOME',
            //     creationDate: 1641066015820,
            //     termInDays: 30
            // },
            // {
            //     title: 'Lavar Platos',
            //     accountName: 'Santander',
            //     currencyName: 'ARS',
            //     initialAmmount: 2000,
            //     type: 'INCOME',
            //     creationDate: 1641066015821,
            //     termInDays: 30
            // }
        ],
        interestAccounts: {
            // 8: {
            //     id: 8,
            //     accountName: 'Nexo',
            //     currencyName: 'DAI',
            //     initialAmmount: 97.35 * 200,
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
            //     initialAmmount: 80 * 200,
            //     creationDate: new Date('06/05/2022').getTime(),
            //     termInDays: 30,
            //     TNA: 0,
            //     periodicAdd: 0
            // },
            // 1000: {
            //     id: 1000,
            //     accountName: 'Euros Efectivo',
            //     currencyName: 'EUR',
            //     initialAmmount: 80 * 200,
            //     creationDate: new Date('06/05/2022').getTime(),
            //     termInDays: 30,
            //     TNA: 0,
            //     periodicAdd: 0
            // },
            // 10000: {
            //     id: 10000,
            //     accountName: 'Euros Efectivo',
            //     currencyName: 'EUR',
            //     initialAmmount: 80 * 200,
            //     creationDate: new Date('06/05/2022').getTime(),
            //     termInDays: 30,
            //     TNA: 0,
            //     periodicAdd: 0
            // },
            // 100000: {
            //     id: 100000,
            //     accountName: 'Euros Efectivo',
            //     currencyName: 'EUR',
            //     initialAmmount: 80 * 200,
            //     creationDate: new Date('06/05/2022').getTime(),
            //     termInDays: 30,
            //     TNA: 0,
            //     periodicAdd: 0
            // },
        },
        operations: {
            // 1: {
            //     interestAccount: 3,
            //     date: new Date('06/06/2022').getTime(),
            //     value: 104032.91,
            // },
        },
    },
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
