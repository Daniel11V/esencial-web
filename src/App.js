// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import Authentication from 'components/Authentication';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
    <ThemeCustomization>
        <ScrollTop>
            <Authentication>
                <Routes />
            </Authentication>
        </ScrollTop>
    </ThemeCustomization>
);

export default App;
