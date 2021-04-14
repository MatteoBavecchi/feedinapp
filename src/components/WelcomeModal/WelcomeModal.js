import React from "react";
import { StyleSheet, View, Image, Dimensions, Platform, NativeModules } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Modal from "react-native-modal";
import {
    Text,
    Button,
} from 'native-base';
import ExtraDimensions from 'react-native-extra-dimensions-android';

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Platform.OS === "ios"
    ? Dimensions.get("window").height
    : ExtraDimensions.getRealWindowHeight();

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;

const welcomeModal = props => {
    if (props.text || props.title || props.image) {
        return (
            <Modal
                animationInTiming={350}
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                isVisible={props.isModalVisible}
                onBackdropPress={() => props.toggleModal()}
                onSwipeComplete={() => props.toggleModal()}
                swipeDirection={['left', 'right']}
                backdropTransitionOutTiming={0}
            >
                <View style={styles.content}>
                    <View style={styles.itemContent}>
                        <Text style={styles.name}>{props.title}</Text>
                        <Text note style={styles.description}>{props.text}</Text>
                        {props.image ? (<Image style={styles.image}
                            source={{ uri: props.image }}
                        />) : null}
                    </View>
                    <Button style={styles.button} onPress={() => props.toggleModal()} >
                        <Text>{deviceLanguage == "it_IT" ? "Chiudi" : "Close"}</Text>
                    </Button>
                </View>
            </Modal>
        );
    }
    else {
        return (null)
    }
};

const styles = StyleSheet.create({
    itemContent: {
        paddingLeft: 22,
        paddingRight: 22,
        paddingTop: 10
    },
    name: {
        fontSize: 26,
        fontWeight: "bold",
    },
    description: {
        fontSize: 20,
    },
    button: {
        marginTop: 30,
        alignSelf: "center",
        backgroundColor: "#855E2D"
    },
    vegetarian: {
        color: "green"
    },
    image: {

        //alignSelf: "center",
        width: "100%",
        height: 200,
        marginBottom: 14
    },

    content: {
        backgroundColor: 'white',
        paddingBottom: 22,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    hideImage: {
        width: 0,
        height: 0
    },
    hideBio: {
        width: 0,
        height: 0
    },
    hideVegetarian: {
        width: 0,
        height: 0
    },
    hideVegan: {
        width: 0,
        height: 0
    },
    hideFrozen: {
        width: 0,
        height: 0
    },
    hideGlutenFree: {
        width: 0,
        height: 0
    },
    showBio: {
        fontSize: 13
    },
    showVegetarian: {
        fontSize: 13
    },
    showVegan: {
        fontSize: 13
    },
    showFrozen: {
        fontSize: 13
    },
    showGlutenFree: {
        fontSize: 13
    },
});

export default welcomeModal;