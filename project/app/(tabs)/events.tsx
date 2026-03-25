import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from 'react-native';
import { theme } from '@/constants/theme';
import { Calendar, MapPin, Users, Clock } from 'lucide-react-native';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { upcomingEvents } from '@/data/mockData';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface EventItemProps {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  attendees?: number;
  onPress: () => void;
}

function EventItem({ id, title, date, location, image, attendees, onPress }: EventItemProps) {
  return (
    <Pressable style={styles.eventItem} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle} numberOfLines={2}>{title}</Text>
        <View style={styles.eventDetail}>
          <Calendar size={14} color={theme.colors.textSecondary} />
          <Text style={styles.eventDetailText}>{date}</Text>
        </View>
        <View style={styles.eventDetail}>
          <MapPin size={14} color={theme.colors.textSecondary} />
          <Text style={styles.eventDetailText}>{location}</Text>
        </View>
        {attendees && (
          <View style={styles.eventDetail}>
            <Users size={14} color={theme.colors.textSecondary} />
            <Text style={styles.eventDetailText}>{attendees} attending</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function EventsScreen() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  const featuredEvents = [
    {
      id: 'f1',
      title: 'Victoria Falls Carnival',
      date: 'December 29-31, 2023',
      location: 'Victoria Falls',
      image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
      attendees: 1250,
    },
    {
      id: 'f2',
      title: 'Harare International Festival of the Arts',
      date: 'May 2-7, 2023',
      location: 'Harare',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      attendees: 780,
    },
  ];
  
  const monthlyEvents = [
    {
      id: 'e1',
      title: 'Zimbabwe International Film Festival',
      date: 'October 3-10, 2023',
      location: 'Bulawayo',
      image: 'https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg',
    },
    {
      id: 'e2',
      title: 'Shoko Festival',
      date: 'September 23-25, 2023',
      location: 'Harare',
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
    },
    {
      id: 'e3',
      title: 'Zimbabwe Agricultural Show',
      date: 'August 29 - September 3, 2023',
      location: 'Harare',
      image: 'https://images.pexels.com/photos/1153082/pexels-photo-1153082.jpeg',
    },
  ];

  const handleEventPress = (id: string) => {
    router.push(`/(modals)/event?id=${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Events</Text>
          <Text style={styles.subtitle}>Discover Zimbabwe's vibrant culture</Text>
        </View>
        
        {/* Month Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.monthSelector}
        >
          {months.map((month, index) => (
            <Pressable 
              key={index} 
              style={[
                styles.monthItem, 
                selectedMonth === index && styles.selectedMonth
              ]}
              onPress={() => setSelectedMonth(index)}
            >
              <Text 
                style={[
                  styles.monthText, 
                  selectedMonth === index && styles.selectedMonthText
                ]}
              >
                {month}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        
        {/* Featured Events */}
        <View style={styles.section}>
          <SectionHeader title="Featured Events" />
          <View style={styles.featuredEventsContainer}>
            {featuredEvents.map((event) => (
              <View key={event.id} style={styles.featuredEvent}>
                <Image source={{ uri: event.image }} style={styles.featuredEventImage} />
                <View style={styles.featuredEventOverlay}>
                  <View style={styles.featuredEventContent}>
                    <Text style={styles.featuredEventTitle}>{event.title}</Text>
                    <View style={styles.featuredEventDetail}>
                      <Calendar size={16} color="#FFFFFF" />
                      <Text style={styles.featuredEventDetailText}>{event.date}</Text>
                    </View>
                    <View style={styles.featuredEventDetail}>
                      <MapPin size={16} color="#FFFFFF" />
                      <Text style={styles.featuredEventDetailText}>{event.location}</Text>
                    </View>
                    <View style={styles.featuredEventDetail}>
                      <Users size={16} color="#FFFFFF" />
                      <Text style={styles.featuredEventDetailText}>{event.attendees} attending</Text>
                    </View>
                    <Button 
                      title="Book Now" 
                      size="small"
                      onPress={() => handleEventPress(event.id)} 
                      style={styles.bookButton}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        {/* Upcoming Events */}
        <View style={styles.section}>
          <SectionHeader title={`Events in ${months[selectedMonth]}`} />
          <View style={styles.eventsList}>
            {monthlyEvents.map((event) => (
              <EventItem 
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                image={event.image}
                onPress={() => handleEventPress(event.id)}
              />
            ))}
          </View>
        </View>
        
        {/* All Events */}
        <View style={styles.section}>
          <SectionHeader title="All Upcoming Events" />
          <View style={styles.eventsList}>
            {upcomingEvents.map((event) => (
              <EventItem 
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.subtitle.split('|')[1].trim()}
                location={event.subtitle.split('|')[0].trim()}
                image={event.image}
                onPress={() => handleEventPress(event.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.xl,
    marginBottom: theme.spacing.m,
  },
  title: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 24,
    color: theme.colors.text,
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  monthSelector: {
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    flexDirection: 'row',
  },
  monthItem: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    marginRight: theme.spacing.s,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: '#F5F5F5',
  },
  selectedMonth: {
    backgroundColor: theme.colors.primary,
  },
  monthText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    color: theme.colors.text,
  },
  selectedMonthText: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  featuredEventsContainer: {
    paddingHorizontal: theme.spacing.m,
    gap: theme.spacing.m,
  },
  featuredEvent: {
    height: 200,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  featuredEventImage: {
    width: '100%',
    height: '100%',
  },
  featuredEventOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  featuredEventContent: {
    padding: theme.spacing.m,
  },
  featuredEventTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  featuredEventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  featuredEventDetailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: theme.spacing.xs,
  },
  bookButton: {
    marginTop: theme.spacing.s,
    alignSelf: 'flex-start',
  },
  eventsList: {
    paddingHorizontal: theme.spacing.m,
    gap: theme.spacing.m,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  eventImage: {
    width: 100,
    height: 100,
  },
  eventContent: {
    flex: 1,
    padding: theme.spacing.m,
  },
  eventTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventDetailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
});