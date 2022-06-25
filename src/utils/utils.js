

export const formatNum = (x) => {
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

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
}

export const getDifDays = (d1, d2) =>
    Math.floor((d2 - d1) / (1000 * 60 * 60 * 24) / 30) * 30 + 30

export const truncateTwoDecimals = (v) => Number((Math.floor(v * 100) / 100).toFixed(2))

export const getDifMonths = (d1, d2) => {
    const t1 = new Date(d1);
    const t2 = new Date(d2);
    return ((t2.getFullYear() - t1.getFullYear()) * 12 + t2.getMonth() - t1.getMonth())
};