// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    mainCurrency: 'ARS',
    currencies: {
        ARS: {
            name: 'ARS',
            actualValue: 1,
            inflationTna: 0
        },
        USD: {
            name: 'USD',
            actualValue: 200,
            inflationTna: 0.5
        },
        DAI: {
            name: 'DAI',
            actualValue: 200,
            inflationTna: 0.5
        },
        EUR: {
            name: 'EUR',
            actualValue: 200,
            inflationTna: 0.5
        }
    },
    periodicOperations: [
        {
            title: 'Sueldo Technisys',
            accountName: 'Santander',
            currencyName: 'ARS',
            initialAmmount: 50000.25,
            type: 'INCOME',
            firstEvent: 1641066015821,
            termInDays: 30
        },
        {
            title: 'Lavar Platos',
            accountName: 'Santander',
            currencyName: 'ARS',
            initialAmmount: 2000,
            type: 'INCOME',
            firstEvent: 1641066015821,
            termInDays: 30
        }
    ],
    interestAccounts: [
        {
            accountName: 'Santander Plazo Fijo ARS',
            currencyName: 'ARS',
            initialAmmount: 141789,
            firstEvent: 1641066015821,
            termInDays: 30,
            TNA: 0.46,
            periodicAdd: 20000
        },
        {
            accountName: 'Santander USD',
            currencyName: 'USD',
            initialAmmount: 278400,
            firstEvent: 1641066015821,
            termInDays: 30,
            TNA: 0,
            periodicAdd: 0
        },
        {
            accountName: 'Efectivo USD',
            currencyName: 'USD',
            initialAmmount: 179000,
            firstEvent: 1641066015821,
            termInDays: 30,
            TNA: 0,
            periodicAdd: 0
        },
        {
            accountName: 'Efectivo EUR',
            currencyName: 'EUR',
            initialAmmount: 16000,
            firstEvent: 1641066015821,
            termInDays: 30,
            TNA: 0,
            periodicAdd: 0
        },
        {
            accountName: 'BlockFi',
            currencyName: 'DAI',
            initialAmmount: 28074,
            firstEvent: 1641066015821,
            termInDays: 30,
            TNA: 0.07250,
            periodicAdd: 20000
        },
        {
            accountName: 'Nexo',
            currencyName: 'DAI',
            initialAmmount: 19470,
            firstEvent: 1641066015821,
            termInDays: 30,
            TNA: 0.08,
            periodicAdd: 20000
        },
        {
            accountName: 'Bitso',
            currencyName: 'DAI',
            initialAmmount: 16660,
            firstEvent: 1641066015821,
            termInDays: 30,
            TNA: 0.15,
            periodicAdd: 20000
        }
    ]
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
