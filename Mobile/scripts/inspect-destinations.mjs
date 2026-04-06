import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://yrulftpiwdgrejvmzkgb.supabase.co';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlydWxmdHBpd2RncmVqdm16a2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MTU4NjIsImV4cCI6MjA3NTE5MTg2Mn0.QqjmUeNgYv37HG2D_ZGlpX9elJ6OHHR8ct543wPD9Lc';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const main = async () => {
  const { data: destinations, error: destinationsError } = await supabase
    .from('destinations')
    .select('id, name, location, image_url, images, featured, display_order')
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(20);

  let galleries = null;
  let galleriesError = null;

  try {
    const response = await supabase.from('provider_galleries').select('*').limit(5);

    galleries = response.data;
    galleriesError = response.error;
  } catch (err) {
    galleriesError = err;
  }

  if (destinationsError) {
    console.error('Error fetching destinations:', destinationsError);
    process.exit(1);
  }

  if (galleriesError) {
    console.warn('Provider galleries unavailable:', galleriesError);
  }

  console.log(JSON.stringify({ destinations, galleries }, null, 2));
};

main().then(() => process.exit(0));
