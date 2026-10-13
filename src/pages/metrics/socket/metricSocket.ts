import { Socket, io } from 'socket.io-client';
import { ACCOUNT_DISCONNECT, SYNCACCOUNT, SYNCACCOUNTDATA } from './socketsMessages';
import { BACKEND_URL } from '../../../utils/GlobalVars';

type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';
type ConnectionStatusListener = (status: ConnectionStatus) => void;

class MetricSocket {
  private static instance: MetricSocket | null = null;
  private socket: Socket | null = null;
  private connectionStatus: ConnectionStatus = 'disconnected';
  private connectionListeners: Set<ConnectionStatusListener> = new Set();
  private registeredListeners: Map<string, Set<(data: unknown) => void>> = new Map();

  private constructor() {
    // Private constructor for Singleton
  }

  public static getInstance(): MetricSocket {
    if (!MetricSocket.instance) {
      MetricSocket.instance = new MetricSocket();
    }
    return MetricSocket.instance;
  }

  // Get current connection status
  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // Subscribe to connection status changes
  public onConnectionStatusChange(listener: ConnectionStatusListener): () => void {
    this.connectionListeners.add(listener);
    // Immediately notify with current status
    listener(this.connectionStatus);

    // Return unsubscribe function
    return () => {
      this.connectionListeners.delete(listener);
    };
  }

  // Notify all connection status listeners
  private notifyConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.connectionListeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('Error in connection status listener:', error);
      }
    });
  }

  // Connect the socket using the token stored in localStorage
  connect() {
    const token = localStorage.getItem('token');

    if (token && token !== '' && !this.socket) {
      this.socket = io(BACKEND_URL, {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
        closeOnBeforeunload: true,
      });

      // Notify connected status
      this.socket.on('connect', () => {

        this.notifyConnectionStatus('connected');
      });

      // Listener for connection errors
      this.socket.on('connect_error', err => {
        console.error('Socket connection error:', err.message);
        this.notifyConnectionStatus('reconnecting');
        this.disconnect();
        this.reconnect();
      });

      // Listener for disconnections
      this.socket.on('disconnect', reason => {
        console.warn(`Socket disconnected: ${reason}`);
        this.notifyConnectionStatus('disconnected');
        this.reconnect();
      });

      // Ensure disconnection when closing the window
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }
  }

  // Handle beforeunload event
  private handleBeforeUnload = () => {
    this.disconnect();
  };

  // Disconnect the socket and remove all listeners
  disconnect() {
    if (this.socket) {
      this.socket.emit(ACCOUNT_DISCONNECT, {});
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
      this.notifyConnectionStatus('disconnected');

      // Clear registered listeners tracking
      this.registeredListeners.clear();
    }
  }

  // Attempt to reconnect the socket
  private reconnect() {

    this.notifyConnectionStatus('reconnecting');
    setTimeout(() => {
      if (!this.socket) {
        this.connect();
      }
    }, 5000);
  }

  // Register event listeners with cleanup tracking
  on(event: string, callback: (data: unknown) => void) {
    if (this.socket) {
      // Track registered listeners
      if (!this.registeredListeners.has(event)) {
        this.registeredListeners.set(event, new Set());
      }

      // Remove previous listener for this event to avoid duplicates
      this.socket.off(event);

      // Add new listener
      this.socket.on(event, callback);
      this.registeredListeners.get(event)?.add(callback);
    }
  }

  // Register a listener with proper cleanup support
  registerListener(event: string, callback: (data: unknown) => void): () => void {
    if (this.socket) {
      // Track the listener
      if (!this.registeredListeners.has(event)) {
        this.registeredListeners.set(event, new Set());
      }

      const listeners = this.registeredListeners.get(event)!;
      listeners.add(callback);

      // Add the listener to socket
      this.socket.on(event, callback);

      // Return cleanup function
      return () => {
        listeners.delete(callback);
        if (this.socket) {
          this.socket.off(event, callback);
        }
      };
    }

    // Return no-op cleanup if no socket
    return () => {};
  }

  // Unregister a specific event
  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
      this.registeredListeners.delete(event);
    }
  }

  // Emit event to sync the account
  syncAccount(account: string) {
    if (account && this.socket) {
      this.socket.emit(SYNCACCOUNT, { account });
    }
  }

  // Emit event to sync account data
  syncAccountData(account: unknown) {
    if (account && this.socket) {

      this.socket.emit(SYNCACCOUNTDATA, { account });
    }
  }

  // Check if socket is connected
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Get all registered event names
  getRegisteredEvents(): string[] {
    return Array.from(this.registeredListeners.keys());
  }

  // Clean up all listeners for a specific event
  cleanupEvent(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
    this.registeredListeners.delete(event);
  }
}

export default MetricSocket;
