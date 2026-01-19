import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button, List, Divider, IconButton, Menu } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../../store';
import { removePaymentMethod, setDefaultPaymentMethod } from '../../store/slices/paymentSlice';
import { PaymentMethod } from '../../types/payment.types';
import { pubmateColors } from '../../theme';

export default function PaymentMethodsScreen() {
  const dispatch = useAppDispatch();
  const { paymentMethods, defaultPaymentMethodId } = useAppSelector((state) => state.payment);
  const [menuVisible, setMenuVisible] = React.useState<string | null>(null);

  const getCardBrandIcon = (brand?: string) => {
    switch (brand) {
      case 'visa':
        return 'credit-card';
      case 'mastercard':
        return 'credit-card';
      case 'amex':
        return 'credit-card';
      default:
        return 'credit-card';
    }
  };

  const getCardBrandLabel = (brand?: string) => {
    if (!brand) return 'Card';
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  const handleSetDefault = (methodId: string) => {
    dispatch(setDefaultPaymentMethod(methodId));
    setMenuVisible(null);
  };

  const handleRemove = (methodId: string) => {
    dispatch(removePaymentMethod(methodId));
    setMenuVisible(null);
  };

  const renderPaymentMethod = (method: PaymentMethod) => {
    const isDefault = method.id === defaultPaymentMethodId;

    return (
      <Surface key={method.id} style={styles.methodCard} elevation={1}>
        <View style={styles.methodContent}>
          <View style={styles.methodIcon}>
            <IconButton
              icon={getCardBrandIcon(method.cardBrand)}
              size={24}
              iconColor={pubmateColors.orange}
            />
          </View>

          <View style={styles.methodInfo}>
            <View style={styles.methodHeader}>
              <Text variant="titleMedium" style={styles.methodTitle}>
                {getCardBrandLabel(method.cardBrand)} •••• {method.last4}
              </Text>
              {isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>

            {method.holderName && (
              <Text variant="bodySmall" style={styles.holderName}>
                {method.holderName}
              </Text>
            )}

            {method.expiryMonth && method.expiryYear && (
              <Text variant="bodySmall" style={styles.expiry}>
                Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
              </Text>
            )}
          </View>

          <Menu
            visible={menuVisible === method.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => setMenuVisible(method.id)}
              />
            }
          >
            {!isDefault && (
              <Menu.Item
                onPress={() => handleSetDefault(method.id)}
                title="Set as default"
                leadingIcon="check-circle"
              />
            )}
            <Menu.Item
              onPress={() => handleRemove(method.id)}
              title="Remove"
              leadingIcon="delete"
            />
          </Menu>
        </View>
      </Surface>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconButton icon="credit-card-outline" size={64} iconColor="#ccc" />
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No payment methods
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        Add a payment method to redeem credits and make purchases
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Payment Methods
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Manage your saved payment methods
        </Text>
      </View>

      {/* Info Card */}
      <Surface style={styles.infoCard} elevation={0}>
        <View style={styles.infoContent}>
          <IconButton icon="shield-check" size={24} iconColor={pubmateColors.darkGreen} />
          <View style={styles.infoText}>
            <Text variant="titleSmall" style={styles.infoTitle}>
              Your payment is secure
            </Text>
            <Text variant="bodySmall" style={styles.infoDescription}>
              We use bank-level encryption to protect your information
            </Text>
          </View>
        </View>
      </Surface>

      {/* Payment Methods List */}
      <View style={styles.methodsSection}>
        {paymentMethods.length > 0 ? (
          <View style={styles.methodsList}>
            {paymentMethods.map(renderPaymentMethod)}
          </View>
        ) : (
          renderEmptyState()
        )}
      </View>

      {/* Add Payment Method Button */}
      <View style={styles.addButtonContainer}>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => console.log('Add payment method')}
          style={styles.addButton}
        >
          Add Payment Method
        </Button>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    color: pubmateColors.charcoal,
  },
  description: {
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: pubmateColors.darkGreen,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontWeight: '700',
    marginBottom: 2,
    color: pubmateColors.charcoal,
  },
  infoDescription: {
    color: '#666',
  },
  methodsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  methodsList: {
    gap: 12,
  },
  methodCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  methodIcon: {
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  methodTitle: {
    fontWeight: '600',
    color: pubmateColors.charcoal,
  },
  defaultBadge: {
    backgroundColor: pubmateColors.darkGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  holderName: {
    color: '#666',
    marginBottom: 2,
  },
  expiry: {
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  addButtonContainer: {
    paddingHorizontal: 16,
  },
  addButton: {
    backgroundColor: pubmateColors.orange,
  },
  bottomPadding: {
    height: 32,
  },
});
