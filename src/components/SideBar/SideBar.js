import React, { Component } from 'react'
import {
    StyleSheet, TouchableOpacity, View, Image, Text, Linking
} from 'react-native'

//import Text from './form/Text'
import Icon from 'react-native-vector-icons/FontAwesome'
//import colors from './../resources/styles/colors'
import { H1 } from 'native-base';
import { Navigation } from "react-native-navigation";

const sideBar = () => {
    return (
        <View style={styles.sideMenu}>

            <View style={{ paddingLeft: 5, paddingRight: 40 }}>
                {this._renderHeader()}
                <TouchableOpacity onPress={() => { Linking.openURL('https://www.feedinapp.com/privacy.html') }}
                    style={styles.menu}>
                    <Icon name='eye' size={24} color={"#4bac61"} />
                    <Text style={styles.menuText} >Privacy Policy</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.footer}>Matteo Bavecchi - Tutti i diritti riservati</Text>
                </View>
            </View>
        </View>
    )
}

_renderHeader = () => {
    return (
        <View style={styles.header}>
            <View style={styles.userInfosHolder}>
                <View style={styles.userInfos}>
                    <H1 style={styles.username}>FeedInApp</H1>
                </View>

            </View>

        </View>
    )
}

goToLogin = () => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: 'RNFirebaseStarter.Login',
                            options: {
                                topBar: {
                                    visible: false,
                                    animate: false,
                                    height: 0,
                                }
                            }
                        },

                    },
                ]
            },
        },
    })
}

const styles = StyleSheet.create({
    sideMenu: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#FFFFFF',
        width: "100%",
        height: "100%"
    },
    sideMenuTitle: {
        marginLeft: 20,
        marginBottom: 30
    },
    menu: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        //backgroundColor: "#4bac61",
        //borderRadius: 8,
        marginBottom: 5,

    },
    menuText: {
        marginLeft: 20,
        color: "#4bac61",
        fontSize: 17
    },
    header: {
        marginTop: 20,
        marginBottom: 30
    },
    userInfosHolder: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    userInfos: {
        height: 50,
        justifyContent: 'center'
    },
    username: {
        fontWeight: '700',
        color: "#4bac61"
    },
    footer: {
        marginTop: 100
    }
})

export default sideBar;