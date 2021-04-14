import React from "react";
import {
    H1,
    H2,
    Text,
    Content,
    Grid,
    Col,
    Row,
    Card,
    CardItem,
    Left,
    Thumbnail,
    Body,
    Button
} from 'native-base';
import {
    StyleSheet,
    TouchableOpacity,
    Platform,
    NativeModules,
    Image,
    Linking
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import moment from 'moment';
import "moment/locale/it";
import { Navigation } from "react-native-navigation";


const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;


showImage = (image) => {
    Navigation.push("MyStack", {
        component: {
            name: 'RNFirebaseStarter.ImageView',
            passProps: {
                image: image
            },
            options: {
                animations: {
                    push: {
                        enabled: false
                    }
                }
            }
        }
    })
}

const primaryTab = props => {
    var fb = props.restaurant.facebook ?
        (<Col style={styles.col}>
            <TouchableOpacity onPress={() => { Linking.openURL(props.restaurant.facebook) }}>
                <Icon
                    name="facebook-f"
                    style={styles.infoIcon}
                />
                <Text style={styles.textIcon}>Facebook</Text>
            </TouchableOpacity >
        </Col>) : null;

    var ig = props.restaurant.instagram ?
        (<Col style={styles.col}>
            <TouchableOpacity onPress={() => { Linking.openURL(props.restaurant.instagram) }}>
                <Icon
                    name="instagram"
                    style={styles.infoIcon}
                />
                <Text style={styles.textIcon}>Instagram</Text>
            </TouchableOpacity>
        </Col>) : null;

    var website = props.restaurant.website ?
        (<Col style={styles.col}>
            <TouchableOpacity onPress={() => { Linking.openURL(props.restaurant.website) }}>
                <Icon
                    name="laptop"
                    style={styles.infoIcon}
                />
                <Text style={styles.textIcon}>Sito Web</Text>
            </TouchableOpacity >
        </Col>) : null;

    var info = props.restaurant.info ?
        (
            <Row>
                <Icon
                    name="md-information-circle"
                    style={styles.lidlIcon}
                />
                <Text style={styles.infoText}>{props.restaurant.info}</Text>
            </Row >
        ) : null;

    let posts = [];
    let response = props.posts;


    if (response) {
        let item = null;
        for (let key in response) {
            if (response[key].image) {
                posts.push(
                    <TouchableOpacity onPress={() => showImage(response[key].image)}>
                        <Card style={styles.card} pointerEvents="none">
                            <CardItem >
                                <Left>
                                    <Thumbnail small source={{ uri: props.restaurant.icon }} />
                                    <Body>
                                        <Text>{props.restaurant.name}</Text>
                                        <Text note>{moment(new Date(response[key].data)).fromNow()}</Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Image source={{ uri: response[key].image }} style={{ width: "100%", height: 200, flex: 1 }} />
                                    {response[key].text !== "" ? (<Text>{response[key].text}</Text>) : null}
                                </Body>
                            </CardItem>
                        </Card >
                    </TouchableOpacity>
                )
            }
            else {
                posts.push(
                    <Card style={styles.card} pointerEvents="none">
                        <CardItem >
                            <Left>
                                <Thumbnail small source={{ uri: props.restaurant.icon }} />
                                <Body>
                                    <Text>{props.restaurant.name}</Text>
                                    <Text note>{moment(new Date(response[key].data)).fromNow()}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                {response[key].text !== "" ? (<Text>{response[key].text}</Text>) : null}
                            </Body>
                        </CardItem>
                    </Card >
                )
            }
        }
    }


    return (
        <Content >
            <Image style={props.restaurant.cover ?
                styles.showImage :
                styles.hideImage}
                source={{ uri: props.restaurant.cover }}
            />
            <H1 style={styles.title}>{props.restaurant.name}</H1>
            <H2 style={styles.description}>{props.restaurant.description}</H2>
            <Row style={styles.row1}>
                <Icon
                    name="map-marker-alt"
                    style={styles.lidlIcon}
                />
                <Text style={styles.infoText}>{props.restaurant.address.street} {props.restaurant.address.streetNumber} - {props.restaurant.address.city} ({props.restaurant.address.province})</Text>
            </Row>
            <Content style={styles.iconContainer}>
                <Grid>
                    <Row>
                        <Col style={styles.col}>
                            <TouchableOpacity onPress={() => { Linking.openURL('tel:' + props.restaurant.phone) }}>
                                <Icon
                                    name="phone"
                                    style={styles.infoIcon}
                                />
                                <Text style={styles.textIcon}>Chiama</Text>
                            </TouchableOpacity>
                        </Col>

                        {fb}
                        {ig}
                        {website}
                        <Col style={styles.col}>
                            <TouchableOpacity onPress={() => props.openModal()}>
                                <Icon
                                    name="store"
                                    style={styles.infoIcon}
                                />
                                <Text style={styles.textIcon}>Orario</Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    <Row>{info}</Row>
                </Grid>
            </Content>
            <Content style={styles.cardContainer}>
                {posts}
            </Content>
        </Content>
    )
};

const styles = StyleSheet.create({
    name: {
        fontSize: 17
    },
    title: {
        fontWeight: "bold",
        fontSize: 30,
        paddingTop: 14,
        paddingLeft: 14

    },
    description: {
        fontWeight: "600",
        fontSize: 16,
        paddingTop: 0,
        paddingRight: 14,
        color: "#999",
        paddingLeft: 14
    },
    showImage: {
        width: "100%",
        height: 200,
        marginBottom: 14
    },
    hideImage: {
        width: 0,
        height: 0
    },
    freccia: {
        fontSize: 24,
        color: "#fff"
    },
    infoIcon: {
        marginTop: 20,
        fontSize: 30,
        color: "#ccc",
        opacity: 0.8,
        backgroundColor: "#fff"
    },
    lidlIcon: {
        paddingLeft: 14,
        marginTop: 4,
        fontSize: 20,
        color: "#ccc",
        opacity: 0.8,
        backgroundColor: "#fff"
    },
    iconContainer: {

    },
    col: {
        alignItems: 'center',

    },
    textIcon: {
        fontSize: 12,
        fontWeight: "normal",
        alignSelf: "center",
        color: "#ccc"
    },
    infoText: {
        paddingLeft: 5,
        paddingTop: 5,
        fontSize: 14,
        color: "#ccc",
        fontWeight: "normal"
    },
    card: {
        borderRadius: 3,
        flex: 0,
        width: "96%",
        alignSelf: "center",
        //marginTop: 40
    },
    cardContainer: {
        marginTop: 60,
        marginBottom: 80
    }
});

export default primaryTab;