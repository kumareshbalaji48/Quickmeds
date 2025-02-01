import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { IconButton, Appbar, useTheme } from 'react-native-paper';
import { GoogleGenerativeAI } from "@google/generative-ai";
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const genAI = new GoogleGenerativeAI("AIzaSyACMtNwHUMbGt_SoTuttjcQ7K0RSyxFTIM");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const COLORS = {
    primary: "#020E22",
    white: "#FFFFFF",
    gray: "#2A2A2A",
    blue: "#4F73DF",
    green: "#157A6E",
    red: "#B53737",
    accent: "#0FEDED",
    cardBlue: "#293C7A",
    cardGreen: "#084C2E",
    cardRed: "#7A271A",
    cardOrange: "#772917",
    lightGray: "#1E2D44",
    transparentWhite: "rgba(255, 255, 255, 0.7)",
  };


const Assistant = ({ route, navigation }) => {
    const { summary } = route.params;
    const [messages, setMessages] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: ` Medical Summary :\n\n${summary}\n\nFeel free to ask any questions !\nStay updated on your Health...`,
                createdAt: new Date(),
                user: { _id: 2, name: 'MedAI Assistant' },
            },
        ]);
    }, []);

    const sendMessageToGemini = async (message) => {
        try {
            const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: message }] }] });
            return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that. Try again!";
        } catch (error) {
            console.error("Error:", error);
            return "⚠️ Error processing request. Please try again!";
        }
    };

    const handleSend = useCallback(async (messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const userMessage = messages[0].text;
        const botResponse = await sendMessageToGemini(userMessage);
        
        setMessages(previousMessages => GiftedChat.append(previousMessages, [{
            _id: Math.random().toString(),
            text: botResponse,
            createdAt: new Date(),
            user: { _id: 2, name: 'MedAI Assistant' },
        }]));
    }, []);

    const renderBubble = (props) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#5E8BFF',
                    padding: 14,
                    borderRadius: 16,
                    maxWidth: '90%',
                },
                left: {
                    backgroundColor: '#FFFFFF',
                    padding: 12,
                    borderRadius: 16,
                    maxWidth: '90%',
                }
            }}
            textStyle={{
                right: { color: 'white', fontSize: 16 },
                left: { color: '#2D2D2D', fontSize: 16 },
            }}
        />
    );

    const renderInputToolbar = (props) => (
        <InputToolbar
            {...props}
            containerStyle={styles.inputToolbar}
            primaryStyle={{ alignItems: 'center' }}
        />
    );

    const renderSend = (props) => (
        <View style={styles.sendContainer}>
            <IconButton
                icon="send"
                size={22} 
                iconColor="white"
                style={styles.sendButton}
                onPress={() => {
                    if (props.text?.trim()) {
                        props.onSend({ text: props.text.trim() }, true);
                    }
                }}
            />
        </View>
    );

    return (
        <LinearGradient colors={['#F5F9FF', '#E6F0FF']} style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <Appbar.Header style={styles.header}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} color="#2D2D2D" />
                    <Appbar.Content title="MedAI Assistant" titleStyle={styles.title} />
                    <Appbar.Action icon="robot-happy" color="#5E8BFF" />
                </Appbar.Header>

                <View style={styles.chatContainer}>
                    <GiftedChat
                        messages={messages}
                        onSend={handleSend}
                        user={{ _id: 1 }}
                        renderBubble={renderBubble}
                        renderSend={renderSend}
                        renderInputToolbar={renderInputToolbar}
                        textInputProps={{
                            style: styles.input,
                            underlineColorAndroid: 'transparent',
                            placeholderTextColor: '#9AA8BC',
                            placeholder: "Ask your Quieres...",
                        }}
                        alwaysShowSend
                        minInputToolbarHeight={60} 
                        keyboardShouldPersistTaps="handled"
                        listViewProps={{ 
                            style: styles.chatList,
                            keyboardDismissMode: 'on-drag',
                            keyboardShouldPersistTaps: 'handled'
                        }}
                        bottomOffset={Platform.select({
                            ios: 0,
                            android: 0
                        })}
                        inverted={true}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: COLORS.transparentWhite,
        elevation: 0,
    },
    title: {
        color: COLORS.primary,
        fontSize: 21,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    chatContainer: {
        flex: 1,
        marginHorizontal: 4, 
    },
    chatList: {
        paddingHorizontal: 4, 
    },
    inputToolbar: {
        backgroundColor: 'white',
        borderTopWidth: 0,
        borderRadius: 20,
        marginHorizontal: 4, 
        marginBottom: 8,
        paddingHorizontal: 8, 
        elevation: 4,
        shadowColor: '#5E8BFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    input: {
        color: '#2D2D2D',
        fontSize: 16,
        paddingVertical: 8, 
        paddingHorizontal: 15, 
        flex: 1,
        marginRight: 3, 
        backgroundColor: '#F5F8FF',
        borderRadius: 16,
    },
    sendContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        marginRight: 4, 
    },
    sendButton: {
        backgroundColor: '#5E8BFF',
        borderRadius: 16, 
        width: 40, 
        height: 40, 
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Assistant;