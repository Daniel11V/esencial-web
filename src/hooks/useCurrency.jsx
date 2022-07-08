import { useDispatch, useSelector } from 'react-redux';
import { formatNum, fixDecimals } from 'utils/utils';

export default function useCurrency () {
    const { mainCurrency, showCurrency, currencies } = useSelector((state) => state.money.data);

    
    const getCurrencySimbol = (currencyName = showCurrency) =>
        (currencyName === mainCurrency) ? "$" : currencyName

    const getCurrencyTranslation = (num, currencyName = showCurrency) => (currencyName === mainCurrency) ? ""
        : `($${formatNum(num * currencies?.find(c => c.name === currencyName)?.actualValue)})`

    const formatCurrencyAmount = (num, currencyName = showCurrency, originCurr) => 
        num * currencies?.find(c => c.name === originCurr)?.actualValue / currencies?.find(c => c.name === currencyName)?.actualValue
    

    const formatCurrency = (num, currencyName = showCurrency) => (currencyName === mainCurrency)
        ? `$${formatNum(num)}`
        : `${formatNum(num)} ${currencyName} ($${formatNum(num * currencies?.find(c => c.name === currencyName)?.actualValue)})`

    const CurrencySimbol = ({ simbol, pl= false,pr= false }) => (<span style={{ color: '#8c8c8c', paddingLeft: pl?10:1, paddingRight: pr?10:3 }}>{simbol}</span>)

    const CurrencyComponent = ({num, currencyName = showCurrency}) => (currencyName === mainCurrency) ? (
        <> <CurrencySimbol simbol={"$"} pr/> <span>{formatNum(num)}</span> </>
    ) : (
        <>
            <CurrencySimbol simbol={currencyName} /> <span>{formatNum(num)}</span> 
            <span style={{ paddingLeft: 17 }}>{"("}</span> <CurrencySimbol simbol={"$"} /> <span>{formatNum(num * currencies?.find(c => c.name === currencyName)?.actualValue)}</span> <span>{")"}</span>
        </>
    )

    return {
        getCurrencySimbol,
        getCurrencyTranslation,
        formatCurrencyAmount,
        formatCurrency,
        CurrencySimbol,
        CurrencyComponent,
        mainCurrency, showCurrency, currencies,
    }
}