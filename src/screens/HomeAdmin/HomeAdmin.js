import React from 'react';
import { Text, View, Platform, PermissionsAndroid, Alert, StyleSheet } from 'react-native';
import {
    getBeaconDataIos,
    getBeaconDataAndroid,
    stopGetBeacons,
    getLocationDataByBeacon,
    fetchBeaconKeys,
    login
} from "../../store/actions/index"
import { connect } from "react-redux";
import { BluetoothStatus } from 'react-native-bluetooth-status';
import { H1 } from 'native-base';

class HomeAdmin extends React.Component {
    state = {
        region: {
            identifier: "restaurantBeacon",
            uuid: "7005c5dc-4bc2-4164-b1ed-fc10fbb5c6af"
        }
    }
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <H1 style={styles.logo}>FeedInApp</H1>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        flex: 1,
        textAlign: 'center',
        width: "100%",
        textAlignVertical: "center",
        alignSelf: "center",
        fontSize: 50,
        color: "#4bac61",
        fontWeight: "900"
    }
});
const mapStateToProps = state => {
    return {
        restaurants: state.restaurant
    };
};
const mapDispatchToProps = dispatch => {
    return {
        onLoadBeaconsAndroid: region => dispatch(getBeaconDataAndroid(region)),
        onLoadBeaconsIos: region => dispatch(getBeaconDataIos(region)),
        stopLoadBeacons: region => dispatch(stopGetBeacons(region)),
        onLoadLocation: () => dispatch(getLocationDataByBeacon()),
        onFetchBeaconKeys: beaconData => dispatch(fetchBeaconKeys(beaconData)),
        onLogin: () => dispatch(login())
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeAdmin);

