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
            accountName: 'Plazo Fijo Santander',
            currencyName: 'ARS',
            initialAmmount: 20000,
            firstEvent: 1641066015821,
            termInDays: 30,
            TNA: 0.46,
            periodicAdd: 20000
        },
        {
            accountName: 'Plazo Fijo 2 Santander',
            currencyName: 'ARS',
            initialAmmount: 100000,
            firstEvent: 1641066015821,
            termInDays: 30,
            TNA: 0.48,
            periodicAdd: 20000
        },
        // {
        //     accountName: 'Ahorro en USD',
        //     currencyName: 'USD',
        //     initialAmmount: 100,
        //     firstEvent: 1641066015821,
        //     termInDays: 30,
        //     TNA: 0.10,
        //     periodicAdd: 100
        // }
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
