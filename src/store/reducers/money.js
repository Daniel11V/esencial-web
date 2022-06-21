// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    mainCurrency: 'ARS',
    currencies: [
        {
            name: 'ARS',
            actualValue: 1,
            inflationTna: 0
        },
        {
            name: 'USD',
            actualValue: 200,
            inflationTna: 0.5
        },
        {
            name: 'DAI',
            actualValue: 200,
            inflationTna: 0.5
        },
        {
            name: 'EUR',
            actualValue: 200,
            inflationTna: 0.5
        }
    ],
    periodicOperations: [
        {
            title: 'Sueldo Technisys',
            accountName: 'Santander',
            currencyName: 'ARS',
            initialAmmount: 50000.25,
            type: 'INCOME',
            creationDate: 1641066015820,
            termInDays: 30
        },
        {
            title: 'Lavar Platos',
            accountName: 'Santander',
            currencyName: 'ARS',
            initialAmmount: 2000,
            type: 'INCOME',
            creationDate: 1641066015821,
            termInDays: 30
        }
    ],
    interestAccounts: {
        // 1: {
        //     id: 1,
        //     accountName: 'Santander ARS',
        //     currencyName: 'ARS',
        //     initialAmmount: 141789,
        //     creationDate: 1641066015821,
        //     termInDays: 30,
        //     TNA: 0,
        //     periodicAdd: 0
        // },
        2: {
            id: 2,
            accountName: 'Santander Plazo Fijo ARS',
            currencyName: 'ARS',
            initialAmmount: 100000,
            creationDate: new Date('05/06/2022'),
            termInDays: 30,
            TNA: 0.48,
            periodicAdd: 20000
        },
        3: {
            id: 3,
            accountName: 'BlockFi',
            currencyName: 'DAI',
            initialAmmount: 140.37 * 200,
            creationDate: new Date('04/05/2022'),
            termInDays: 30,
            TNA: 0.07250,
            periodicAdd: 20000
        },
        7: {
            id: 7,
            accountName: 'Bitso',
            currencyName: 'DAI',
            initialAmmount: 83.11 * 200,
            creationDate: new Date('06/06/2022'),
            termInDays: 30,
            TNA: 0.15,
            periodicAdd: 20000
        },
        8: {
            id: 8,
            accountName: 'Nexo',
            currencyName: 'DAI',
            initialAmmount: 97.35 * 200,
            creationDate: new Date('06/05/2022'),
            termInDays: 30,
            TNA: 0.08,
            periodicAdd: 20000
        },
        9: {
            id: 9,
            accountName: 'Dolar Efectivo',
            currencyName: 'USD',
            initialAmmount: (895 + 1392) * 200,
            creationDate: new Date('06/05/2022'),
            termInDays: 30,
            TNA: 0,
            periodicAdd: 0
        },
        10: {
            id: 10,
            accountName: 'Euros Efectivo',
            currencyName: 'EUR',
            initialAmmount: 80 * 200,
            creationDate: new Date('06/05/2022'),
            termInDays: 30,
            TNA: 0,
            periodicAdd: 0
        },
        // PAPA
        // 4: {
        //     id: 4,
        //     accountName: 'AMX',
        //     currencyName: 'ARS',
        //     initialAmmount: 620.6,
        //     creationDate: new Date('01/02/2022').getTime(),
        //     termInDays: 30,
        //     TNA: 0.55,
        //     periodicAdd: 0
        // },
        // 5: {
        //     id: 5,
        //     accountName: 'GOOGL',
        //     currencyName: 'ARS',
        //     initialAmmount: 245.2,
        //     creationDate: new Date('01/02/2022').getTime(),
        //     termInDays: 30,
        //     TNA: 0.55,
        //     periodicAdd: 0
        // },
        // 6: {
        //     id: 6,
        //     accountName: 'WMT',
        //     currencyName: 'ARS',
        //     initialAmmount: 96.2,
        //     creationDate: new Date('01/02/2022').getTime(),
        //     termInDays: 30,
        //     TNA: 0.55,
        //     periodicAdd: 0
        // },
    },

    // {
    //     accountName: 'Santander USD',
    //     currencyName: 'USD',
    //     initialAmmount: 278400,
    //     creationDate: 1641066015821,
    //     termInDays: 30,
    //     TNA: 0,
    //     periodicAdd: 0
    // },
    // {
    //     accountName: 'Efectivo USD',
    //     currencyName: 'USD',
    //     initialAmmount: 179000,
    //     creationDate: 1641066015821,
    //     termInDays: 30,
    //     TNA: 0,
    //     periodicAdd: 0
    // },
    // {
    //     accountName: 'Efectivo EUR',
    //     currencyName: 'EUR',
    //     initialAmmount: 16000,
    //     creationDate: 1641066015821,
    //     termInDays: 30,
    //     TNA: 0,
    //     periodicAdd: 0
    // },
    // {
    //     accountName: 'BlockFi',
    //     currencyName: 'DAI',
    //     initialAmmount: 28074,
    //     creationDate: 1641066015821,
    //     termInDays: 30,
    //     TNA: 0.07250,
    //     periodicAdd: 20000
    // },
    // {
    //     accountName: 'Nexo',
    //     currencyName: 'DAI',
    //     initialAmmount: 19470,
    //     creationDate: 1641066015821,
    //     termInDays: 30,
    //     TNA: 0.08,
    //     periodicAdd: 20000
    // },
    // {
    //     accountName: 'Bitso',
    //     currencyName: 'DAI',
    //     initialAmmount: 16660,
    //     creationDate: 1641066015821,
    //     termInDays: 30,
    //     TNA: 0.15,
    //     periodicAdd: 20000
    // }
    interestOperations: {
        1: {
            interestAccount: 3,
            date: new Date('06/06/2022'),
            value: 104032.91,
        },
        1001: {
            interestAccount: 3,
            date: new Date('06/07/2022'),
            value: 141789.78,
        },
        2: {
            interestAccount: 3,
            date: new Date('07/06/2022'),
            value: 147383.68,
        },
        22: {
            interestAccount: 3,
            date: new Date('05/31/2022'),
            value: 141.07 * 200,
        },
        23: {
            interestAccount: 7,
            date: new Date('06/13/2022'),
            value: 83.33 * 200,
        },
        24: {
            interestAccount: 7,
            date: new Date('06/20/2022'),
            value: 83.55 * 200,
        },
        25: {
            interestAccount: 8,
            date: new Date('06/06/2022'),
            value: 97.37 * 200,
        },
        26: {
            interestAccount: 8,
            date: new Date('06/07/2022'),
            value: 97.39 * 200,
        },
        27: {
            interestAccount: 8,
            date: new Date('06/08/2022'),
            value: 97.41 * 200,
        },
        28: {
            interestAccount: 8,
            date: new Date('06/09/2022'),
            value: 97.43 * 200,
        },
        29: {
            interestAccount: 8,
            date: new Date('06/10/2022'),
            value: 97.45 * 200,
        },
        30: {
            interestAccount: 8,
            date: new Date('06/11/2022'),
            value: 97.47 * 200,
        },
        31: {
            interestAccount: 8,
            date: new Date('06/12/2022'),
            value: 97.49 * 200,
        },
        32: {
            interestAccount: 8,
            date: new Date('06/13/2022'),
            value: 97.51 * 200,
        },
        33: {
            interestAccount: 8,
            date: new Date('06/14/2022'),
            value: 97.53 * 200,
        },
        34: {
            interestAccount: 8,
            date: new Date('06/21/2022'),
            value: 97.6637 * 200,
        },

        3: {
            interestAccount: 4,
            date: new Date('02/04/2022').getTime(),
            value: 749.9,
        },
        4: {
            interestAccount: 4,
            date: new Date('03/04/2022').getTime(),
            value: 641.7,
        },
        5: {
            interestAccount: 4,
            date: new Date('04/06/2022').getTime(),
            value: 659,
        },
        6: {
            interestAccount: 4,
            date: new Date('05/02/2022').getTime(),
            value: 670.8,
        },
        7: {
            interestAccount: 4,
            date: new Date('06/02/2022').getTime(),
            value: 656,
        },
        8: {
            interestAccount: 5,
            date: new Date('02/04/2022').getTime(),
            value: 269.5,
        },
        9: {
            interestAccount: 5,
            date: new Date('03/04/2022').getTime(),
            value: 218.8,
        },
        10: {
            interestAccount: 5,
            date: new Date('04/06/2022').getTime(),
            value: 219,
        },
        11: {
            interestAccount: 5,
            date: new Date('05/02/2022').getTime(),
            value: 203,
        },
        12: {
            interestAccount: 5,
            date: new Date('06/02/2022').getTime(),
            value: 199.7,
        },
        13: {
            interestAccount: 6,
            date: new Date('02/04/2022').getTime(),
            value: 103.4,
        },
        14: {
            interestAccount: 6,
            date: new Date('03/04/2022').getTime(),
            value: 95.8,
        },
        15: {
            interestAccount: 6,
            date: new Date('04/06/2022').getTime(),
            value: 95.5,
        },
        16: {
            interestAccount: 6,
            date: new Date('05/02/2022').getTime(),
            value: 106.5,
        },
        17: {
            interestAccount: 6,
            date: new Date('06/02/2022').getTime(),
            value: 88.5,
        },
        18: {
            interestAccount: 4,
            date: new Date('07/02/2022').getTime(),
            value: 615,
        },
        19: {
            interestAccount: 5,
            date: new Date('07/02/2022').getTime(),
            value: 212,
        },
        20: {
            interestAccount: 6,
            date: new Date('07/02/2022').getTime(),
            value: 97.5,
        },
        21: {
            interestAccount: 6,
            date: new Date('07/02/2022').getTime(),
            value: 97.5,
        },
    },
};

// ==============================|| SLICE - MONEY ||============================== //

const money = createSlice({
    name: 'money',
    initialState,
    reducers: {
        activeItem(state, action) {
            state.openItem = action.payload.openItem;
        },

        activeComponent(state, action) {
            state.openComponent = action.payload.openComponent;
        },

        openDrawer(state, action) {
            state.drawerOpen = action.payload.drawerOpen;
        },

        openComponentDrawer(state, action) {
            state.componentDrawerOpen = action.payload.componentDrawerOpen;
        }
    }
});

export default money.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer } = money.actions;
