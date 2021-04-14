import React from 'react';
import {
    Text,
    View,
    Platform,
    PermissionsAndroid,
    Alert,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    NativeModules,
    Linking
} from 'react-native';
import {
    getBeaconDataIos,
    getBeaconDataAndroid,
    stopGetBeacons,
    getLocationDataByBeacon,
    fetchBeaconKeys,
    login,
    goToSearchPage,
    getHistory,
    getRestaurantData,
    clearBeaconList
} from "../../store/actions/index"
import { Navigation } from "react-native-navigation";
import { connect } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';
import {
    H1,
    Container,
    Header,
    Left,
    Button,
    Body,
    Right,
    Title,
    Item,
    ListItem,
    Content,
    Thumbnail,
    Footer,
    FooterTab,
    Badge
} from 'native-base';

import Icon from "react-native-vector-icons/FontAwesome5";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;

class qrCode extends React.Component {
    static get options() {
        return {
            topBar: {
                visible: false,
                animate: false,
                height: 0,
            }
        };
    }
    state = {
        rangingDataSource: [],
        history: [],
        isLoading: true,
        region: {
            identifier: "restaurantBeacon",
            uuid: "7005c5dc-4bc2-4164-b1ed-fc10fbb5c6af"
        }
    }

    constructor(props) {
        super(props);
    }

    onSuccess = e => {
        /*console.log(e);
        let data = {
            restaurantKey: e.data
        };
        this.handleGetRestaurantData(data)
        */
        dynamicLinks().resolveLink(e.data).then(link => {
            console.log(link.url);
            var str = link.url;
            var res = str.split("https://feedinapp.com?r=");
            let data = {
                restaurantKey: res[1]
            };
            this.handleGetRestaurantData(data)
        })
    };


    handleGetRestaurantData = (restaurantKey, beaconKey) => {
        this.props.onGetRestaurantData(restaurantKey, beaconKey);
    }

    handleBackButton = () => {
        Navigation.pop(this.props.componentId);
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header rounded style={{ backgroundColor: "#4bac61", height: 62 }}
                    androidStatusBarColor={"#357844"}>
                    <Left style={{ flex: null }}>
                        <Button transparent onPress={() => this.handleBackButton()}>
                            <Icon style={styles.burger} name='arrow-left' />
                        </Button>
                    </Left>
                    <Body><Text style={styles.title}>Inquadra il codice QR</Text></Body>
                </Header>
               
                <QRCodeScanner
                    showMarker={true}
                    markerStyle={styles.marker}
                    onRead={this.onSuccess}
                />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    logo: {
        flex: 1,
        textAlign: 'center',
        width: "100%",
        textAlignVertical: "center",
        alignSelf: "center",
        fontSize: 18,
        color: "#ccc",
        fontWeight: "400",
        opacity: 1
    },
    title: {
        fontWeight: "bold",
        fontSize: 24,
        color: "#FFFFFF",
        marginLeft: 14
    },
    sideBarMenu: {
        marginLeft: 16,
        marginRight: 4
    },
    burger: {
        fontSize: 28,
        color: "#fff"
    },
    alert: {
        fontSize: 36,
        color: "#f00"
    },
    history: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 23,
        paddingTop: 24,
        paddingLeft: 16,
    },
    near: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 23,
        paddingTop: 24,
        paddingLeft: 16,
    },
    listItem: {
        alignSelf: "center",
        width: "96%",
    },
    flatList: {
        marginBottom: 50
    },
    name: {
        fontSize: 18,
        color: "#000"
    },
    avatar: {
        width: 54,
        height: 54
    },
    marker: {
        borderRadius: 8,
        backgroundColor: "rgba(255,255,255,0)",
    },
    scanner:{
        flex: 1,
    },
    contentCamera:{
       
    }
});


const mapStateToProps = state => {
    return {
        restaurants: state.restaurant,
        history: state.restaurant.history,
        nearRestaurants: state.restaurant.nearRestaurants,
        isLoadingBeacons: state.ui.isLoading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadBeaconsAndroid: region => dispatch(getBeaconDataAndroid(region)),
        onLoadBeaconsIos: region => dispatch(getBeaconDataIos(region)),
        stopLoadBeacons: region => dispatch(stopGetBeacons(region)),
        onLoadLocation: () => dispatch(getLocationDataByBeacon()),
        onLogin: () => dispatch(login()),
        onGoToSearchPage: () => dispatch(goToSearchPage()),
        onGetHistory: history => dispatch(getHistory(history)),
        onGetRestaurantData: (data) => dispatch(getRestaurantData(data)),
        clearBeaconList: () => dispatch(clearBeaconList())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(qrCode);

