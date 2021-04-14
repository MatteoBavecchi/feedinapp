import React from "react";
import {
    View, StyleSheet, Platform, NativeModules, SafeAreaView,
    Text, Modal
} from 'react-native';

import { Header, Left, Right, Body, Title, Button } from "native-base"

import { Navigation } from 'react-native-navigation';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/FontAwesome5';
class ImageView extends React.Component {

    static get options() {
        return {
            topBar: {
                visible: false,
                animate: false,
                height: 0,
            }
        };
    }
    constructor(props) {
        super(props);
    }

    handleBackButton = () => {
        Navigation.pop(this.props.componentId);
    }
    render() {
        const images = [
            {
                url:
                   this.props.image,
            },
        ];
        return (
            <Modal visible={true} transparent={true}>
                <Header style={{ backgroundColor: "#4bac61" }}
                    androidStatusBarColor={"#357844"} hasTabs>
                    <Left>
                        <Button transparent onPress={() => this.handleBackButton()}>
                            <Icon style={styles.drawerIcon} name='arrow-left' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 3 }}>

                    </Body>

                </Header>

                <ImageViewer imageUrls={images} />
            </Modal>
        );
    }
};



const styles = StyleSheet.create({
    drawerIcon: {
        color: "#FFFFFF",
        fontSize: 28
    },
    tabs: {
        backgroundColor: "#FFFFFF"
    },
    title: {
        fontWeight: "500",
        fontSize: 22,
        alignSelf: "center",
        color: "#FFFFFF"
    },
    button: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "500"
    },
    infoIcon: {
        color: "#fff",
        fontSize: 20
    },
    location: {
        fontWeight: "400",
        fontSize: 16,
        color: "#ffc107",
        //alignSelf: "center",
        borderColor: "#ffc107",
        borderWidth: 1.5,
        borderRadius: 3
    }
});

export default ImageView;