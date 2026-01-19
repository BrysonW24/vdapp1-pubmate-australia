import { AuthUser, AuthProvider } from '../../types/auth.types';

class SocialAuthServiceWeb {
    private mapMockUser(email: string, provider: AuthProvider): AuthUser {
        return {
            uid: `mock-${provider}-user-id`,
            email,
            phoneNumber: null,
            displayName: `Mock ${provider} User`,
            photoURL: null,
            emailVerified: true,
            phoneVerified: false,
            provider,
            createdAt: new Date(),
        };
    }

    async signInWithGoogle(): Promise<AuthUser> {
        console.log('Mock Social Auth Web: Google sign in');
        return this.mapMockUser('google@example.com', 'google');
    }

    async signInWithFacebook(): Promise<AuthUser> {
        console.log('Mock Social Auth Web: Facebook sign in');
        return this.mapMockUser('facebook@example.com', 'facebook');
    }

    async signInWithApple(): Promise<AuthUser> {
        console.log('Mock Social Auth Web: Apple sign in');
        return this.mapMockUser('apple@example.com', 'apple');
    }
}

export default new SocialAuthServiceWeb();
