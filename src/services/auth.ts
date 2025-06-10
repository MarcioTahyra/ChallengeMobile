import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

const STORAGE_KEYS = {
  REGISTERED_USERS: '@InvestApp:registeredUsers',
  USER: '@InvestApp:user',
  TOKEN: '@InvestApp:token',
};

let registeredUsers: User[] = [];

async function getRegisteredUsers(): Promise<User[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
  return data ? JSON.parse(data) : [];
}

async function setRegisteredUsers(users: User[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  registeredUsers = users;
}

export const authService = {
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    // Garante que os usuários estejam carregados
    if (registeredUsers.length === 0) {
      registeredUsers = await getRegisteredUsers();
    }

    const user = registeredUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    return {
      user,
      token: `token-${user.id}`,
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const users = await getRegisteredUsers();

    const emailExists = users.some((u) => u.email === data.email);
    if (emailExists) {
      throw new Error('Email já está em uso');
    }

    const newUser: User = {
      id: `user-${users.length + 1}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user',
    };

    const updatedUsers = [...users, newUser];
    await setRegisteredUsers(updatedUsers);

    return {
      user: newUser,
      token: `token-${newUser.id}`,
    };
  },

  async signOut(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  async getStoredUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Erro ao obter usuário armazenado:', error);
      return null;
    }
  },

  async loadRegisteredUsers(): Promise<void> {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (usersJson) {
        registeredUsers = JSON.parse(usersJson);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários registrados:', error);
    }
  },

  async getAllUsers(): Promise<User[]> {
    return getRegisteredUsers();
  },
};
