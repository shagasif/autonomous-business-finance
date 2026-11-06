import type { HealthCheckResponse, ApiError } from '../types/health';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiClient {
  private static readonly DEFAULT_TIMEOUT_MS = 6000;

  /**
   * Fetches health check metrics from backend GET /api/health
   */
  public static async getHealth(): Promise<HealthCheckResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let parsedMessage = `Backend returned HTTP ${response.status}: ${response.statusText}`;
        try {
          const jsonError = JSON.parse(errorText);
          parsedMessage = jsonError.message || parsedMessage;
        } catch {
          if (errorText) parsedMessage = errorText;
        }

        const err: ApiError = {
          statusCode: response.status,
          message: parsedMessage,
          timestamp: new Date().toISOString(),
        };
        throw err;
      }

      const data: HealthCheckResponse = await response.json();
      return data;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if ((err as Error)?.name === 'AbortError') {
        const timeoutError: ApiError = {
          statusCode: 408,
          message: `Connection timed out after ${this.DEFAULT_TIMEOUT_MS / 1000}s. Ensure the NestJS backend is running on port 3001.`,
          timestamp: new Date().toISOString(),
        };
        throw timeoutError;
      }

      if ((err as ApiError).message) {
        throw err;
      }

      const genericError: ApiError = {
        statusCode: 0,
        message:
          err instanceof Error
            ? err.message
            : 'Network connection failed. Verify the backend API server is reachable.',
        timestamp: new Date().toISOString(),
      };
      throw genericError;
    }
  }
}
