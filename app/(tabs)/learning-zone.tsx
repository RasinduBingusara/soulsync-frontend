import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Linking, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import 'react-native-url-polyfill/auto'; // Required for fetch in older versions of React Native
import { XMLParser } from 'fast-xml-parser'; // A fast XML parser for RSS feeds
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';

// Define interfaces for type safety
interface Article {
    id: string;
    title: string;
    snippet: string;
    url: string;
}

interface RssItem {
    title: string;
    link: string;
    pubDate?: string;
    description?: string;
}

const parser = new XMLParser();

export default function LearningZone() {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    const RSS_FEEDS = [
        "https://www.apa.org/news/rss",                  // American Psychological Association
        "https://www.mindful.org/feed/",                  // Mindful.org
    ];

    const fetchRssFeed = async (url: string): Promise<Article[]> => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to fetch RSS feed from ${url}`);
                return [];
            }
            const text = await response.text();
            const json = parser.parse(text);
            const items = json?.rss?.channel?.item || json?.feed?.entry || [];

            return items.map((item: RssItem) => ({
                id: item.link,
                title: item.title,
                snippet: item.description?.replace(/<[^>]*>/g, '') || 'Click to read more...',
                url: item.link
            }));
        } catch (error) {
            console.error(`Error parsing RSS feed from ${url}:`, error);
            return [];
        }
    };

    const fetchAllFeeds = async () => {
        setLoading(true);
        const allArticles: Article[] = [];
        const fetchPromises = RSS_FEEDS.map(fetchRssFeed);

        try {
            const results = await Promise.all(fetchPromises);
            results.forEach(result => {
                allArticles.push(...result);
            });
            setArticles(allArticles);
        } catch (error) {
            console.error('Error fetching all feeds:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllFeeds();
    }, []);

    // Filter articles based on search text
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchText.toLowerCase()) ||
        article.snippet.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleReadMore = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
    };

    const renderArticleItem = ({ item }: { item: Article }) => (
        <ThemedView key={item.id} style={styles.articleCard}>
            <ThemedText style={styles.articleTitle}>{item.title}</ThemedText>
            <ThemedText style={styles.articleSnippet}>{item.snippet}</ThemedText>
            <TouchableOpacity style={styles.readMoreButton} onPress={() => handleReadMore(item.url)}>
                <Text style={styles.readMoreText}>{t('learning_zone.read_more')} →</Text>
            </TouchableOpacity>
        </ThemedView>
    );

    return (
        <ThemedView style={styles.safeArea} darkColor='#000000ff'>
            <ThemedView style={styles.container} backgroundVisible={false}>
                {loading ? (
                    <ActivityIndicator size="large" color="#4f46e5" />
                ) : (
                    filteredArticles.length > 0 ? (
                        <FlatList
                            data={filteredArticles}
                            renderItem={renderArticleItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
                        />
                    ) : (
                        <Text style={styles.noArticlesText}>No articles found.</Text>
                    )
                )}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        padding: 10,
    },
    searchBarContainer: {
        marginBottom: 24,
    },
    searchBar: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#d1d5db',
        fontSize: 16,
        color: '#1f2937',
    },
    articleList: {
        // This view handles spacing between articles
    },
    articleCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        padding: 20,
        marginBottom: 16,
    },
    articleTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8,
    },
    articleSnippet: {
        fontSize: 16,
        color: '#4b5563',
        marginBottom: 12,
    },
    readMoreButton: {
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    readMoreText: {
        color: '#4f46e5',
        fontWeight: '600',
        fontSize: 16,
    },
    noArticlesText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 24,
    }
});
