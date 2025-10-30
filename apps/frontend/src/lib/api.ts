const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface LoginCredentials {
   email?: string;
   phone?: string;
   password: string;
}

export interface AuthResponse {
   user: {
      id: string;
      email: string;
      name: string;
      phone?: string;
   };
   token: string;
   exp: number;
}

export class ApiError extends Error {
   constructor(
      message: string,
      public status: number,
   ) {
      super(message);
      this.name = 'ApiError';
   }
}

// Função helper para fazer requisições autenticadas
function getAuthHeaders(): HeadersInit {
   const headers: HeadersInit = {
      'Content-Type': 'application/json',
   };

   // Adicionar token JWT se existir
   if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
         headers.Authorization = `JWT ${token}`;
      }
   }

   return headers;
}

// Wrapper para fetch com autenticação automática
export async function authenticatedFetch(
   url: string,
   options: RequestInit = {},
): Promise<Response> {
   const headers = {
      ...getAuthHeaders(),
      ...options.headers,
   };

   return fetch(url, {
      ...options,
      headers,
   });
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
   try {
      const response = await fetch(`${API_URL}/api/users/login`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
         throw new ApiError(data.errors?.[0]?.message || 'Erro ao fazer login', response.status);
      }

      return data;
   } catch (error) {
      if (error instanceof ApiError) {
         throw error;
      }
      throw new ApiError('Erro de conexão com o servidor', 500);
   }
}

export async function logoutUser(token: string): Promise<void> {
   try {
      await fetch(`${API_URL}/api/users/logout`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${token}`,
         },
      });
   } catch (error) {
      console.error('Erro ao fazer logout:', error);
   }
}

export async function getCurrentUser(token: string): Promise<AuthResponse['user'] | null> {
   try {
      const response = await fetch(`${API_URL}/api/users/me`, {
         headers: {
            Authorization: `JWT ${token}`,
         },
      });

      if (!response.ok) {
         return null;
      }

      const data = await response.json();
      return data.user;
   } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
   }
}

// Exemplo de função usando authenticatedFetch
export async function getPublications() {
   try {
      const response = await authenticatedFetch(`${API_URL}/api/publications`);

      if (!response.ok) {
         throw new ApiError('Erro ao buscar publicações', response.status);
      }

      return response.json();
   } catch (error) {
      if (error instanceof ApiError) {
         throw error;
      }
      throw new ApiError('Erro de conexão com o servidor', 500);
   }
}
