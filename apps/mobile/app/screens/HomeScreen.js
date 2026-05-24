import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QuickBite</Text>
        <Text style={styles.subtitle}>Fast Food Delivered Fast</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Welcome! 🍔</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            <View style={styles.card}>
              <Text style={styles.emoji}>🍽️</Text>
              <Text style={styles.cardText}>Menu</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.emoji}>📦</Text>
              <Text style={styles.cardText}>Orders</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.emoji}>⭐</Text>
              <Text style={styles.cardText}>Favorites</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.emoji}>📞</Text>
              <Text style={styles.cardText}>Support</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#ef4444',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  banner: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});