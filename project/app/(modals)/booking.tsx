import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from 'react-native';
import { useSearchParams, useRouter, Stack } from 'expo-router';
import { theme } from '@/constants/theme';
import { Calendar as CalendarIcon, ChevronDown, Users, CreditCard, CircleCheck as CheckCircle, ArrowLeft, Plus, Minus } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { paymentMethods, topAccommodations } from '@/data/mockData';

// Booking screen for accommodation and events
export default function BookingScreen() {
  const params = useSearchParams();
  const router = useRouter();
  
  // Get ID and type from URL params
  const id = params.id as string;
  const type = params.type as string;
  
  // Get item details based on type (accommodation or event)
  const item = type === 'accommodation' 
    ? topAccommodations.find(item => item.id === id)
    : null; // Add events data if needed
  
  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Item not found</Text>
      </SafeAreaView>
    );
  }
  
  // State for booking
  const [checkInDate, setCheckInDate] = useState('Jun 15, 2023');
  const [checkOutDate, setCheckOutDate] = useState('Jun 18, 2023');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('1');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  
  // Calculate booking details
  const nights = 3;
  const basePrice = parseInt(item.price?.replace(/\D/g, '')) || 100;
  const totalPrice = basePrice * nights;
  const taxFee = totalPrice * 0.15;
  const serviceFee = 25;
  const grandTotal = totalPrice + taxFee + serviceFee;
  
  const incrementGuests = () => {
    if (guests < 10) setGuests(guests + 1);
  };
  
  const decrementGuests = () => {
    if (guests > 1) setGuests(guests - 1);
  };
  
  const incrementRooms = () => {
    if (rooms < 5) setRooms(rooms + 1);
  };
  
  const decrementRooms = () => {
    if (rooms > 1) setRooms(rooms - 1);
  };
  
  const handlePaymentSelect = (id: string) => {
    setSelectedPaymentMethod(id);
    setShowPaymentMethods(false);
  };
  
  const handleCompleteBooking = () => {
    setIsBookingComplete(true);
    setTimeout(() => {
      router.push('/(tabs)/index');
    }, 3000);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false,
      }} />
      
      {isBookingComplete ? (
        <View style={styles.confirmationContainer}>
          <CheckCircle size={80} color={theme.colors.success} />
          <Text style={styles.confirmationTitle}>Booking Confirmed!</Text>
          <Text style={styles.confirmationText}>
            Your booking at {item.title} has been confirmed. A confirmation email has been sent to your registered email address.
          </Text>
          <Text style={styles.bookingReference}>Booking Reference: ZIM3458923</Text>
          <Button 
            title="Back to Home" 
            onPress={() => router.push('/(tabs)/index')} 
            style={styles.homeButton}
          />
        </View>
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </Pressable>
            <Text style={styles.headerTitle}>Booking Details</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Item Summary */}
            <View style={styles.itemSummary}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.itemLocation}>{item.subtitle}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                  <Text style={styles.perNight}>per night</Text>
                </View>
              </View>
            </View>
            
            {/* Date Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dates</Text>
              <Pressable 
                style={styles.dateSelector}
                onPress={() => setShowDatePicker(!showDatePicker)}
              >
                <View style={styles.dateInfo}>
                  <CalendarIcon size={20} color={theme.colors.text} />
                  <View style={styles.dateTexts}>
                    <Text style={styles.dateLabel}>Check-in</Text>
                    <Text style={styles.dateValue}>{checkInDate}</Text>
                  </View>
                </View>
                <View style={styles.dateDivider} />
                <View style={styles.dateInfo}>
                  <CalendarIcon size={20} color={theme.colors.text} />
                  <View style={styles.dateTexts}>
                    <Text style={styles.dateLabel}>Check-out</Text>
                    <Text style={styles.dateValue}>{checkOutDate}</Text>
                  </View>
                </View>
                <ChevronDown size={20} color={theme.colors.textSecondary} />
              </Pressable>
              
              {showDatePicker && (
                <View style={styles.calendarContainer}>
                  <Text style={styles.calendarPlaceholder}>
                    Calendar UI would be implemented here
                  </Text>
                </View>
              )}
            </View>
            
            {/* Guests */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Guests</Text>
              <View style={styles.counterContainer}>
                <View style={styles.counter}>
                  <View style={styles.counterInfo}>
                    <Users size={20} color={theme.colors.text} />
                    <Text style={styles.counterLabel}>Adults</Text>
                  </View>
                  <View style={styles.counterControls}>
                    <Pressable 
                      style={[styles.counterButton, guests <= 1 && styles.counterButtonDisabled]} 
                      onPress={decrementGuests}
                      disabled={guests <= 1}
                    >
                      <Minus size={16} color={guests <= 1 ? theme.colors.textSecondary : theme.colors.text} />
                    </Pressable>
                    <Text style={styles.counterValue}>{guests}</Text>
                    <Pressable 
                      style={styles.counterButton} 
                      onPress={incrementGuests}
                    >
                      <Plus size={16} color={theme.colors.text} />
                    </Pressable>
                  </View>
                </View>
                
                <View style={styles.counter}>
                  <View style={styles.counterInfo}>
                    <CreditCard size={20} color={theme.colors.text} />
                    <Text style={styles.counterLabel}>Rooms</Text>
                  </View>
                  <View style={styles.counterControls}>
                    <Pressable 
                      style={[styles.counterButton, rooms <= 1 && styles.counterButtonDisabled]} 
                      onPress={decrementRooms}
                      disabled={rooms <= 1}
                    >
                      <Minus size={16} color={rooms <= 1 ? theme.colors.textSecondary : theme.colors.text} />
                    </Pressable>
                    <Text style={styles.counterValue}>{rooms}</Text>
                    <Pressable 
                      style={styles.counterButton} 
                      onPress={incrementRooms}
                    >
                      <Plus size={16} color={theme.colors.text} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Payment Method */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <Pressable 
                style={styles.paymentSelector}
                onPress={() => setShowPaymentMethods(!showPaymentMethods)}
              >
                {paymentMethods.find(m => m.id === selectedPaymentMethod) && (
                  <View style={styles.selectedPayment}>
                    <Image 
                      source={paymentMethods.find(m => m.id === selectedPaymentMethod)?.icon} 
                      style={styles.paymentIcon} 
                    />
                    <Text style={styles.paymentName}>
                      {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                    </Text>
                  </View>
                )}
                <ChevronDown size={20} color={theme.colors.textSecondary} />
              </Pressable>
              
              {showPaymentMethods && (
                <View style={styles.paymentMethodsList}>
                  {paymentMethods.map((method) => (
                    <Pressable 
                      key={method.id}
                      style={[
                        styles.paymentMethodItem,
                        selectedPaymentMethod === method.id && styles.selectedPaymentMethod
                      ]}
                      onPress={() => handlePaymentSelect(method.id)}
                    >
                      <Image source={method.icon} style={styles.paymentIcon} />
                      <Text style={styles.paymentMethodName}>{method.name}</Text>
                      {selectedPaymentMethod === method.id && (
                        <CheckCircle size={18} color={theme.colors.primary} />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
            
            {/* Price Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Details</Text>
              <View style={styles.priceDetails}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceItem}>
                    ${basePrice} x {nights} nights
                  </Text>
                  <Text style={styles.priceValue}>${totalPrice}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceItem}>Tax (15%)</Text>
                  <Text style={styles.priceValue}>${taxFee.toFixed(2)}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceItem}>Service Fee</Text>
                  <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceRow}>
                  <Text style={styles.totalLabel}>Total (USD)</Text>
                  <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
                </View>
              </View>
            </View>
            
            {/* Policy */}
            <View style={styles.policyContainer}>
              <Text style={styles.policyText}>
                By proceeding with this booking, you agree to Off2Zim's Terms of Service and Privacy Policy.
              </Text>
            </View>
          </ScrollView>
          
          {/* Book Now Button */}
          <View style={styles.bookingBar}>
            <Button 
              title="Confirm Booking" 
              onPress={handleCompleteBooking}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 18,
    color: theme.colors.text,
  },
  itemSummary: {
    flexDirection: 'row',
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.medium,
  },
  itemInfo: {
    flex: 1,
    marginLeft: theme.spacing.m,
  },
  itemName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  itemLocation: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  itemPrice: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: theme.colors.primary,
  },
  perNight: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  section: {
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTexts: {
    marginLeft: theme.spacing.s,
  },
  dateLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  dateValue: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: theme.colors.text,
  },
  dateDivider: {
    height: 24,
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.m,
  },
  calendarContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    marginTop: theme.spacing.s,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  calendarPlaceholder: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  counterContainer: {
    gap: theme.spacing.m,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
  },
  counterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.round,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  counterButtonDisabled: {
    backgroundColor: '#EEEEEE',
  },
  counterValue: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
    marginHorizontal: theme.spacing.s,
    minWidth: 24,
    textAlign: 'center',
  },
  paymentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
  },
  selectedPayment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginRight: theme.spacing.s,
  },
  paymentName: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: theme.colors.text,
  },
  paymentMethodsList: {
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.s,
    padding: theme.spacing.s,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.small,
  },
  selectedPaymentMethod: {
    backgroundColor: theme.colors.primary + '10', // 10% opacity
  },
  paymentMethodName: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  priceDetails: {
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  priceItem: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.text,
  },
  priceValue: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: theme.colors.text,
  },
  priceDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.s,
  },
  totalLabel: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: theme.colors.text,
  },
  totalValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: theme.colors.primary,
  },
  policyContainer: {
    padding: theme.spacing.m,
    marginBottom: theme.spacing.xxl,
  },
  policyText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  bookingBar: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  confirmationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  confirmationTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 24,
    color: theme.colors.text,
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  confirmationText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  bookingReference: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xl,
  },
  homeButton: {
    width: '80%',
  },
});