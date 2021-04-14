import React from "react";
import { StyleSheet, View, Image, Dimensions, Platform, ScrollView } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Modal from "react-native-modal";
import {
    Text,
    Button,
    Icon,
    Content,
    H1,
    H2
} from 'native-base';
import ExtraDimensions from 'react-native-extra-dimensions-android';

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Platform.OS === "ios"
    ? Dimensions.get("window").height
    : ExtraDimensions.getRealWindowHeight();

const modalTakeAway = props => {
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
                <H1 style={styles.title}>Ordinazione da asporto</H1>
                <H2 style={styles.timeTitle}>Ora del ritiro:</H2>
                <ScrollView horizontal={true} style={styles.buttons}>
                    <Button style={styles.button} onPress={() => props.takeAway()} >
                        <Text>17:00</Text>
                    </Button>
                    <Button style={styles.button} onPress={() => props.takeAway()} >
                        <Text>17:30</Text>
                    </Button>
                    <Button style={styles.button} onPress={() => props.takeAway()} >
                        <Text>18:00</Text>
                    </Button>
                    <Button style={styles.button} onPress={() => props.takeAway()} >
                        <Text>18:30</Text>
                    </Button>
                    <Button style={styles.button} onPress={() => props.takeAway()} >
                        <Text>19:00</Text>
                    </Button>
                    <Button style={styles.button} onPress={() => props.takeAway()} >
                        <Text>19:30</Text>
                    </Button>
                </ScrollView>
                <H2 style={styles.timeTitle}>Nome e cognome</H2>
                <H2 style={styles.timeTitle}>Tel.</H2>
                <View style={styles.buttons}>
                    <Button style={styles.footerButton} onPress={() => props.takeAway()} >
                        <Text>Annulla</Text>
                    </Button>
                    <Button style={styles.footerButton} onPress={() => props.takeAway()} >
                        <Text>Avanti</Text>
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
        backgroundColor: "#3A854C",
        margin: 10,
        padding: 30
    },
    footerButton: {
        alignSelf: "center",
        backgroundColor: "#3A854C",
        margin: 10,
        padding: 30
    },
    buttons: {
        flexDirection: "row",
        alignSelf: "center",

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
        marginBottom: 60
    },
    timeTitle: {
        fontSize: 24,
        fontWeight: "600",
        margin: 12,
        marginBottom: 30

    }
});

export default modalTakeAway;