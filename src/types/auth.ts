export type UserRole = "explorer" | "provider" | "guide" | "admin";

// Aligns with PRD 2.1: Explorer location identification
export type ExplorerType = "local" | "foreign";

// Aligns with PRD 3.3: Two-tier verification system
export type VerificationStatus =
  | "pending"
  | "basic_approved"
  | "verified_premium";

export interface UserVerification {
  email?: boolean;
  phone?: boolean;
  identity?: boolean;
  business?: boolean;
}

// Aligns with PRD 2.1: Explorer Score for reliability tracking
export interface ExplorerScore {
  rating: number; // 0-5 scale
  completedBookings: number;
  cancelledBookings: number;
  reviewsReceived: number;
  lastUpdated: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  // Aligns with PRD 3.3: Two-tier verification system
  verificationStatus: VerificationStatus;
  // Aligns with PRD 3.3: Paid verification badge
  hasVerifiedBadge: boolean;
  verifiedBadgeExpiresAt?: string;
  createdAt: string;
  lastActive: string;
  profile: UserProfile;
  verification?: UserVerification;
  // Aligns with PRD 2.1: Explorer Score system
  explorerScore?: ExplorerScore;
  // Aligns with PRD 2.1: Explorer type identification
  explorerType?: ExplorerType;
}

export interface UserProfile {
  bio?: string;
  phone?: string;
  location?: string;
  interests?: string[];
  languages?: string[];

  // Aligns with PRD 2.1: Explorer specific - Local/Foreign identification
  explorerType?: ExplorerType;
  travelPreferences?: string[];

  // Aligns with PRD 3.1: Service Provider specific - Core Company Profile
  companyName?: string;
  tradingName?: string;
  businessRegistrationNumber?: string;
  businessType?: string;
  mainContactPerson?: string;
  businessPhone?: string;
  businessEmail?: string;
  physicalAddress?: string;
  website?: string;
  serviceAreas?: string[];

  // Aligns with PRD 2.3: Community Guide specific
  expertise?: string[];
  guideRating?: number;
  totalGuideReviews?: number;
  guideSince?: string;
  isGuideApplicationPending?: boolean;
  guideApplicationDate?: string;

  // Additional fields for community guide application
  communityGuideApplication?: {
    // Personal Information
    yearsInZimbabwe: string;
    currentLocation: string;
    languagesSpoken: string[];

    // Expertise & Experience
    areasOfExpertise: string[];
    tourismExperience: string;
    previousGuideWork: string;
    localKnowledgeDescription: string;

    // Specializations
    preferredTourTypes: string[];
    specialSkills: string[];
    availabilityHours: string;
    transportationAccess: string;

    // References & Verification
    references: Array<{
      name: string;
      phone: string;
      relationship: string;
      yearsKnown: string;
    }>;
    motivationLetter: string;

    // Documents
    idDocument: File | null;
    certificatesOrTraining: File[];
    portfolioImages: File[];

    // Application metadata
    submittedAt?: string;
    status?: string;
  };

  // Guide application status
  guideApplicationStatus?: string;

  // Business documents for service providers
  businessDocuments?: Array<{
    type: string;
    file: File | null;
    status: "pending" | "uploaded" | "verified" | "rejected";
  }>;

  // Service provider onboarding fields
  onboardingCompleted?: boolean;
  basicReviewSubmitted?: boolean;
  basicReviewSubmittedAt?: string;
  businessDescription?: string;
  establishedYear?: string;
  numberOfEmployees?: string;
  businessCategory?: string;
  servicesOffered?: string[];
  operatingHours?: string;
  websiteUrl?: string;
  socialMediaLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  // Aligns with PRD 2.1: Optional Explorer location identification
  explorerType?: ExplorerType;
  // Aligns with PRD 3.1: Core Company Profile required fields for providers
  companyName?: string;
  tradingName?: string;
  businessRegistrationNumber?: string;
  mainContactPerson?: string;
  businessPhone?: string;
  businessEmail?: string;
  physicalAddress?: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isVerified: () => boolean;
}
