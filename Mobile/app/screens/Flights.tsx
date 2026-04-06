import React from 'react';
import TransportSearch from '@/components/TransportSearch';
import { flightOperatorsData } from '@/constants/FeaturedData';

const destinations = ['Harare', 'Gweru', 'Kwekwe', 'Kadoma', 'Bulawayo'];

export default function Flights() {
  return (
    <TransportSearch
      operatorData={flightOperatorsData}
      operatorHeaderTitle="Airline"
      operatorAllLabel="All"
      operatorIconName="plane"
      searchRoute="/flight-search"
      serviceProviderDefault="Airline"
      destinationsList={destinations}
      fromPlaceholder="Select departure airport"
      toPlaceholder="Select destination airport"
    />
  );
}
