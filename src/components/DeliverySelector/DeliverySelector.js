import React from "react";
import { StyleSheet, View, Image, Dimensions, Platform } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Modal from "react-native-modal";
import {
    Text,
    Button,
    Icon,
    Content,
    H1
} from 'native-base';
import ExtraDimensions from 'react-native-extra-dimensions-android';

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Platform.OS === "ios"
    ? Dimensions.get("window").height
    : ExtraDimensions.getRealWindowHeight();

const deliverySelector = props => {
    return (
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
            swipeDirection={['down']}
            style={styles.bottomModal}
            //hideModalContentWhileAnimating ={true}
            backdropTransitionOutTiming={0}
        >
            <View style={styles.content}>
                <H1 style={styles.title}>Cosa vuoi fare?</H1>
                <View style={styles.buttons}>
                <Button style={styles.button} onPress={() => props.delivery()} >
                    <Text>Delivery</Text>
                </Button>
                <Button style={styles.button} onPress={() => props.takeAway()} >
                    <Text>Take Away</Text>
                </Button>
                </View>
            </View>
        </Modal>
    );
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
        alignSelf: "center",
        backgroundColor: "#855E2D",
        margin: 10,
        padding: 30
    },
    buttons: {
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between"
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
        paddingTop: 12,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: 30,
        fontWeight: "600",
        margin: 12,
        marginBottom: 100
    }
});

export default deliverySelector;