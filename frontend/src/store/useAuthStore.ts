import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { io } from 'socket.io-client';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isLoggingIn: false,
  tasks: null,
  socket: null,

  login: async (data: { username: string; password: string }) => {
    set({ isLoggingIn: true });
    const response = await axiosInstance.post('/auth/login', data);
    set({ authUser: response.data });
    get().connectSocket();
    set({ isLoggingIn: false });
  },
  getTasks: async () => {
    const response = await axiosInstance.get('/tasks');
    set({ tasks: response.data });
  },
  sendFile: async (formData) => {
    const token = get().authUser;
    await axiosInstance.post('http://localhost:3000/tasks/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  },
  connectSocket: () => {
    // const { authUser } = get();
    // if (!authUser || get().socket?.connected) return;

    const socket = io('http://localhost:3000');
    socket.connect();
    set({ socket: socket });

    socket.on('taskCreated', (newTask) => {
      set((state) => ({
        tasks: [...state.tasks, newTask],
      }));
    });

    socket.on('taskUpdated', (updatedTask) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ),
      }));
    });
  },
}));
