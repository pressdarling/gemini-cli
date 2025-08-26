/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Interface for MCP OAuth tokens.
 */
export interface MCPOAuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType: string;
  scope?: string;
}

/**
 * Interface for stored MCP OAuth credentials.
 */
export interface MCPOAuthCredentials {
  serverName: string;
  token: MCPOAuthToken;
  clientId?: string;
  tokenUrl?: string;
  mcpServerUrl?: string;
  updatedAt: number;
}

export interface TokenStorage {
  getCredentials(serverName: string): Promise<MCPOAuthCredentials | null>;
  setCredentials(credentials: MCPOAuthCredentials): Promise<void>;
  deleteCredentials(serverName: string): Promise<void>;
  listServers(): Promise<string[]>;
  getAllCredentials(): Promise<Map<string, MCPOAuthCredentials>>;
  clearAll(): Promise<void>;
}
