import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveMoneyString, setOpenCreatePin, setOpenAskPin, setIsAuth, setInvalidPin, setLocaleStoragePin, saveMoneyInLocalStorage } from 'store/reducers/money';

import {
    Button,
    TextField,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography
} from '@mui/material';

// ==============================|| AUTHENTICATION ||============================== //

const Authentication = ({ children }) => {
    const dispatch = useDispatch();
    const { localStoragePin, openCreatePin, openAskPin, isAuth, invalidPin } = useSelector((state) => state.money.session);

    const [inputPin, setInputPin] = useState('')
    // setStringData(localStorage.setItem('moneyData', JSON.stringify({})));

    useEffect(() => {
        if (localStoragePin && !isAuth) dispatch(setOpenAskPin(true));
    }, [localStoragePin]);

    const submitPin = () => {
        if (inputPin && inputPin === localStoragePin) {
            dispatch(setOpenAskPin(false));
            dispatch(saveMoneyString(localStorage.getItem('moneyData')));
            dispatch(setIsAuth(true));
        } else {
            dispatch(setInvalidPin(true));
        }
        setInputPin('');
    }

    const createPin = () => {
        if (inputPin) {
            dispatch(setOpenCreatePin(false));
            dispatch(setIsAuth(true));
            dispatch(saveMoneyInLocalStorage());
            dispatch(setLocaleStoragePin(inputPin));
        } else {
            dispatch(setInvalidPin(true));
        }
        setInputPin('');
    }

    return (
        <>
            {children || null}
            <Dialog open={openAskPin}>
                <DialogTitle>
                    {/* <Typography variant="h3"> */}
                    Cargar Datos
                    {/* </Typography> */}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Se han encontrado datos guardados en el dispositivo. Si desea
                        accederlos ingrese el Pin de Seguridad.
                    </DialogContentText>
                    <TextField
                        // autoFocus
                        margin="dense"
                        id="newPin"
                        label="Nuevo Pin"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={inputPin}
                        onChange={(e) => setInputPin(e.target.value)}
                        autoComplete="off"
                        error={invalidPin}
                    />
                </DialogContent>
                <DialogActions>
                    <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mr: 2, mb: 1 }}>
                        <Button onClick={() => dispatch(setOpenAskPin(false))}>CANCELAR</Button>
                        <Button onClick={submitPin} variant="contained">CARGAR</Button>
                    </Stack>
                </DialogActions>
            </Dialog>


            <Dialog open={openCreatePin} >
                <DialogTitle>
                    {/* <Typography variant="h3"> */}
                    Crear Pin de Seguridad
                    {/* </Typography> */}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Este pin se le solicitará cada vez que ingrese en la página para poder acceder a estos
                        datos guardados en la memoría del dispositivo.
                    </DialogContentText>
                    <TextField
                        // autoFocus
                        margin="dense"
                        id="newPin"
                        label="Nuevo Pin"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={inputPin}
                        onChange={(e) => setInputPin(e.target.value)}
                        autoComplete="off"
                        error={invalidPin}
                    />
                </DialogContent>
                <DialogActions>
                    <Stack direction="row" spacing={2} sx={{ mr: 2, mb: 1 }}>
                        <Button onClick={() => dispatch(setOpenCreatePin(false))}>CANCELAR</Button>
                        <Button onClick={createPin} variant="contained">CREAR Y GUARDAR</Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
};

Authentication.propTypes = {
    children: PropTypes.node
};

export default Authentication;
