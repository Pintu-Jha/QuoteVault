import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';

type ShareQuoteScreenProps = StackScreenProps<RootStackParamList, 'ShareQuote'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = CARD_WIDTH * 1.3;

export const ShareQuoteScreen: React.FC<ShareQuoteScreenProps> = ({ route, navigation }) => {
    const { quote } = route.params;
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const viewShotRef = useRef<any>(null);
    const [selectedTab, setSelectedTab] = useState('Gradient');
    const [selectedBgIndex, setSelectedBgIndex] = useState(0);

    const solidColors = ['#FFFFFF', '#000000', '#F5F5F5', '#1A1A1A'];
    const gradientColors = [
        { bg: '#B71626', text: '#FFFFFF', name: 'Passion Red' },
        { bg: '#1A3A2A', text: '#FFFFFF', name: 'Deep Green' },
        { bg: '#1B2631', text: '#FFFFFF', name: 'Midnight Blue' },
        { bg: '#4A235A', text: '#FFFFFF', name: 'Royal Purple' },
        { bg: '#D35400', text: '#FFFFFF', name: 'Sunset Orange' },
    ];

    const imageColors = ['#2C3E50', '#888888', '#34495E'];

    const getBackgroundStyle = () => {
        if (selectedTab === 'Minimal') {
            const color = solidColors[selectedBgIndex % solidColors.length];
            return { backgroundColor: color, textColor: color === '#FFFFFF' || color === '#F5F5F5' ? '#000000' : '#FFFFFF' };
        } else if (selectedTab === 'Gradient') {
            const style = gradientColors[selectedBgIndex % gradientColors.length];
            return { backgroundColor: style.bg, textColor: style.text };
        } else {
            const color = imageColors[selectedBgIndex % imageColors.length];
            return { backgroundColor: color, textColor: '#FFFFFF' };
        }
    };

    const currentStyle = getBackgroundStyle();

    const handleShare = async () => {
        try {
            if (viewShotRef.current?.capture) {
                const uri = await viewShotRef.current.capture();
                const options = {
                    title: 'Share Quote',
                    message: `"${quote.text}" - ${quote.author}`,
                    url: uri,
                    type: 'image/png',
                };
                await Share.open(options);
            }
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const handleSave = async () => {
        handleShare();
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 20) }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Icon name="close" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Share Preview</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="ellipsis-horizontal" size={24} color="#000000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.cardContainer}>
                    <ViewShot
                        ref={viewShotRef}
                        options={{ format: 'png', quality: 1.0 }}
                        style={[styles.card, { backgroundColor: currentStyle.backgroundColor }]}>

                        <Icon name="quote" size={40} color={currentStyle.textColor} style={{ opacity: 0.3, marginBottom: 20 }} />

                        <Text style={[styles.quoteText, { color: currentStyle.textColor }]}>
                            "{quote.text}"
                        </Text>

                        <View style={styles.divider} />

                        <Text style={[styles.authorText, { color: currentStyle.textColor }]}>
                            {quote.author.toUpperCase()}
                        </Text>

                        <Text style={[styles.watermark, { color: currentStyle.textColor }]}>
                            QUOTEVAULT
                        </Text>
                    </ViewShot>
                </View>

                <View style={styles.controlsContainer}>
                    <Text style={styles.sectionTitle}>BACKGROUND STYLE</Text>

                    <View style={styles.tabsContainer}>
                        {['Minimal', 'Gradient', 'Image'].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tab, selectedTab === tab && styles.activeTab]}
                                onPress={() => {
                                    setSelectedTab(tab);
                                    setSelectedBgIndex(0);
                                }}>
                                <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                        {(selectedTab === 'Minimal' ? solidColors : selectedTab === 'Gradient' ? gradientColors : imageColors).map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedBgIndex(index)}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: typeof item === 'string' ? item : item.bg },
                                    selectedBgIndex === index && styles.selectedColorOption
                                ]}
                            />
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
                        <Icon name="share-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={styles.primaryButtonText}>Share Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={handleSave}>
                        <Icon name="download-outline" size={20} color="#000000" style={{ marginRight: 8 }} />
                        <Text style={styles.secondaryButtonText}>Save to Device</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
    },
    iconButton: {
        padding: 8,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    cardContainer: {
        alignItems: 'center',
        marginVertical: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quoteText: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 34,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    divider: {
        width: 40,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginVertical: 30,
    },
    authorText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    watermark: {
        position: 'absolute',
        bottom: 30,
        opacity: 0.2,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
    },
    controlsContainer: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#888888',
        letterSpacing: 1,
        marginBottom: 16,
        marginTop: 10,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666666',
    },
    activeTabText: {
        color: '#000000',
        fontWeight: '600',
    },
    pickerScroll: {
        marginBottom: 32,
    },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: 12,
        marginRight: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColorOption: {
        borderColor: '#000000',
        transform: [{ scale: 1.1 }],
    },
    primaryButton: {
        backgroundColor: '#FF1744',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#FF1744",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        backgroundColor: '#F5F5F5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
    },
    secondaryButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
});
