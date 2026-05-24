import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>👤</Text>
        <Text style={styles.title}>Not Logged In</Text>
        <Text style={styles.subtitle}>Sign in to see your profile</Text>

        <View style={styles.buttonContainer}>
          <Button 
            title="Login" 
            color="#ef4444" 
            onPress={() => Alert.alert('Login', 'Login screen coming soon')}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>Features:</Text>
          <Text style={styles.infoText}>📧 Email & Password</Text>
          <Text style={styles.infoText}>🔐 Secure JWT Auth</Text>
          <Text style={styles.infoText}>💾 Order History</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 32,
    minWidth: 200,
  },
  info: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
});