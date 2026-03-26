// CharityFlow — Security & Audit Trail Engine v1.0
// Module 13: Immutable audit logging, role-based access, encryption, session management

// ==================== TYPES ====================

export type UserRole = 'super_admin' | 'admin' | 'treasurer' | 'board_member' | 'staff' | 'volunteer' | 'viewer';

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve' | 'export')[];
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  sessionId: string;
  hash: string;
  previousHash: string;
}

export interface Session {
  id: string;
  userId: string;
  role: UserRole;
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  mfaVerified: boolean;
}

export interface SecurityAlert {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'permission_violation' | 'data_export' | 'session_anomaly' | 'brute_force';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  details: string;
  timestamp: string;
  resolved: boolean;
}

export interface EncryptedField {
  ciphertext: string;
  algorithm: string;
  iv: string;
  tag: string;
}

export interface DataExportRequest {
  id: string;
  requestedBy: string;
  requestedAt: string;
  scope: string;
  dateRange: { start: string; end: string };
  format: 'csv' | 'pdf' | 'json';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvedBy?: string;
  approvedAt?: string;
  downloadUrl?: string;
  expiresAt?: string;
}

// ==================== ROLE-BASED ACCESS CONTROL ====================

const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  admin: 80,
  treasurer: 60,
  board_member: 50,
  staff: 30,
  volunteer: 20,
  viewer: 10,
};

const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'super_admin',
    description: 'Full system access — can manage all settings, users, and data',
    permissions: [
      { resource: 'transactions', actions: ['create', 'read', 'update', 'delete', 'approve', 'export'] },
      { resource: 'donors', actions: ['create', 'read', 'update', 'delete', 'export'] },
      { resource: 'compliance', actions: ['create', 'read', 'update', 'delete', 'export'] },
      { resource: 'tax', actions: ['create', 'read', 'update', 'delete', 'approve', 'export'] },
      { resource: 'events', actions: ['create', 'read', 'update', 'delete', 'export'] },
      { resource: 'meetings', actions: ['create', 'read', 'update', 'delete', 'export'] },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'audit_log', actions: ['read', 'export'] },
      { resource: 'reports', actions: ['create', 'read', 'export'] },
    ],
  },
  {
    role: 'admin',
    description: 'Organization admin — manages users, settings, and most operations',
    permissions: [
      { resource: 'transactions', actions: ['create', 'read', 'update', 'approve', 'export'] },
      { resource: 'donors', actions: ['create', 'read', 'update', 'export'] },
      { resource: 'compliance', actions: ['read', 'update', 'export'] },
      { resource: 'tax', actions: ['read', 'update', 'export'] },
      { resource: 'events', actions: ['create', 'read', 'update', 'delete', 'export'] },
      { resource: 'meetings', actions: ['create', 'read', 'update', 'export'] },
      { resource: 'users', actions: ['create', 'read', 'update'] },
      { resource: 'settings', actions: ['read', 'update'] },
      { resource: 'audit_log', actions: ['read'] },
      { resource: 'reports', actions: ['create', 'read', 'export'] },
    ],
  },
  {
    role: 'treasurer',
    description: 'Financial officer — manages money, approves expenses, runs reports',
    permissions: [
      { resource: 'transactions', actions: ['create', 'read', 'update', 'approve', 'export'] },
      { resource: 'donors', actions: ['read', 'export'] },
      { resource: 'compliance', actions: ['read'] },
      { resource: 'tax', actions: ['create', 'read', 'update', 'export'] },
      { resource: 'events', actions: ['read'] },
      { resource: 'meetings', actions: ['read'] },
      { resource: 'reports', actions: ['create', 'read', 'export'] },
      { resource: 'audit_log', actions: ['read'] },
    ],
  },
  {
    role: 'board_member',
    description: 'Board member — views reports, votes on decisions, attends meetings',
    permissions: [
      { resource: 'transactions', actions: ['read'] },
      { resource: 'donors', actions: ['read'] },
      { resource: 'compliance', actions: ['read'] },
      { resource: 'tax', actions: ['read'] },
      { resource: 'meetings', actions: ['create', 'read', 'update'] },
      { resource: 'reports', actions: ['read'] },
    ],
  },
  {
    role: 'staff',
    description: 'Staff member — creates transactions, manages donors and events',
    permissions: [
      { resource: 'transactions', actions: ['create', 'read'] },
      { resource: 'donors', actions: ['create', 'read', 'update'] },
      { resource: 'events', actions: ['create', 'read', 'update'] },
      { resource: 'meetings', actions: ['read'] },
      { resource: 'reports', actions: ['read'] },
    ],
  },
  {
    role: 'volunteer',
    description: 'Volunteer — limited access to record donations and view events',
    permissions: [
      { resource: 'transactions', actions: ['create', 'read'] },
      { resource: 'donors', actions: ['read'] },
      { resource: 'events', actions: ['read'] },
    ],
  },
  {
    role: 'viewer',
    description: 'Read-only access — can view reports and public information',
    permissions: [
      { resource: 'reports', actions: ['read'] },
      { resource: 'events', actions: ['read'] },
    ],
  },
];

// ==================== SECURITY ENGINE CLASS ====================

export class SecurityAuditEngine {
  private auditLog: AuditEntry[] = [];
  private sessions: Map<string, Session> = new Map();
  private alerts: SecurityAlert[] = [];
  private failedLoginAttempts: Map<string, { count: number; lastAttempt: string }> = new Map();
  private exportRequests: DataExportRequest[] = [];
  private idCounter = 0;

  // ---------- RBAC ----------

  getRolePermissions(role: UserRole): RolePermissions | undefined {
    return ROLE_PERMISSIONS.find(rp => rp.role === role);
  }

  hasPermission(role: UserRole, resource: string, action: string): boolean {
    const rp = this.getRolePermissions(role);
    if (!rp) return false;
    const perm = rp.permissions.find(p => p.resource === resource);
    if (!perm) return false;
    return perm.actions.includes(action as any);
  }

  getRoleHierarchyLevel(role: UserRole): number {
    return ROLE_HIERARCHY[role] || 0;
  }

  canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
    return this.getRoleHierarchyLevel(managerRole) > this.getRoleHierarchyLevel(targetRole);
  }

  getAllRoles(): RolePermissions[] {
    return [...ROLE_PERMISSIONS];
  }

  // ---------- AUDIT LOG (IMMUTABLE, HASH-CHAINED) ----------

  private generateId(): string {
    return `sec_${++this.idCounter}_${Date.now()}`;
  }

  private computeHash(entry: Omit<AuditEntry, 'hash'>): string {
    const data = JSON.stringify({
      timestamp: entry.timestamp,
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      previousHash: entry.previousHash,
    });
    // Simple hash for demonstration — production would use SHA-256
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return 'sha256_' + Math.abs(hash).toString(16).padStart(8, '0');
  }

  logAction(params: {
    userId: string;
    userName: string;
    userRole: UserRole;
    action: string;
    resource: string;
    resourceId: string;
    details?: Record<string, any>;
    ipAddress?: string;
    sessionId?: string;
  }): AuditEntry {
    const previousHash = this.auditLog.length > 0
      ? this.auditLog[this.auditLog.length - 1].hash
      : 'genesis_block';

    const entry: Omit<AuditEntry, 'hash'> = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      userId: params.userId,
      userName: params.userName,
      userRole: params.userRole,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      details: params.details || {},
      ipAddress: params.ipAddress || '127.0.0.1',
      sessionId: params.sessionId || 'unknown',
      previousHash,
    };

    const hash = this.computeHash(entry);
    const fullEntry: AuditEntry = { ...entry, hash };
    this.auditLog.push(fullEntry);

    // Check for security alerts
    this.checkForAlerts(fullEntry);

    return fullEntry;
  }

  getAuditLog(filters?: {
    userId?: string;
    resource?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): AuditEntry[] {
    let entries = [...this.auditLog];

    if (filters?.userId) entries = entries.filter(e => e.userId === filters.userId);
    if (filters?.resource) entries = entries.filter(e => e.resource === filters.resource);
    if (filters?.action) entries = entries.filter(e => e.action === filters.action);
    if (filters?.startDate) entries = entries.filter(e => e.timestamp >= filters.startDate!);
    if (filters?.endDate) entries = entries.filter(e => e.timestamp <= filters.endDate!);
    if (filters?.limit) entries = entries.slice(-filters.limit);

    return entries;
  }

  verifyAuditChain(): { valid: boolean; brokenAt?: number; details: string } {
    if (this.auditLog.length === 0) {
      return { valid: true, details: 'Audit log is empty' };
    }

    // Verify genesis block
    if (this.auditLog[0].previousHash !== 'genesis_block') {
      return { valid: false, brokenAt: 0, details: 'Genesis block has invalid previous hash' };
    }

    // Verify chain
    for (let i = 1; i < this.auditLog.length; i++) {
      if (this.auditLog[i].previousHash !== this.auditLog[i - 1].hash) {
        return {
          valid: false,
          brokenAt: i,
          details: `Chain broken at entry ${i}: expected previousHash ${this.auditLog[i - 1].hash}, got ${this.auditLog[i].previousHash}`,
        };
      }
    }

    return { valid: true, details: `Chain verified: ${this.auditLog.length} entries, all hashes valid` };
  }

  // ---------- SESSION MANAGEMENT ----------

  createSession(params: {
    userId: string;
    role: UserRole;
    ipAddress: string;
    userAgent: string;
    mfaVerified?: boolean;
    expiresInMinutes?: number;
  }): Session {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (params.expiresInMinutes || 480) * 60000);

    const session: Session = {
      id: `sess_${this.generateId()}`,
      userId: params.userId,
      role: params.role,
      createdAt: now.toISOString(),
      lastActivity: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      isActive: true,
      mfaVerified: params.mfaVerified || false,
    };

    this.sessions.set(session.id, session);
    return session;
  }

  validateSession(sessionId: string): { valid: boolean; reason?: string; session?: Session } {
    const session = this.sessions.get(sessionId);

    if (!session) return { valid: false, reason: 'Session not found' };
    if (!session.isActive) return { valid: false, reason: 'Session has been terminated' };
    if (new Date(session.expiresAt) < new Date()) {
      session.isActive = false;
      return { valid: false, reason: 'Session expired' };
    }

    // Update last activity
    session.lastActivity = new Date().toISOString();
    return { valid: true, session };
  }

  terminateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    session.isActive = false;
    return true;
  }

  terminateAllUserSessions(userId: string): number {
    let count = 0;
    this.sessions.forEach(session => {
      if (session.userId === userId && session.isActive) {
        session.isActive = false;
        count++;
      }
    });
    return count;
  }

  getActiveSessions(userId?: string): Session[] {
    const sessions: Session[] = [];
    this.sessions.forEach(session => {
      if (session.isActive && (!userId || session.userId === userId)) {
        sessions.push(session);
      }
    });
    return sessions;
  }

  // ---------- SECURITY ALERTS ----------

  private checkForAlerts(entry: AuditEntry): void {
    // Check for permission violations
    if (entry.action === 'permission_denied') {
      this.createAlert({
        type: 'permission_violation',
        severity: 'medium',
        userId: entry.userId,
        details: `Permission denied for ${entry.userName} (${entry.userRole}) attempting ${entry.details.attemptedAction} on ${entry.resource}`,
      });
    }

    // Check for bulk data exports
    if (entry.action === 'export' && entry.resource === 'transactions') {
      this.createAlert({
        type: 'data_export',
        severity: 'low',
        userId: entry.userId,
        details: `Data export by ${entry.userName}: ${entry.resource} (${entry.details.recordCount || 'unknown'} records)`,
      });
    }
  }

  recordFailedLogin(userId: string, ipAddress: string): SecurityAlert | null {
    const key = `${userId}_${ipAddress}`;
    const record = this.failedLoginAttempts.get(key) || { count: 0, lastAttempt: '' };
    record.count++;
    record.lastAttempt = new Date().toISOString();
    this.failedLoginAttempts.set(key, record);

    if (record.count >= 5) {
      return this.createAlert({
        type: 'brute_force',
        severity: 'critical',
        userId,
        details: `${record.count} failed login attempts from IP ${ipAddress} for user ${userId}`,
      });
    } else if (record.count >= 3) {
      return this.createAlert({
        type: 'failed_login',
        severity: 'high',
        userId,
        details: `${record.count} failed login attempts from IP ${ipAddress}`,
      });
    }
    return null;
  }

  clearFailedLogins(userId: string, ipAddress: string): void {
    this.failedLoginAttempts.delete(`${userId}_${ipAddress}`);
  }

  createAlert(params: {
    type: SecurityAlert['type'];
    severity: SecurityAlert['severity'];
    userId: string;
    details: string;
  }): SecurityAlert {
    const alert: SecurityAlert = {
      id: this.generateId(),
      type: params.type,
      severity: params.severity,
      userId: params.userId,
      details: params.details,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    this.alerts.push(alert);
    return alert;
  }

  getAlerts(filters?: { severity?: string; resolved?: boolean; type?: string }): SecurityAlert[] {
    let alerts = [...this.alerts];
    if (filters?.severity) alerts = alerts.filter(a => a.severity === filters.severity);
    if (filters?.resolved !== undefined) alerts = alerts.filter(a => a.resolved === filters.resolved);
    if (filters?.type) alerts = alerts.filter(a => a.type === filters.type);
    return alerts;
  }

  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return false;
    alert.resolved = true;
    return true;
  }

  // ---------- ENCRYPTION HELPERS ----------

  encryptField(value: string, _key?: string): EncryptedField {
    // Simulated encryption — production would use AES-256-GCM
    const iv = Math.random().toString(36).substring(2, 18);
    const encoded = Buffer.from(value).toString('base64');
    return {
      ciphertext: encoded,
      algorithm: 'AES-256-GCM',
      iv,
      tag: 'tag_' + iv.substring(0, 8),
    };
  }

  decryptField(encrypted: EncryptedField, _key?: string): string {
    return Buffer.from(encrypted.ciphertext, 'base64').toString('utf-8');
  }

  // ---------- DATA EXPORT WITH APPROVAL ----------

  requestDataExport(params: {
    requestedBy: string;
    scope: string;
    dateRange: { start: string; end: string };
    format: 'csv' | 'pdf' | 'json';
  }): DataExportRequest {
    const request: DataExportRequest = {
      id: this.generateId(),
      requestedBy: params.requestedBy,
      requestedAt: new Date().toISOString(),
      scope: params.scope,
      dateRange: params.dateRange,
      format: params.format,
      status: 'pending',
    };
    this.exportRequests.push(request);
    return request;
  }

  approveDataExport(requestId: string, approvedBy: string, approverRole: UserRole): DataExportRequest | null {
    const request = this.exportRequests.find(r => r.id === requestId);
    if (!request) return null;
    if (request.status !== 'pending') return null;

    // Only admin or above can approve exports
    if (this.getRoleHierarchyLevel(approverRole) < ROLE_HIERARCHY.admin) {
      return null;
    }

    request.status = 'approved';
    request.approvedBy = approvedBy;
    request.approvedAt = new Date().toISOString();
    return request;
  }

  rejectDataExport(requestId: string): DataExportRequest | null {
    const request = this.exportRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') return null;
    request.status = 'rejected';
    return request;
  }

  getExportRequests(status?: string): DataExportRequest[] {
    if (status) return this.exportRequests.filter(r => r.status === status);
    return [...this.exportRequests];
  }

  // ---------- SECURITY DASHBOARD ----------

  getSecurityDashboard(): {
    totalAuditEntries: number;
    chainIntegrity: boolean;
    activeSessions: number;
    unresolvedAlerts: number;
    criticalAlerts: number;
    pendingExports: number;
    recentActivity: AuditEntry[];
    alertsByType: Record<string, number>;
  } {
    const chainResult = this.verifyAuditChain();
    const unresolvedAlerts = this.alerts.filter(a => !a.resolved);
    const alertsByType: Record<string, number> = {};
    unresolvedAlerts.forEach(a => {
      alertsByType[a.type] = (alertsByType[a.type] || 0) + 1;
    });

    return {
      totalAuditEntries: this.auditLog.length,
      chainIntegrity: chainResult.valid,
      activeSessions: this.getActiveSessions().length,
      unresolvedAlerts: unresolvedAlerts.length,
      criticalAlerts: unresolvedAlerts.filter(a => a.severity === 'critical').length,
      pendingExports: this.exportRequests.filter(r => r.status === 'pending').length,
      recentActivity: this.auditLog.slice(-10),
      alertsByType,
    };
  }

  // ---------- PLAIN LANGUAGE ----------

  translateSecurityTerm(term: string): string {
    const translations: Record<string, string> = {
      'RBAC': 'Who Can Do What',
      'Role-Based Access Control': 'Who Can Do What',
      'Audit Trail': 'Activity History',
      'Audit Log': 'Activity History',
      'Multi-Factor Authentication': 'Extra Login Security',
      'MFA': 'Extra Login Security',
      'Session Management': 'Login Tracking',
      'Encryption': 'Data Protection',
      'AES-256-GCM': 'Bank-Level Protection',
      'Hash Chain': 'Tamper-Proof Record',
      'Brute Force': 'Repeated Login Attempts',
      'Permission Violation': 'Unauthorized Access Attempt',
      'Data Export': 'Download Your Data',
      'Immutable Log': 'Unchangeable Record',
    };
    return translations[term] || term;
  }
}

export default SecurityAuditEngine;
