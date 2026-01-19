import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store';
import { signOut } from '../store/slices/authSlice';

// Light theme colors matching original design
const colors = {
  background: '#F5F5F5',
  white: '#FFFFFF',
  primary: '#F97316',
  primaryLight: '#FFF7ED',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  success: '#10B981',
  danger: '#EF4444',
};

const ACCOUNT_ITEMS = [
  {
    id: 'preferences',
    icon: 'restaurant-outline',
    iconColor: colors.primary,
    label: 'Food & Drink Preferences',
    description: 'Update your favorite categories',
  },
  {
    id: 'notifications',
    icon: 'notifications-outline',
    iconColor: colors.primary,
    label: 'Notification Settings',
    description: 'Manage alerts and notifications',
  },
  {
    id: 'account',
    icon: 'settings-outline',
    iconColor: colors.primary,
    label: 'Account Settings',
    description: 'Password, email, phone number',
  },
];

const MEMBER_ACTIONS = [
  {
    id: 'list-venue',
    icon: 'add-circle-outline',
    iconColor: colors.success,
    label: 'List Your Venue',
    description: 'Add your pub or bar to PubMate',
  },
  {
    id: 'recommend',
    icon: 'heart-outline',
    iconColor: colors.success,
    label: 'Recommend a Venue',
    description: 'Suggest a venue you love',
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(signOut());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  const handleItemPress = (itemId: string) => {
    switch (itemId) {
      case 'preferences':
        navigation.navigate('Preferences');
        break;
      case 'notifications':
        navigation.navigate('NotificationSettings');
        break;
      case 'account':
        navigation.navigate('AccountSettings');
        break;
      case 'list-venue':
        navigation.navigate('ListVenue');
        break;
      case 'recommend':
        navigation.navigate('RecommendVenue');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Pubmate</Text>
              <Text style={styles.headerSubtitle}>Australia</Text>
            </View>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={colors.white} />
            </View>
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.displayName || 'User Name'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {ACCOUNT_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleItemPress(item.id)}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Member Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Member Actions</Text>
          {MEMBER_ACTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleItemPress(item.id)}
            >
              <View style={[styles.menuIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="help-circle-outline" size={22} color="#3B82F6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Help & Support</Text>
              <Text style={styles.menuDescription}>FAQs, contact us</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="document-text-outline" size={22} color="#8B5CF6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Terms & Privacy</Text>
              <Text style={styles.menuDescription}>Legal information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.danger} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>PubMate Australia v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 60,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitleContainer: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    marginLeft: 6,
    opacity: 0.9,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  editProfileBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  menuDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
