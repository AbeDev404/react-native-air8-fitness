import React, {useState, useEffect} from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native'

import Colors from '../assets/styles/colors';
import GlobalStyle from '../assets/styles/global.style';

const EditText = (props) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        setValue(props.value);
    }, [props])

    const onChangeText = (e) => props.onChange && (props.onChange(e))
    const onSubmitEditing = (e) => { props.searchSubmit && (setValue(value => props.erase ? '' : value), props.searchSubmit(e)) }
    const inputMode = (e) => (props.inputMode && props.inputMode !== 'password') ? props.inputMode : 'text'
    
    return (
        <View style={[GlobalStyle.round, props.style, styles.container, GlobalStyle.flex('row', 'flex-start', 'center')]}>
            { props.icon && (<Image style={[styles.icon]} source={props.icon} />) }
            <TextInput editable={props.editable} value={value} onChangeText={onChangeText} onSubmitEditing={onSubmitEditing} multiline={props.multiline} placeholder={props.placeholder} placeholderTextColor={Colors.secondaryText} style={[GlobalStyle.Manjari, styles.textinput]} secureTextEntry={props.inputMode === 'password'} inputMode={inputMode} />
        </View>
    )
}

const styles = new StyleSheet.create({
    container: {
        backgroundColor: Colors.BGlight,
        width: '100%',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 20,
        paddingRight: 20,
    },
    textinput: {
        color: Colors.DarkGreen,
        fontSize: GlobalStyle.SCREEN_WIDTH / 30,
        paddingRight: 30,
        width: '100%'
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 10,
    }
});

EditText.defaultProps = {
    icon: null,
    placeholder: '',
    inputMode: 'text',
    multiline: false,
    style: {},
    searchSubmit: null,
    erase: true,
    editable: true,
}

export default EditText