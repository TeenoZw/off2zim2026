import type { MobileAuthUser, MobileSession } from '@/core/auth/types';
import { buildSession, subscribeToAuth } from './api';
import { apiFetch } from '@/core/http/apiClient';
import {
  registerMobileUser,
  signInMobileUser,
  signOutMobileUser,
  updateMobileUserEmail,
} from '@/core/auth/service';

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
        const session = await signInMobileUser(email, password);
        return { data: { session, user: session.user }, error: null };
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
        const isBusiness = metadata.user_type === 'business';
        const session = await registerMobileUser(
          email,
          password,
          typeof metadata.full_name === 'string' ? metadata.full_name.trim() : '',
          isBusiness ? 'business' : 'individual',
          isBusiness ? metadata.business_name || 'Off2Zim Business' : undefined,
          isBusiness
            ? undefined
            : {
                title: metadata.title,
                gender: metadata.gender,
                id_type: metadata.id_type,
                identity_number: metadata.identity_number,
                date_of_birth: metadata.date_of_birth,
                nationality: metadata.nationality,
                phone: metadata.phone,
              },
          {
            explorerType: metadata.explorer_type || 'foreign',
            providerProfile: isBusiness
              ? {
                  tradingName: metadata.business_name || 'Off2Zim Business',
                  businessRegistrationNumber: 'PENDING',
                  mainContactPerson: metadata.full_name || 'Business User',
                  businessPhone: metadata.phone || '+263000000000',
                  physicalAddress: 'Pending address',
                }
              : undefined,
          }
        );
        return { data: { session, user: session.user }, error: null };
      } catch (error) {
        return {
          data: { session: null, user: null },
          error: { message: error instanceof Error ? error.message : 'Unable to create account.' },
        };
      }
    },
    async signOut() {
      await signOutMobileUser();
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
        const user = await updateMobileUserEmail(email);
        return { data: { user }, error: null };
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
