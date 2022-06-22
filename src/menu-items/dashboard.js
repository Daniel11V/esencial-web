// assets
import { LineChartOutlined } from '@ant-design/icons';

// icons
const icons = {
    LineChartOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-dashboard',
    title: 'Navegación',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Gráfico',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.LineChartOutlined,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
