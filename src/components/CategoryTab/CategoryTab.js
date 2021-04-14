import React from "react";
import NumericInput from 'react-native-numeric-input'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
    H1,
    H2,
    ListItem,
    Body,
    Right,
    Text,
    Content,
    Icon
} from 'native-base';
import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Platform,
    NativeModules,
    Image
} from 'react-native';
import {Navigation} from "react-native-navigation";

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

const categoryTab = props => {
    let image = null;
    if (props.category.image) {
        image = (
            <TouchableOpacity onPress={() => showImage(props.category.image)}>
                <Image style={styles.image}
                    source={{ uri: props.category.image }}
                />
            </TouchableOpacity>
        )
    }
    return (
        <Content>

            <H1 style={styles.title}>{deviceLanguage == "it_IT" ?
                props.category.name :
                props.category.nameEN ?
                    props.category.nameEN :
                    props.category.name}</H1>

            {props.category.description ? (<H2 style={styles.subTitle}>{deviceLanguage == "it_IT" ?
                props.category.description :
                props.category.descriptionEN ?
                    props.category.descriptionEN :
                    props.category.description}</H2>)
                : null
            }
            {image}
            <FlatList
                style={styles.flatList}
                data={props.menu}
                keyExtractor={item => item.itemKey}
                renderItem={item => {
                    let orders = props.orders;
                    let parsedRes = orders.find(parsedItem => {
                        return parsedItem.itemKey === item.item.itemKey
                    });
                    let number = parsedRes ? parsedRes.quantity : 0;
                    let veganIcon = item.item.vegan || item.item.vegetarian ? (
                        <FontAwesome5
                            name="seedling"
                            style={styles.showVegetarian}
                        />
                    ) : (null);
                    let frozenIcon = item.item.frozen ? (
                        <FontAwesome5
                            name="snowflake"
                            style={styles.showFrozen}
                        />
                    ) : (null);
                    let bioIcon = item.item.bio ? (
                        <FontAwesome5
                            name="leaf"
                            style={styles.showBio}
                        />
                    ) : (null);
                    let glutenFreeIcon = item.item.glutenFree ? (
                        <FontAwesome5
                            name="ban"
                            style={styles.showGlutenFree}
                        />
                    ) : (null);

                    let itemDescription = "";
                    let itemDescriptionEN = "";
                    if (item.item.description.length > 35) {
                        itemDescription = item.item.description.substring(0, 35) + "...";
                    }
                    else {
                        itemDescription = item.item.description;
                    }
                    if (item.item.descriptionEN.length > 35) {
                        itemDescriptionEN = item.item.descriptionEN.substring(0, 35) + "...";
                    }
                    else {
                        itemDescriptionEN = item.item.descriptionEN;
                    }

                    let body = (<Body>
                        <TouchableOpacity onPress={() => props.openModal(item.item)}>
                            <Text style={styles.name}>{deviceLanguage == "it_IT" ?
                                item.item.name + "  " :
                                item.item.nameEN + "  " ?
                                    item.item.nameEN + "  " :
                                    item.item.name + "  "}
                                {veganIcon}
                                {bioIcon}
                                {frozenIcon}
                                {glutenFreeIcon}
                            </Text>
                            <Text note>{deviceLanguage == "it_IT" ?
                                itemDescription :
                                item.item.descriptionEN ?
                                    itemDescriptionEN :
                                    itemDescription}</Text>
                        </TouchableOpacity>
                    </Body>);

                    if (item.item.available) {
                        if (props.numericPickerVisible) {
                            if (number === 0) {
                                return (
                                    <ListItem style={styles.listItem}>
                                        {body}
                                        <Right>
                                            <Text note style={styles.price}>{item.item.price === "" ||
                                                item.item.price === "0" ?
                                                null :
                                                item.item.price + "€"
                                            }</Text>
                                            {item.item.orderable ? (
                                                <TouchableOpacity onPress={() => props.onChangeOrder(item.item.itemKey, 1)}>
                                                    <Icon
                                                        type="FontAwesome"
                                                        name="plus-circle"
                                                        style={styles.plusIcon}
                                                    />
                                                </TouchableOpacity>) : null}
                                        </Right>
                                    </ListItem>
                                );
                            }
                            else {
                                return (
                                    <ListItem style={styles.listItem}>
                                        {body}
                                        <Right>
                                            <Text note style={styles.price}>{item.item.price === "" ||
                                                item.item.price === "0" ?
                                                null :
                                                item.item.price + "€"
                                            }</Text>
                                            <NumericInput
                                                value={number}
                                                onChange={value => props.onChangeOrder(item.item.itemKey, value)}
                                                separatorWidth={0}
                                                inputStyle={{ fontSize: 18 }}
                                                borderColor="#FFFFFF"
                                                rounded
                                                totalWidth={80}
                                                totalHeight={30}
                                                iconSize={30}
                                                minValue={0}
                                                valueType="integer"
                                                editable={false}
                                                textColor="#51B869"
                                                iconStyle={{ color: "#FFFFFF", fontSize: 18 }}
                                                rightButtonBackgroundColor="#51B869"
                                                leftButtonBackgroundColor="#51B869" />
                                        </Right>
                                    </ListItem>
                                );
                            }
                        }
                        else {
                            return (
                                <ListItem style={styles.listItem}>
                                    {body}
                                    <Right>
                                        <Text note style={styles.price}>{item.item.price === "" ||
                                            item.item.price === "0" ?
                                            null :
                                            item.item.price + "€"
                                        }</Text>
                                    </Right>
                                </ListItem>
                            );
                        }
                    }
                    else {
                        if (props.numericPickerVisible) {
                            return (
                                <ListItem style={styles.listItemDisabled}>
                                    {body}
                                    <Right>
                                        <Text note style={styles.price}>{item.item.price === "" ||
                                            item.item.price === "0" ?
                                            null :
                                            item.item.price + "€"
                                        }</Text>
                                        {item.item.orderable ? (
                                            <Icon
                                                type="FontAwesome"
                                                name="plus-circle"
                                                style={styles.plusIcon}
                                            />) : null}
                                    </Right>
                                </ListItem>
                            );
                        }
                        else {
                            return (
                                <ListItem style={styles.listItemDisabled}>
                                    {body}
                                    <Right>
                                        <Text note style={styles.price}>{item.item.price === "" ||
                                            item.item.price === "0" ?
                                            null :
                                            item.item.price + "€"
                                        }</Text>
                                    </Right>
                                </ListItem>
                            );
                        }
                    }
                }}
            />
        </Content>)

};


const styles = StyleSheet.create({
    name: {
        fontSize: 17
    },
    showGlutenFree: {
        fontSize: 16,
        color: "#D17F00"
    },
    hideGlutenFree: {
        fontSize: 0
    },
    showBio: {
        fontSize: 16,
        color: "#5CD177"
    },
    hideBio: {
        fontSize: 0
    },
    showFrozen: {
        fontSize: 16,
        color: "#3BB8C3",
        paddingLeft: 5,
        paddingRight: 5
    },
    hideFrozen: {
        fontSize: 0
    },
    showVegetarian: {
        fontSize: 16,
        color: "#3A854C"
    },
    hideVegetarian: {
        fontSize: 0
    },
    price: {
        fontSize: 15
    },
    plusIcon: {
        color: "#51B869",
        fontSize: 26,
        marginTop: 3
    },
    listItem: {
        alignSelf: "center",
        width: "96%",
        marginLeft: 0,
        marginRight: 0
    },
    listItemDisabled: {
        alignSelf: "center",
        width: "96%",
        marginLeft: 0,
        marginRight: 0,
        opacity: 0.3
    },
    flatList: {
        marginBottom: 50
    },
    title: {
        fontWeight: "bold",
        fontSize: 28,
        padding: 14
    },
    subTitle: {
        fontWeight: "700",
        fontSize: 20,
        marginTop: -5,
        paddingTop: 0,
        paddingBottom: 14,
        paddingLeft: 14,
        paddingRight: 14,
        color: "#999"
    },
    image: {
        width: "100%",
        marginBottom: 26,
        height: 400
    }
});

export default categoryTab;