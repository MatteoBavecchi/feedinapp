import React from "react";
import { StyleSheet, View, Image, Dimensions, Platform, NativeModules, FlatList } from "react-native";
import Modal from "react-native-modal";
import {
    Text,
    Button,
    H1,
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




const modalOpenHours = props => {
    let item = props.item;

    let week = deviceLanguage == "it_IT" ?
        ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdi", "Sabato", "Domenica"] :
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return item ? (
        <Modal
            //backdropColor="#CECECE"
            //backdropOpacity={0.9}
            animationInTiming={350}
            //backdropTransitionInTiming={500}
            //backdropTransitionOutTiming={500}
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}
            isVisible={props.isModalVisible}
            onBackdropPress={() => props.toggleModal()}
            onSwipeComplete={() => props.toggleModal()}
            swipeDirection={['down']}
            style={styles.bottomModal}
            //hideModalContentWhileAnimating ={true}
            backdropTransitionOutTiming={0}
        >
            <View style={styles.content}>
                <View style={styles.itemContent}>
                    <H1 style={styles.name}>Orari di apertura</H1>
                    {item.mon ? (<Text style={styles.name}>{week[0]}:{"  "}
                        <Text style={styles.description}>{item.mon + "  "}
                        </Text></Text>) : null}
                    {item.tue ? (<Text style={styles.name}>{week[1]}:{"  "}
                        <Text style={styles.description}>{item.tue + "  "}
                        </Text></Text>) : null}
                    {item.wed ? (<Text style={styles.name}>{week[2]}:{"  "}
                        <Text style={styles.description}>{item.wed + "  "}
                        </Text></Text>) : null}
                    {item.thu ? (<Text style={styles.name}>{week[3]}:{"  "}
                        <Text style={styles.description}>{item.thu + "  "}
                        </Text></Text>) : null}
                    {item.fri ? (<Text style={styles.name}>{week[4]}:{"  "}
                        <Text style={styles.description}>{item.fri + "  "}
                        </Text></Text>) : null}
                    {item.sat ? (<Text style={styles.name}>{week[5]}:{"  "}
                        <Text style={styles.description}>{item.sat + "  "}
                        </Text></Text>) : null}
                    {item.sun ? (<Text style={styles.name}>{week[6]}:{"  "}
                        <Text style={styles.description}>{item.sun + "  "}
                        </Text></Text>) : null}
                </View>
                <Button style={styles.button} onPress={() => props.toggleModal()} >
                    <Text>{deviceLanguage == "it_IT" ? "Chiudi" : "Close"}</Text>
                </Button>
            </View>
        </Modal>
    ) : (<Modal
        //backdropColor="#CECECE"
        //backdropOpacity={0.9}
        animationInTiming={350}
        //backdropTransitionInTiming={500}
        //backdropTransitionOutTiming={500}
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
        isVisible={props.isModalVisible}
        onBackdropPress={() => props.toggleModal()}
        onSwipeComplete={() => props.toggleModal()}
        swipeDirection={['down']}
        style={styles.bottomModal}
        //hideModalContentWhileAnimating ={true}
        backdropTransitionOutTiming={0}
    >
        <View style={styles.content}>
            <View style={styles.itemContent}>
                <H1 style={styles.name}>Orari di apertura</H1>
                <Text>Nessun orario di apertura indicato</Text>
            </View>
            <Button style={styles.button} onPress={() => props.toggleModal()} >
                <Text>{deviceLanguage == "it_IT" ? "Chiudi" : "Close"}</Text>
            </Button>
        </View>
    </Modal>)
};

const styles = StyleSheet.create({
    itemContent: {
        paddingLeft: 22,
        paddingRight: 22,
        paddingTop: 10
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",

    },
    description: {

        fontSize: 20,
    },
    price: {
        fontSize: 18,
        paddingBottom: 20
    },
    iconGlutenFree: {
        fontSize: 14,
        color: "#D17F00"
    },

    iconBio: {
        fontSize: 14,
        color: "#5CD177"
    },

    iconFrozen: {
        fontSize: 14,
        color: "#3BB8C3",
        paddingLeft: 5,
        paddingRight: 5
    },

    iconVegetarian: {
        fontSize: 14,
        color: "#3A854C"
    },
    button: {
        marginTop: 30,
        alignSelf: "center",
        backgroundColor: "#855E2D"
    },
    vegetarian: {
        color: "green"
    },
    showImage: {

        //alignSelf: "center",
        width: "100%",
        height: 200,
        marginBottom: 14
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
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

export default modalOpenHours;