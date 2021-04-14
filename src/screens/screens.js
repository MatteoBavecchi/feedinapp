import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import configureStore from "../store/configureStore";

const store = configureStore();

export function registerScreens() {

    Navigation.registerComponentWithRedux(
        'RNFirebaseStarter.HomeScreen',
        () => require('./Home/Home').default,
        Provider,
        store
    );

    Navigation.registerComponent(
        'RNFirebaseStarter.ImageView',
        () => require('./ImageView/ImageView').default,
    );

    Navigation.registerComponentWithRedux(
        'RNFirebaseStarter.QRScreen',
        () => require('./QrCode/QrCode').default,
        Provider,
        store
    );

    Navigation.registerComponentWithRedux(
        'RNFirebaseStarter.SearchScreen',
        () => require('./Search/Search').default,
        Provider,
        store
    );

    Navigation.registerComponentWithRedux(
        'RNFirebaseStarter.MenuScreen',
        () => require('./Menu/Menu').default,
        Provider,
        store
    );

    Navigation.registerComponentWithRedux(
        'RNFirebaseStarter.ModalOrderScreen',
        () => require('./ModalOrder/ModalOrder').default,
        Provider,
        store
    );

    Navigation.registerComponentWithRedux(
        'RNFirebaseStarter.Login',
        () => require('./Login/Login').default,
        Provider,
        store
    );
    Navigation.registerComponentWithRedux(
        'RNFirebaseStarter.Comande',
        () => require('./Comande/Comande').default,
        Provider,
        store
    );
    Navigation.registerComponentWithRedux(
        'RNFirebaseStarter.HomeAdmin',
        () => require('./HomeAdmin/HomeAdmin').default,
        Provider,
        store
    );
}