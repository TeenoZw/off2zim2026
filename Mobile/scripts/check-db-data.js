/* eslint-env node */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read Supabase credentials from .env or config
const envPath = path.join(process.cwd(), '.env');
let supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/EXPO_PUBLIC_SUPABASE_URL=(.+)/);
  const keyMatch = envContent.match(/EXPO_PUBLIC_SUPABASE_ANON_KEY=(.+)/);

  if (urlMatch) supabaseUrl = urlMatch[1].trim();
  if (keyMatch) supabaseKey = keyMatch[1].trim();
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('=== CHECKING STAYS DATA ===\n');

  // Check stays table
  const { data: stays, error: staysError } = await supabase
    .from('stays')
    .select('id, name, location, provider_id, phone, full_location, total_reviews')
    .limit(10);

  if (staysError) {
    console.error('Error fetching stays:', staysError);
  } else {
    console.log(`Found ${stays.length} stays:`);
    stays.forEach(stay => {
      console.log(`  - ${stay.name} (${stay.id})`);
      console.log(`    Provider ID: ${stay.provider_id || 'NOT SET'}`);
      console.log(`    Phone: ${stay.phone || 'NOT SET'}`);
      console.log(`    Full Location: ${stay.full_location || stay.location || 'NOT SET'}`);
      console.log(`    Total Reviews: ${stay.total_reviews || 0}`);
    });
  }

  console.log('\n=== CHECKING SERVICE PROVIDERS ===\n');

  // Check service_providers table with more details
  const { data: providers, error: providersError } = await supabase
    .from('service_providers')
    .select('*')
    .limit(20);

  console.log('Query result:', { providers, providersError });

  if (providersError) {
    console.error('Error fetching service_providers:', providersError);
  } else {
    console.log(`Found ${providers?.length || 0} service providers:`);
    providers?.forEach(provider => {
      console.log(`  - ${provider.business_name} (${provider.business_type})`);
      console.log(`    ID: ${provider.id}`);
      console.log(`    Logo: ${provider.logo_url || 'NOT SET'}`);
      console.log(`    Status: ${provider.verification_status}`);
    });
  }

  console.log('\n=== CHECKING STAY_ROOMS DATA ===\n');

  // Check stay_rooms table
  const { data: rooms, error: roomsError } = await supabase
    .from('stay_rooms')
    .select(
      'id, stay_id, stay_name, name, room_type, base_price, total_rooms, available_rooms, is_active'
    )
    .limit(20);

  if (roomsError) {
    console.error('Error fetching stay_rooms:', roomsError);
  } else {
    console.log(`Found ${rooms.length} rooms:`);
    rooms.forEach(room => {
      console.log(
        `  - ${room.name || room.room_type} ($${room.base_price}) - ${room.stay_name || 'Unknown Hotel'}`
      );
      console.log(
        `    Total: ${room.total_rooms}, Available: ${room.available_rooms}, Stay ID: ${room.stay_id}`
      );
    });
  }

  console.log('\n=== CHECKING STAY_GALLERY DATA ===\n');

  // Check stay_gallery table
  const { data: gallery, error: galleryError } = await supabase
    .from('stay_gallery')
    .select('id, stay_id, image_url, category, sort_order')
    .limit(20);

  if (galleryError) {
    console.error('Error fetching stay_gallery:', galleryError);
  } else {
    console.log(`Found ${gallery.length} gallery images:`);
    gallery.forEach(img => {
      console.log(`  - ${img.category} (sort: ${img.sort_order}) - Stay ID: ${img.stay_id}`);
    });
  }

  console.log('\n=== CHECKING STAYS WITH JOINED DATA ===\n');

  // Check stays with joins
  const { data: staysWithRooms, error: joinError } = await supabase
    .from('stays')
    .select(
      `
      id,
      name,
      stay_rooms (
        id,
        name,
        room_type,
        base_price,
        is_active
      ),
      stay_gallery (
        id,
        image_url,
        sort_order
      )
    `
    )
    .limit(5);

  if (joinError) {
    console.error('Error fetching stays with joins:', joinError);
  } else {
    staysWithRooms.forEach(stay => {
      console.log(`\nStay: ${stay.name} (${stay.id})`);
      console.log(`  Rooms: ${stay.stay_rooms?.length || 0}`);
      stay.stay_rooms?.forEach(room => {
        console.log(`    - ${room.name || room.room_type}: $${room.base_price}`);
      });
      console.log(`  Gallery images: ${stay.stay_gallery?.length || 0}`);
    });
  }
}

checkData()
  .then(() => {
    console.log('\n=== DONE ===');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
