import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

const STORAGE_KEYS = {
  USER: '@MedicalApp:user',
  TOKEN: '@MedicalApp:token',
  REGISTERED_USERS: '@MedicalApp:registeredUsers',
};

const mockDoctors = [
  {
    id: '1',
    name: 'Dr. João Silva',
    email: 'joao@example.com',
    role: 'doctor' as const,
    specialty: 'Cardiologia',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    email: 'maria@example.com',
    role: 'doctor' as const,
    specialty: 'Pediatria',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    email: 'pedro@example.com',
    role: 'doctor' as const,
    specialty: 'Ortopedia',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
];

const mockAdmin = {
  id: 'admin',
  name: 'Administrador',
  email: 'admin@example.com',
  role: 'admin' as const,
  image: 'https://randomuser.me/api/portraits/men/3.jpg',
};

let registeredUsers: User[] = [];

export const authService = {
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    if (credentials.email === mockAdmin.email && credentials.password === '123456') {
      return {
        user: mockAdmin,
        token: 'admin-token',
      };
    }

    const doctor = mockDoctors.find(
      (d) => d.email === credentials.email && credentials.password === '123456'
    );
    if (doctor) {
      return {
        user: doctor,
        token: `doctor-token-${doctor.id}`,
      };
    }

    const patient = registeredUsers.find(
      (p) => p.email === credentials.email && p.password === credentials.password
    );
    if (patient) {
      return {
        user: patient,
        token: `patient-token-${patient.id}`,
      };
    }

    throw new Error('Email ou senha inválidos');
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const emailExists =
      mockDoctors.some((d) => d.email === data.email) ||
      mockAdmin.email === data.email ||
      registeredUsers.some((u) => u.email === data.email);

    if (emailExists) {
      throw new Error('Email já está em uso');
    }

    const newPatient: User = {
      id: `patient-${registeredUsers.length + 1}`,
      name: data.name,
      email: data.email,
      role: 'patient',
      image: `https://randomuser.me/api/portraits/${registeredUsers.length % 2 === 0 ? 'men' : 'women'}/${registeredUsers.length + 1}.jpg`,
      password: data.password, // salva a senha
    };

    registeredUsers.push(newPatient);
    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));

    return {
      user: newPatient,
      token: `patient-token-${newPatient.id}`,
    };
  },

  async signOut(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  async getStoredUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userJson) {
        return JSON.parse(userJson);
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter usuário armazenado:', error);
      return null;
    }
  },

  async getAllUsers(): Promise<User[]> {
    return [...mockDoctors, ...registeredUsers];
  },

  async getAllDoctors(): Promise<User[]> {
    return mockDoctors;
  },

  async getPatients(): Promise<User[]> {
    return registeredUsers;
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
};
