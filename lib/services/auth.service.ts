import { userRepository } from '../db/user.repository';
import { jwtSign, jwtVerify } from './jwt.service';

export const authService = {
  // Register user
  async register(data: { email: string; password: string; name?: string; phone?: string; image?: string }) {
    // Check if user exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create user
    const user = await userRepository.create(data);

    // Generate tokens
    const accessToken = jwtSign(
      { userId: user.id, email: user.email },
      { expiresIn: '24h' }
    );
    const refreshToken = jwtSign(
      { userId: user.id },
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  },

  // Login user
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await userRepository.verifyPassword(user.password, password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwtSign(
      { userId: user.id, email: user.email },
      { expiresIn: '24h' }
    );
    const refreshToken = jwtSign(
      { userId: user.id },
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
      accessToken,
      refreshToken,
    };
  },

  async loginWithGoogle(data: { email: string; name?: string; image?: string }) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      if (data.name && existingUser.name !== data.name) {
        await userRepository.update(existingUser.id, { name: data.name });
      }
      if (data.image && existingUser.image !== data.image) {
        await userRepository.update(existingUser.id, { image: data.image });
      }

      const accessToken = jwtSign(
        { userId: existingUser.id, email: existingUser.email },
        { expiresIn: '24h' }
      );
      const refreshToken = jwtSign(
        { userId: existingUser.id },
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          image: existingUser.image,
        },
        accessToken,
        refreshToken,
      };
    }

    const password = Math.random().toString(36).slice(2);
    const user = await userRepository.create({
      email: data.email,
      password,
      name: data.name,
      image: data.image,
    });

    const accessToken = jwtSign(
      { userId: user.id, email: user.email },
      { expiresIn: '24h' }
    );
    const refreshToken = jwtSign(
      { userId: user.id },
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
      accessToken,
      refreshToken,
    };
  },

  // Verify token
  async verifyToken(token: string) {
    return jwtVerify(token);
  },

  // Refresh token
  async refreshToken(refreshToken: string) {
    const decoded = jwtVerify(refreshToken) as any;
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = jwtSign(
      { userId: user.id, email: user.email },
      { expiresIn: '24h' }
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      city: user.city,
      postalCode: user.postalCode,
      country: user.country,
      addresses: user.addresses,
    };
  },

  // Update profile
  async updateProfile(
    userId: string,
    data: { name?: string; phone?: string; address?: string; city?: string; postalCode?: string; country?: string }
  ) {
    return userRepository.update(userId, data);
  },
};
