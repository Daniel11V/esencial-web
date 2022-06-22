// assets
import {
    AppstoreAddOutlined,
    AntDesignOutlined,
    FileDoneOutlined,
    HistoryOutlined,
    BankOutlined,
    LoadingOutlined,
    CodeOutlined
} from '@ant-design/icons';

// icons
const icons = {
    BankOutlined,
    HistoryOutlined,
    FileDoneOutlined,
    AntDesignOutlined,
    LoadingOutlined,
    AppstoreAddOutlined,
    CodeOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const datas = {
    id: 'datas',
    title: 'Datos',
    type: 'group',
    children: [
        {
            id: 'data-accounts',
            title: 'Cuentas',
            type: 'item',
            url: '/accounts',
            icon: icons.BankOutlined
        },
        {
            id: 'data-events',
            title: 'Eventos',
            type: 'item',
            url: '/events',
            icon: icons.HistoryOutlined
        },
        {
            id: 'data-operations',
            title: 'Operaciones',
            type: 'item',
            url: '/operations',
            icon: icons.FileDoneOutlined
        },
        {
            id: 'data-currencies',
            title: 'Monedas',
            type: 'item',
            url: '/currencies',
            icon: icons.AntDesignOutlined,
            breadcrumbs: false
        },
        {
            id: 'data-database',
            title: 'Base de Datos',
            type: 'item',
            url: '/database',
            icon: icons.CodeOutlined,
            breadcrumbs: false
        }
    ]
};

export default datas;
