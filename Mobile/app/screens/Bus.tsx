import React from 'react';
import TransportSearch from '@/components/TransportSearch';
import { busOperatorsData } from '@/constants/FeaturedData';

const destinations = ['Harare', 'Gweru', 'Kwekwe', 'Kadoma', 'Bulawayo'];

export default function Bus() {
  return (
    <TransportSearch
      operatorData={busOperatorsData}
      operatorHeaderTitle="Operator"
      operatorAllLabel="All"
      operatorIconName="bus"
      searchRoute="/bus-search"
      serviceProviderDefault="Bus"
      destinationsList={destinations}
      fromPlaceholder="Select departure location"
      toPlaceholder="Select destination"
    />
  );
}

