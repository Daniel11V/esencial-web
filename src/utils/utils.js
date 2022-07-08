import { store } from 'store';
const { mainCurrency, currencies } = store.getState().money.data;

export const fixDecimals = (num, decimals = 2) => {
    let x = Number(num)
    let numWith2DecimalsMax;
    if (x - Math.trunc(x) < 0.01) {
        numWith2DecimalsMax = Math.trunc(x);
    } else if (x - (Math.trunc(x * 10) / 10) < 0.1) {
        numWith2DecimalsMax = (Math.floor(x * 100) / 100).toFixed(1);
    } else {
        numWith2DecimalsMax = (Math.floor(x * 100) / 100).toFixed(2);
    }
    return numWith2DecimalsMax
}

export const formatNum = (num) => {
    return fixDecimals(num).toString().replace(".", ",").replace(/\B(?<!\,\d*)(?=(\d{3})+(?!\d))/g, ".");
}

const twoDigitsMin = (num) => (num < 10) ? "0" + num : num

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return twoDigitsMin(date.getDate()) + "/" + twoDigitsMin(date.getMonth() + 1) + "/" + date.getFullYear()
}

export const getDifDays = (d1, d2) =>
    Math.floor((d2 - d1) / (1000 * 60 * 60 * 24) / 30) * 30 + 30

export const truncateTwoDecimals = (v) => Number((Math.floor(v * 100) / 100).toFixed(2))

export const getDifMonths = (d1, d2) => {
    const t1 = new Date(d1);
    const t2 = new Date(d2);
    return ((t2.getFullYear() - t1.getFullYear()) * 12 + t2.getMonth() - t1.getMonth())
};


// Calcular el capital en plazo fijo con interes y monto añadido cada mes
export const calcResIntComp = (day, termInDays = 30, TNA, initialAmount, periodicAdd, currencyName) => {
    if (termInDays > day) return 0;

    const TNM = TNA === 0 ? 0.000001 : (TNA / 365 * termInDays);
    const AmmountMonths = Math.floor(day / termInDays);
    const resIntCompLastMonth = (Math.pow((1 + TNM), (AmmountMonths - 1)))
    // parseFloat(v.toFixed(2))
    if (currencyName === mainCurrency) {
        // resIntComp
        // console.log("ACA futureTotalAmount 1", day / termInDays, day, termInDays)
        if (TNA === 0) return initialAmount + periodicAdd * (AmmountMonths - 1);
        // console.log("ACA futureTotalAmount 2", TNA)
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


// Igual al Object.keys(object) solo que para los arrays
export const getKeys = (arr, keyId = "creationDate") =>
    arr.reduce((allKeys, actObj) => [...allKeys, actObj[keyId]], [])