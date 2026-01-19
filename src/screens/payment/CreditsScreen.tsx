import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Surface, Button, Divider, IconButton, SegmentedButtons } from 'react-native-paper';
import { useAppSelector } from '../../store';
import { CreditTransaction, TRANSACTION_TYPE_LABELS, TRANSACTION_TYPE_ICONS } from '../../types/payment.types';
import { pubmateColors } from '../../theme';

export default function CreditsScreen() {
  const { creditBalance, creditTransactions, signupBonus } = useAppSelector((state) => state.payment);
  const [selectedTab, setSelectedTab] = useState('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  };

  const getFilteredTransactions = () => {
    if (selectedTab === 'all') return creditTransactions;
    if (selectedTab === 'earned') return creditTransactions.filter(t => t.amount > 0);
    if (selectedTab === 'spent') return creditTransactions.filter(t => t.amount < 0);
    return creditTransactions;
  };

  const filteredTransactions = getFilteredTransactions();

  const renderTransaction = ({ item }: { item: CreditTransaction }) => (
    <View style={styles.transactionItem}>
      <View style={[
        styles.iconContainer,
        item.amount > 0 ? styles.iconContainerGreen : styles.iconContainerOrange
      ]}>
        <IconButton
          icon={TRANSACTION_TYPE_ICONS[item.type]}
          size={20}
          iconColor="#fff"
        />
      </View>

      <View style={styles.transactionContent}>
        <Text variant="titleSmall" style={styles.transactionTitle}>
          {TRANSACTION_TYPE_LABELS[item.type]}
        </Text>
        <Text variant="bodySmall" style={styles.transactionDescription}>
          {item.description}
        </Text>
        <Text variant="bodySmall" style={styles.transactionDate}>
          {formatDate(item.createdAt)}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text
          variant="titleMedium"
          style={[
            styles.transactionAmount,
            item.amount > 0 ? styles.amountPositive : styles.amountNegative
          ]}
        >
          {formatAmount(item.amount)}
        </Text>
        {item.status === 'pending' && (
          <Text variant="bodySmall" style={styles.pendingLabel}>
            Pending
          </Text>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconButton icon="wallet-outline" size={64} iconColor="#ccc" />
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No transactions yet
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        Your credit history will appear here
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Balance Card */}
      <Surface style={styles.balanceCard} elevation={2}>
        <View style={styles.balanceContent}>
          <Text variant="titleMedium" style={styles.balanceLabel}>
            Available Credits
          </Text>
          <Text variant="displayMedium" style={styles.balanceAmount}>
            ${creditBalance.availableCredits.toFixed(2)}
          </Text>

          {signupBonus && signupBonus.status === 'active' && (
            <View style={styles.bonusInfo}>
              <Text variant="bodySmall" style={styles.bonusText}>
                🎉 Welcome bonus active
              </Text>
              <Text variant="bodySmall" style={styles.expiryText}>
                Expires {formatDate(signupBonus.expiresAt)}
              </Text>
            </View>
          )}

          {creditBalance.pendingCredits > 0 && (
            <Text variant="bodySmall" style={styles.pendingCredits}>
              ${creditBalance.pendingCredits.toFixed(2)} pending
            </Text>
          )}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>
              Earned
            </Text>
            <Text variant="titleMedium" style={styles.statValue}>
              ${creditBalance.lifetimeEarned.toFixed(2)}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>
              Spent
            </Text>
            <Text variant="titleMedium" style={styles.statValue}>
              ${creditBalance.lifetimeSpent.toFixed(2)}
            </Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => console.log('Redeem credits')}
          style={styles.redeemButton}
          icon="cash-check"
        >
          Redeem at Venue
        </Button>
      </Surface>

      {/* Referral Card */}
      <Surface style={styles.referralCard} elevation={1}>
        <View style={styles.referralContent}>
          <View style={styles.referralIcon}>
            <Text style={styles.referralEmoji}>🤝</Text>
          </View>
          <View style={styles.referralInfo}>
            <Text variant="titleMedium" style={styles.referralTitle}>
              Refer a Friend
            </Text>
            <Text variant="bodySmall" style={styles.referralDescription}>
              Give $10, Get $10 when they sign up
            </Text>
          </View>
          <Button
            mode="outlined"
            compact
            onPress={() => console.log('Share referral')}
          >
            Share
          </Button>
        </View>
      </Surface>

      {/* Transaction History */}
      <View style={styles.historySection}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Transaction History
        </Text>

        {/* Filter Tabs */}
        <SegmentedButtons
          value={selectedTab}
          onValueChange={setSelectedTab}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'earned', label: 'Earned' },
            { value: 'spent', label: 'Spent' },
          ]}
          style={styles.segmentedButtons}
        />

        <Surface style={styles.transactionsCard} elevation={0}>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <React.Fragment key={transaction.id}>
                {renderTransaction({ item: transaction })}
                {index < filteredTransactions.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            renderEmptyState()
          )}
        </Surface>
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
  balanceCard: {
    backgroundColor: pubmateColors.orange,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 24,
  },
  balanceContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 8,
  },
  bonusInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  bonusText: {
    color: '#fff',
    fontWeight: '600',
  },
  expiryText: {
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  pendingCredits: {
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statLabel: {
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontWeight: '700',
  },
  redeemButton: {
    backgroundColor: '#fff',
  },
  referralCard: {
    backgroundColor: pubmateColors.cream,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: pubmateColors.darkGreen,
  },
  referralContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  referralIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralEmoji: {
    fontSize: 24,
  },
  referralInfo: {
    flex: 1,
  },
  referralTitle: {
    fontWeight: '700',
    marginBottom: 2,
    color: pubmateColors.charcoal,
  },
  referralDescription: {
    color: '#666',
  },
  historySection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 16,
    color: pubmateColors.charcoal,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  transactionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerGreen: {
    backgroundColor: pubmateColors.darkGreen,
  },
  iconContainerOrange: {
    backgroundColor: pubmateColors.orange,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontWeight: '600',
    marginBottom: 2,
    color: pubmateColors.charcoal,
  },
  transactionDescription: {
    color: '#666',
    marginBottom: 2,
  },
  transactionDate: {
    color: '#999',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontWeight: '700',
  },
  amountPositive: {
    color: pubmateColors.darkGreen,
  },
  amountNegative: {
    color: pubmateColors.orange,
  },
  pendingLabel: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 2,
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
  bottomPadding: {
    height: 32,
  },
});
