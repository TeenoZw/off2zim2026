import {
  apiFetch,
  buildSession,
  clearSession,
  MobileAuthUser,
  MobileSession,
  persistSession,
  persistUser,
  subscribeToAuth,
} from './api';

export type User = MobileAuthUser;
export type Session = MobileSession;

export interface Database {
  public: {
    Tables: {
      destinations: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          location: string | null;
          image_url: string | null;
          images: string[] | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          weather?: string | null;
        };
      };
    };
  };
}

type QueryAction = 'select' | 'update' | 'insert' | 'delete';

function notSupported(message: string) {
  return { data: null, error: { message } };
}

class QueryBuilder implements PromiseLike<any> {
  private action: QueryAction = 'select';
  private filters: Record<string, any> = {};
  private payload: any = undefined;
  private selectColumns: string | undefined;
  private expectsSingle = false;
  private orderField: string | undefined;
  private orderAscending = true;
  private limitCount: number | undefined;

  constructor(private readonly table: string) {}

  select(columns?: string) {
    this.action = 'select';
    this.selectColumns = columns;
    return this;
  }

  update(payload: any) {
    this.action = 'update';
    this.payload = payload;
    return this;
  }

  insert(payload: any) {
    this.action = 'insert';
    this.payload = payload;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(field: string, value: any) {
    this.filters[field] = value;
    return this;
  }

  or(_value: string) {
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderField = field;
    this.orderAscending = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.expectsSingle = true;
    return this;
  }

  maybeSingle() {
    this.expectsSingle = true;
    return this;
  }

  async execute() {
    try {
      if (this.table === 'profiles') {
        if (this.action === 'select') {
          const profile = await apiFetch<any>('/api/profile');
          return { data: profile.profile, error: null };
        }

        if (this.action === 'update') {
          const profile = await apiFetch<any>('/api/profile', {
            method: 'PATCH',
            body: JSON.stringify(this.payload),
          });
          return { data: profile.profile, error: null };
        }
      }

      if (this.table === 'reviews' && this.action === 'select') {
        return { data: [], error: null };
      }

      if (this.table === 'favorites' && this.action === 'delete') {
        const itemId = this.filters.item_id;
        const itemType = this.filters.item_type;
        if (!itemId) {
          return notSupported('Favorite deletion requires an item id.');
        }

        await apiFetch('/api/favorites', {
          method: 'DELETE',
          body: JSON.stringify({ itemId, itemType }),
        });
        return { data: [], error: null };
      }

      if (this.table === 'destinations' && this.action === 'select') {
        const payload = await apiFetch<{ destinations: any[] }>('/api/destinations');
        if (this.selectColumns === 'count') {
          return { data: [{ count: payload.destinations.length }], error: null };
        }

        return { data: payload.destinations, error: null };
      }

      return notSupported(`Table "${this.table}" is not available in mobile compatibility mode.`);
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Request failed',
        },
      };
    }
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

function mapAuthUser(rawUser: any): MobileAuthUser {
  return {
    id: rawUser.id,
    email: rawUser.email,
    user_metadata: {
      full_name:
        rawUser.profile?.fullName ||
        rawUser.name ||
        [rawUser.firstName, rawUser.lastName].filter(Boolean).join(' ').trim(),
      first_name: rawUser.firstName,
      last_name: rawUser.lastName,
      phone: rawUser.profile?.phone,
      nationality: rawUser.profile?.nationality || rawUser.profile?.location,
      business_name: rawUser.profile?.companyName,
      user_type: rawUser.role === 'provider' ? 'business' : 'individual',
      avatar_url: rawUser.avatar,
      title: rawUser.profile?.title,
      gender: rawUser.profile?.gender,
      id_type: rawUser.profile?.idType,
      identity_number: rawUser.profile?.identityNumber,
      date_of_birth: rawUser.profile?.dateOfBirth,
      rating: rawUser.explorerScore?.rating ?? 0,
    },
  };
}

export const supabase = {
  auth: {
    async getSession() {
      const session = await buildSession();
      return { data: { session } };
    },
    onAuthStateChange(callback: (event: string, session: MobileSession | null) => void) {
      const subscription = subscribeToAuth((event, session) => callback(event, session));
      return { data: { subscription } };
    },
    async getUser() {
      const session = await buildSession();
      return { data: { user: session?.user ?? null } };
    },
    async signInWithPassword({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) {
      try {
        const payload = await apiFetch<{ token: string; user: any }>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        const user = mapAuthUser(payload.user);
        await persistSession(payload.token, user);
        return { data: { session: { access_token: payload.token, user }, user }, error: null };
      } catch (error) {
        return {
          data: { session: null, user: null },
          error: { message: error instanceof Error ? error.message : 'Unable to sign in.' },
        };
      }
    },
    async signUp({
      email,
      password,
      options,
    }: {
      email: string;
      password: string;
      options?: { data?: Record<string, any> };
    }) {
      try {
        const metadata = options?.data ?? {};
        const fullName = typeof metadata.full_name === 'string' ? metadata.full_name.trim() : '';
        const [firstName, ...rest] = fullName.split(/\s+/).filter(Boolean);
        const lastName = rest.join(' ');
        const isBusiness = metadata.user_type === 'business';

        const payload = await apiFetch<{ token: string; user: any }>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            firstName: firstName || (isBusiness ? 'Business' : 'Off2Zim'),
            lastName: lastName || (isBusiness ? 'User' : 'Explorer'),
            role: isBusiness ? 'provider' : 'explorer',
            explorerType: 'foreign',
            companyName: isBusiness ? metadata.business_name || 'Off2Zim Business' : undefined,
            tradingName: isBusiness ? metadata.business_name || 'Off2Zim Business' : undefined,
            businessRegistrationNumber: isBusiness ? 'PENDING' : undefined,
            mainContactPerson: isBusiness ? fullName || 'Business User' : undefined,
            businessPhone: isBusiness ? metadata.phone || '+263000000000' : undefined,
            businessEmail: isBusiness ? email : undefined,
            physicalAddress: isBusiness ? 'Pending address' : undefined,
          }),
        });

        const user = mapAuthUser(payload.user);
        user.user_metadata = {
          ...user.user_metadata,
          ...metadata,
        };
        await persistSession(payload.token, user);
        return { data: { session: { access_token: payload.token, user }, user }, error: null };
      } catch (error) {
        return {
          data: { session: null, user: null },
          error: { message: error instanceof Error ? error.message : 'Unable to create account.' },
        };
      }
    },
    async signOut() {
      try {
        await apiFetch('/api/auth/logout', { method: 'POST' });
      } catch {
        // Ignore logout failures and clear client state.
      }
      await clearSession();
      return { error: null };
    },
    async resetPasswordForEmail(_email?: string) {
      return {
        data: null,
        error: { message: 'Password reset is not available in the shared mobile backend yet.' },
      };
    },
    async resend(_payload?: Record<string, any>) {
      return { data: null, error: null };
    },
    async verifyOtp(_payload?: Record<string, any>) {
      return { data: null, error: { message: 'Email verification is not required in this build.' } };
    },
    async updateUser({ email }: { email?: string }) {
      try {
        const payload = await apiFetch<{ profile: any }>('/api/profile', {
          method: 'PATCH',
          body: JSON.stringify({ email }),
        });
        const session = await buildSession();
        if (session) {
          const nextUser = {
            ...session.user,
            email: payload.profile.email,
          };
          await persistUser(nextUser);
        }
        return { data: { user: session?.user ?? null }, error: null };
      } catch (error) {
        return {
          data: { user: null },
          error: { message: error instanceof Error ? error.message : 'Unable to update user.' },
        };
      }
    },
  },
  from(table: string) {
    return new QueryBuilder(table);
  },
  storage: {
    from(_bucket?: string) {
      return {
        async upload(_path?: string, _file?: any, _options?: any) {
          return notSupported('Media uploads are not connected to the shared backend yet.');
        },
        async remove(_paths?: string[]) {
          return notSupported('Media removal is not connected to the shared backend yet.');
        },
        getPublicUrl(_path?: string) {
          return { data: { publicUrl: '' } };
        },
      };
    },
  },
  async rpc(name: string) {
    if (name === 'delete_account_and_data') {
      try {
        const payload = await apiFetch<{ ok: boolean }>('/api/profile', {
          method: 'DELETE',
        });
        return { data: payload, error: null };
      } catch (error) {
        return {
          data: null,
          error: {
            message:
              error instanceof Error ? error.message : 'Unable to delete account.',
          },
        };
      }
    }

    return notSupported(`RPC "${name}" is not available in the shared mobile backend.`);
  },
};
