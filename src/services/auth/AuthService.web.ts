import {
    AuthUser,
    SignupCredentials,
    LoginCredentials,
    AuthProvider,
    ResetPasswordRequest,
    ChangePasswordRequest,
} from '../../types/auth.types';
import { User } from '../../types/user.types';

class AuthServiceWeb {
    private mapMockUser(email: string, displayName: string = 'Mock User'): AuthUser {
        return {
            uid: 'mock-user-id-' + Math.random().toString(36).substr(2, 9),
            email: email,
            phoneNumber: null,
            displayName: displayName,
            photoURL: null,
            emailVerified: true,
            phoneVerified: false,
            provider: 'email',
            createdAt: new Date(),
        };
    }

    async signUpWithEmail(credentials: SignupCredentials): Promise<AuthUser> {
        console.log('Mock Auth Web: Signing up', credentials.email);
        return this.mapMockUser(credentials.email);
    }

    async signInWithEmail(credentials: LoginCredentials): Promise<AuthUser> {
        console.log('Mock Auth Web: Signing in', credentials.email);
        return this.mapMockUser(credentials.email);
    }

    async signOut(): Promise<void> {
        console.log('Mock Auth Web: Signing out');
    }

    async resetPassword(request: ResetPasswordRequest): Promise<void> {
        console.log('Mock Auth Web: Resetting password for', request.email);
    }

    async changePassword(request: ChangePasswordRequest): Promise<void> {
        console.log('Mock Auth Web: Changing password');
    }

    getCurrentAuthUser(): AuthUser | null {
        return null;
    }

    async getUserData(uid: string): Promise<User | null> {
        return {
            uid,
            email: 'mock@example.com',
            firstName: 'Mock',
            lastName: 'User',
            phone: '',
            phoneVerified: false,
            dateOfBirth: new Date(),
            city: 'Sydney',
            postcode: '2000',
            foodDrinkPreferences: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            signupBonus: { claimed: true, amount: 10 },
            paymentMethods: [],
        };
    }

    async updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
        console.log('Mock Auth Web: Updating profile', data);
    }

    async updateDisplayProfile(displayName?: string, photoURL?: string): Promise<void> {
        console.log('Mock Auth Web: Updating display profile', displayName);
    }

    onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
        // Return empty unsubscribe function
        return () => { };
    }
}

export default new AuthServiceWeb();
