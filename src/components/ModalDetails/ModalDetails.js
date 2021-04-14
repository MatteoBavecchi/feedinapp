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


const tabellaAllergeni = {
    a1: deviceLanguage == "it_IT" ? "cereali" : "cereals",
    a2: deviceLanguage == "it_IT" ? "crostacei" : "shellfish",
    a3: deviceLanguage == "it_IT" ? "uova" : "eggs",
    a4: deviceLanguage == "it_IT" ? "pesce" : "fish",
    a5: deviceLanguage == "it_IT" ? "arachidi" : "peanuts",
    a6: deviceLanguage == "it_IT" ? "soia" : "soy",
    a7: deviceLanguage == "it_IT" ? "latte" : "milk",
    a8: deviceLanguage == "it_IT" ? "frutta" : "fruit",
    a9: deviceLanguage == "it_IT" ? "sedano" : "celery",
    a10: deviceLanguage == "it_IT" ? "senape" : "mustard",
    a11: deviceLanguage == "it_IT" ? "semi di sesamo" : "sesame seeds",
    a12: deviceLanguage == "it_IT" ? "anidride solforosa e solfiti" : "sulfur dioxide and sulphites",
    a13: deviceLanguage == "it_IT" ? "lupini" : "lupins",
    a14: deviceLanguage == "it_IT" ? "molluschi" : "clams"
}

const modalDetails = props => {
    let allergeni = "";
    if (props.itemSelected) {
        if (props.itemSelected.allergeni) {
            allergeni += deviceLanguage == "it_IT" ? "Allergeni: " : "Allergens: ";
            for (let key in props.itemSelected.allergeni) {
                if (props.itemSelected.allergeni[key]) {
                    allergeni += tabellaAllergeni[key] + ", "
                }
            }
        }
        let veganIcon = props.itemSelected.vegan ? (
            <Text note style={styles.showVegan}>
                <FontAwesome5
                    name="seedling"
                    style={styles.iconVegetarian}
                />: {deviceLanguage == "it_IT" ? "Vegano" : "Vegan"}
            </Text>
        ) : (null);
        let vegetarianIcon = props.itemSelected.vegetarian ? (
            <Text note style={styles.showVegetarian}>
                <FontAwesome5
                    name="seedling"
                    style={styles.iconVegetarian}
                />: {deviceLanguage == "it_IT" ? "Vegetariano" : "Vegetarian"}
            </Text>
        ) : (null);
        let frozenIcon = props.itemSelected.frozen ? (
            <Text note style={styles.showFrozen}>
                <FontAwesome5
                    name="snowflake"
                    style={styles.iconFrozen}
                />: {deviceLanguage == "it_IT" ? "Surgelato" : "Frozen"}
            </Text>
        ) : (null);
        let bioIcon = props.itemSelected.bio ? (
            <Text note style={styles.showBio}>
                <FontAwesome5
                    name="leaf"
                    style={styles.iconBio}
                />: {deviceLanguage == "it_IT" ? "Biologico" : "Organic"}
            </Text>
        ) : (null);
        let glutenFreeIcon = props.itemSelected.glutenFree ? (
            <Text note style={styles.showGlutenFree}>
                <FontAwesome5
                    name="ban"
                    style={styles.iconGlutenFree}
                />: {deviceLanguage == "it_IT" ? "Senza glutine" : "Gluten free"}
            </Text>
        ) : (null);

        let image = null;
        if (props.itemSelected.image) {
            image = (<Image style={props.itemSelected.image ?
                styles.showImage :
                styles.hideImage}
                source={{ uri: props.itemSelected.image }}
            />);
        }

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
                onSwipeComplete={() => props.toggleModal()}
                swipeDirection={['down']}
                style={styles.bottomModal}
                //hideModalContentWhileAnimating ={true}
                backdropTransitionOutTiming={0}
            >
                <View style={styles.content}>
                    {image}
                    <View style={styles.itemContent}>
                        <Text style={styles.name}>{deviceLanguage == "it_IT" ?
                            props.itemSelected.name :
                            props.itemSelected.nameEN ?
                                props.itemSelected.nameEN :
                                props.itemSelected.name}</Text>
                        <Text note style={styles.description}>{deviceLanguage == "it_IT" ?
                            props.itemSelected.description :
                            props.itemSelected.descriptionEN ?
                                props.itemSelected.descriptionEN :
                                props.itemSelected.description}</Text>
                        <Text note style={styles.price}>{
                            props.itemSelected.price === "" ||
                                props.itemSelected.price === "0" ?
                                null :
                                props.itemSelected.price + "€"}</Text>
                        {vegetarianIcon}
                        {veganIcon}
                        {bioIcon}
                        {frozenIcon}
                        {glutenFreeIcon}
                        <Text note style={styles.allergeni}>{allergeni}</Text>
                    </View>
                    <Button style={styles.button} onPress={() => props.toggleModal()} >
                        <Text>{deviceLanguage == "it_IT" ? "Chiudi" : "Close"}</Text>
                    </Button>
                </View>
            </Modal>
        );
    }
    else {
        return null;
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
        marginBottom: 14,
        borderRadius: 4
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

export default modalDetails;