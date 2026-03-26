// CharityFlow — Security & Audit Trail Engine Tests
// Module 13: 45 executable test cases including Oklahoma × 3 org types

import { SecurityAuditEngine } from '../lib/security/security-audit-engine';
import type { UserRole } from '../lib/security/security-audit-engine';

describe('SecurityAuditEngine', () => {
  let engine: SecurityAuditEngine;

  beforeEach(() => {
    engine = new SecurityAuditEngine();
  });

  // ==================== RBAC TESTS ====================

  describe('Role-Based Access Control', () => {
    test('super_admin has full access to all resources', () => {
      expect(engine.hasPermission('super_admin', 'transactions', 'delete')).toBe(true);
      expect(engine.hasPermission('super_admin', 'users', 'delete')).toBe(true);
      expect(engine.hasPermission('super_admin', 'audit_log', 'export')).toBe(true);
      expect(engine.hasPermission('super_admin', 'settings', 'update')).toBe(true);
    });

    test('volunteer has limited access', () => {
      expect(engine.hasPermission('volunteer', 'transactions', 'create')).toBe(true);
      expect(engine.hasPermission('volunteer', 'transactions', 'read')).toBe(true);
      expect(engine.hasPermission('volunteer', 'transactions', 'delete')).toBe(false);
      expect(engine.hasPermission('volunteer', 'users', 'create')).toBe(false);
      expect(engine.hasPermission('volunteer', 'settings', 'update')).toBe(false);
    });

    test('viewer has read-only access', () => {
      expect(engine.hasPermission('viewer', 'reports', 'read')).toBe(true);
      expect(engine.hasPermission('viewer', 'events', 'read')).toBe(true);
      expect(engine.hasPermission('viewer', 'transactions', 'read')).toBe(false);
      expect(engine.hasPermission('viewer', 'transactions', 'create')).toBe(false);
    });

    test('treasurer can approve transactions but not manage users', () => {
      expect(engine.hasPermission('treasurer', 'transactions', 'approve')).toBe(true);
      expect(engine.hasPermission('treasurer', 'transactions', 'export')).toBe(true);
      expect(engine.hasPermission('treasurer', 'users', 'create')).toBe(false);
    });

    test('board_member can access meetings and reports', () => {
      expect(engine.hasPermission('board_member', 'meetings', 'create')).toBe(true);
      expect(engine.hasPermission('board_member', 'reports', 'read')).toBe(true);
      expect(engine.hasPermission('board_member', 'transactions', 'read')).toBe(true);
      expect(engine.hasPermission('board_member', 'transactions', 'create')).toBe(false);
    });

    test('role hierarchy is correct', () => {
      expect(engine.getRoleHierarchyLevel('super_admin')).toBe(100);
      expect(engine.getRoleHierarchyLevel('admin')).toBe(80);
      expect(engine.getRoleHierarchyLevel('viewer')).toBe(10);
      expect(engine.canManageRole('admin', 'staff')).toBe(true);
      expect(engine.canManageRole('staff', 'admin')).toBe(false);
      expect(engine.canManageRole('volunteer', 'volunteer')).toBe(false);
    });

    test('returns all 7 roles', () => {
      const roles = engine.getAllRoles();
      expect(roles).toHaveLength(7);
      expect(roles.map(r => r.role)).toContain('super_admin');
      expect(roles.map(r => r.role)).toContain('viewer');
    });

    test('invalid resource returns false', () => {
      expect(engine.hasPermission('super_admin', 'nonexistent_resource', 'read')).toBe(false);
    });
  });

  // ==================== AUDIT LOG TESTS ====================

  describe('Immutable Audit Log', () => {
    test('creates audit entry with hash chain', () => {
      const entry = engine.logAction({
        userId: 'user1', userName: 'Alice', userRole: 'admin',
        action: 'create', resource: 'transactions', resourceId: 'txn_001',
        details: { amount: 500 },
      });
      expect(entry.id).toBeDefined();
      expect(entry.hash).toMatch(/^sha256_/);
      expect(entry.previousHash).toBe('genesis_block');
    });

    test('chain links entries correctly', () => {
      const entry1 = engine.logAction({
        userId: 'user1', userName: 'Alice', userRole: 'admin',
        action: 'create', resource: 'transactions', resourceId: 'txn_001',
      });
      const entry2 = engine.logAction({
        userId: 'user2', userName: 'Bob', userRole: 'treasurer',
        action: 'approve', resource: 'transactions', resourceId: 'txn_001',
      });
      expect(entry2.previousHash).toBe(entry1.hash);
    });

    test('verifyAuditChain passes for valid chain', () => {
      engine.logAction({ userId: 'u1', userName: 'A', userRole: 'admin', action: 'create', resource: 'tx', resourceId: '1' });
      engine.logAction({ userId: 'u2', userName: 'B', userRole: 'staff', action: 'read', resource: 'tx', resourceId: '1' });
      engine.logAction({ userId: 'u3', userName: 'C', userRole: 'treasurer', action: 'approve', resource: 'tx', resourceId: '1' });
      const result = engine.verifyAuditChain();
      expect(result.valid).toBe(true);
      expect(result.details).toContain('3 entries');
    });

    test('filters audit log by userId', () => {
      engine.logAction({ userId: 'u1', userName: 'A', userRole: 'admin', action: 'create', resource: 'tx', resourceId: '1' });
      engine.logAction({ userId: 'u2', userName: 'B', userRole: 'staff', action: 'read', resource: 'tx', resourceId: '2' });
      engine.logAction({ userId: 'u1', userName: 'A', userRole: 'admin', action: 'update', resource: 'tx', resourceId: '1' });
      const filtered = engine.getAuditLog({ userId: 'u1' });
      expect(filtered).toHaveLength(2);
    });

    test('filters audit log by resource', () => {
      engine.logAction({ userId: 'u1', userName: 'A', userRole: 'admin', action: 'create', resource: 'transactions', resourceId: '1' });
      engine.logAction({ userId: 'u1', userName: 'A', userRole: 'admin', action: 'create', resource: 'donors', resourceId: '2' });
      const filtered = engine.getAuditLog({ resource: 'donors' });
      expect(filtered).toHaveLength(1);
    });
  });

  // ==================== SESSION MANAGEMENT TESTS ====================

  describe('Session Management', () => {
    test('creates session with correct expiration', () => {
      const session = engine.createSession({
        userId: 'user1', role: 'admin', ipAddress: '192.168.1.1',
        userAgent: 'Chrome/120', expiresInMinutes: 60,
      });
      expect(session.isActive).toBe(true);
      expect(session.mfaVerified).toBe(false);
      expect(session.role).toBe('admin');
    });

    test('validates active session', () => {
      const session = engine.createSession({
        userId: 'user1', role: 'admin', ipAddress: '192.168.1.1', userAgent: 'Chrome',
      });
      const result = engine.validateSession(session.id);
      expect(result.valid).toBe(true);
      expect(result.session?.userId).toBe('user1');
    });

    test('rejects non-existent session', () => {
      const result = engine.validateSession('fake_session');
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Session not found');
    });

    test('terminates session', () => {
      const session = engine.createSession({
        userId: 'user1', role: 'admin', ipAddress: '1.1.1.1', userAgent: 'Chrome',
      });
      engine.terminateSession(session.id);
      const result = engine.validateSession(session.id);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Session has been terminated');
    });

    test('terminates all user sessions', () => {
      engine.createSession({ userId: 'user1', role: 'admin', ipAddress: '1.1.1.1', userAgent: 'Chrome' });
      engine.createSession({ userId: 'user1', role: 'admin', ipAddress: '2.2.2.2', userAgent: 'Firefox' });
      engine.createSession({ userId: 'user2', role: 'staff', ipAddress: '3.3.3.3', userAgent: 'Safari' });
      const terminated = engine.terminateAllUserSessions('user1');
      expect(terminated).toBe(2);
      expect(engine.getActiveSessions('user1')).toHaveLength(0);
      expect(engine.getActiveSessions('user2')).toHaveLength(1);
    });
  });

  // ==================== SECURITY ALERTS TESTS ====================

  describe('Security Alerts', () => {
    test('triggers alert after 3 failed logins', () => {
      engine.recordFailedLogin('user1', '1.1.1.1');
      engine.recordFailedLogin('user1', '1.1.1.1');
      const alert = engine.recordFailedLogin('user1', '1.1.1.1');
      expect(alert).not.toBeNull();
      expect(alert!.severity).toBe('high');
      expect(alert!.type).toBe('failed_login');
    });

    test('triggers critical alert after 5 failed logins (brute force)', () => {
      for (let i = 0; i < 4; i++) engine.recordFailedLogin('user1', '1.1.1.1');
      const alert = engine.recordFailedLogin('user1', '1.1.1.1');
      expect(alert).not.toBeNull();
      expect(alert!.severity).toBe('critical');
      expect(alert!.type).toBe('brute_force');
    });

    test('clears failed logins on success', () => {
      engine.recordFailedLogin('user1', '1.1.1.1');
      engine.recordFailedLogin('user1', '1.1.1.1');
      engine.clearFailedLogins('user1', '1.1.1.1');
      const alert = engine.recordFailedLogin('user1', '1.1.1.1');
      expect(alert).toBeNull(); // Only 1 attempt after clear
    });

    test('resolves alert', () => {
      const alert = engine.createAlert({
        type: 'suspicious_activity', severity: 'medium',
        userId: 'user1', details: 'Unusual access pattern',
      });
      expect(engine.resolveAlert(alert.id)).toBe(true);
      expect(engine.getAlerts({ resolved: true })).toHaveLength(1);
    });

    test('filters alerts by severity', () => {
      engine.createAlert({ type: 'failed_login', severity: 'low', userId: 'u1', details: 'test' });
      engine.createAlert({ type: 'brute_force', severity: 'critical', userId: 'u2', details: 'test' });
      const critical = engine.getAlerts({ severity: 'critical' });
      expect(critical).toHaveLength(1);
      expect(critical[0].type).toBe('brute_force');
    });
  });

  // ==================== ENCRYPTION TESTS ====================

  describe('Field Encryption', () => {
    test('encrypts and decrypts field correctly', () => {
      const original = 'SSN-123-45-6789';
      const encrypted = engine.encryptField(original);
      expect(encrypted.algorithm).toBe('AES-256-GCM');
      expect(encrypted.ciphertext).not.toBe(original);
      const decrypted = engine.decryptField(encrypted);
      expect(decrypted).toBe(original);
    });

    test('different encryptions produce different IVs', () => {
      const enc1 = engine.encryptField('test');
      const enc2 = engine.encryptField('test');
      expect(enc1.iv).not.toBe(enc2.iv);
    });
  });

  // ==================== DATA EXPORT TESTS ====================

  describe('Data Export with Approval', () => {
    test('creates pending export request', () => {
      const request = engine.requestDataExport({
        requestedBy: 'user1', scope: 'transactions',
        dateRange: { start: '2026-01-01', end: '2026-03-31' }, format: 'csv',
      });
      expect(request.status).toBe('pending');
      expect(request.format).toBe('csv');
    });

    test('admin can approve export', () => {
      const request = engine.requestDataExport({
        requestedBy: 'user1', scope: 'transactions',
        dateRange: { start: '2026-01-01', end: '2026-03-31' }, format: 'pdf',
      });
      const approved = engine.approveDataExport(request.id, 'admin1', 'admin');
      expect(approved).not.toBeNull();
      expect(approved!.status).toBe('approved');
    });

    test('volunteer cannot approve export', () => {
      const request = engine.requestDataExport({
        requestedBy: 'user1', scope: 'donors',
        dateRange: { start: '2026-01-01', end: '2026-03-31' }, format: 'json',
      });
      const result = engine.approveDataExport(request.id, 'vol1', 'volunteer');
      expect(result).toBeNull();
    });

    test('rejects export request', () => {
      const request = engine.requestDataExport({
        requestedBy: 'user1', scope: 'all',
        dateRange: { start: '2026-01-01', end: '2026-12-31' }, format: 'csv',
      });
      const rejected = engine.rejectDataExport(request.id);
      expect(rejected).not.toBeNull();
      expect(rejected!.status).toBe('rejected');
    });
  });

  // ==================== PLAIN LANGUAGE TESTS ====================

  describe('Plain Language Translation', () => {
    test('translates security terms', () => {
      expect(engine.translateSecurityTerm('RBAC')).toBe('Who Can Do What');
      expect(engine.translateSecurityTerm('Audit Trail')).toBe('Activity History');
      expect(engine.translateSecurityTerm('MFA')).toBe('Extra Login Security');
      expect(engine.translateSecurityTerm('AES-256-GCM')).toBe('Bank-Level Protection');
    });

    test('returns original for unknown terms', () => {
      expect(engine.translateSecurityTerm('Custom Term')).toBe('Custom Term');
    });
  });

  // ==================== SECURITY DASHBOARD ====================

  describe('Security Dashboard', () => {
    test('returns comprehensive dashboard', () => {
      engine.logAction({ userId: 'u1', userName: 'A', userRole: 'admin', action: 'create', resource: 'tx', resourceId: '1' });
      engine.createSession({ userId: 'u1', role: 'admin', ipAddress: '1.1.1.1', userAgent: 'Chrome' });
      engine.createAlert({ type: 'failed_login', severity: 'high', userId: 'u1', details: 'test' });

      const dashboard = engine.getSecurityDashboard();
      expect(dashboard.totalAuditEntries).toBe(1);
      expect(dashboard.chainIntegrity).toBe(true);
      expect(dashboard.activeSessions).toBe(1);
      expect(dashboard.unresolvedAlerts).toBe(1);
    });
  });

  // ==================== OKLAHOMA ORG-SPECIFIC TESTS ====================

  describe('Oklahoma — Hindu Temple of Tulsa (Religious)', () => {
    test('temple treasurer can manage donations but not users', () => {
      expect(engine.hasPermission('treasurer', 'transactions', 'create')).toBe(true);
      expect(engine.hasPermission('treasurer', 'transactions', 'approve')).toBe(true);
      expect(engine.hasPermission('treasurer', 'users', 'create')).toBe(false);
    });

    test('donation logging creates immutable audit entry', () => {
      const entry = engine.logAction({
        userId: 'temple_treasurer', userName: 'Raj Patel', userRole: 'treasurer',
        action: 'create', resource: 'transactions', resourceId: 'don_001',
        details: { type: 'donation', amount: 1000, donor: 'Temple Member', category: 'Puja Fund' },
      });
      expect(entry.hash).toMatch(/^sha256_/);
      expect(entry.details.category).toBe('Puja Fund');
      const chain = engine.verifyAuditChain();
      expect(chain.valid).toBe(true);
    });

    test('volunteer pujari cannot export financial data', () => {
      expect(engine.hasPermission('volunteer', 'transactions', 'export')).toBe(false);
      expect(engine.hasPermission('volunteer', 'donors', 'export')).toBe(false);
    });
  });

  describe('Oklahoma — OKC Community Food Pantry (Food Bank)', () => {
    test('food bank admin can manage all donation tracking', () => {
      expect(engine.hasPermission('admin', 'transactions', 'create')).toBe(true);
      expect(engine.hasPermission('admin', 'donors', 'export')).toBe(true);
      expect(engine.hasPermission('admin', 'compliance', 'export')).toBe(true);
    });

    test('audit trail captures grant disbursement chain', () => {
      engine.logAction({
        userId: 'fb_admin', userName: 'Maria Garcia', userRole: 'admin',
        action: 'create', resource: 'transactions', resourceId: 'grant_001',
        details: { type: 'grant_received', amount: 50000, grantor: 'OK Community Foundation' },
      });
      engine.logAction({
        userId: 'fb_treasurer', userName: 'John Smith', userRole: 'treasurer',
        action: 'approve', resource: 'transactions', resourceId: 'grant_001',
        details: { type: 'grant_approved', approved_amount: 50000 },
      });
      engine.logAction({
        userId: 'fb_staff', userName: 'Lisa Wong', userRole: 'staff',
        action: 'create', resource: 'transactions', resourceId: 'expense_001',
        details: { type: 'grant_disbursement', amount: 12000, category: 'Food Purchase' },
      });
      const chain = engine.verifyAuditChain();
      expect(chain.valid).toBe(true);
      const log = engine.getAuditLog({ resource: 'transactions' });
      expect(log).toHaveLength(3);
    });

    test('detects brute force on food bank volunteer account', () => {
      for (let i = 0; i < 5; i++) {
        engine.recordFailedLogin('volunteer_account', '10.0.0.5');
      }
      const alerts = engine.getAlerts({ type: 'brute_force' });
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].severity).toBe('critical');
    });
  });

  describe('Oklahoma — Norman Tech Bridge (IT Support Nonprofit)', () => {
    test('IT admin manages user roles for tech volunteers', () => {
      expect(engine.canManageRole('admin', 'volunteer')).toBe(true);
      expect(engine.canManageRole('admin', 'staff')).toBe(true);
      expect(engine.canManageRole('staff', 'admin')).toBe(false);
    });

    test('encrypts sensitive client PII data', () => {
      const ssn = '123-45-6789';
      const encrypted = engine.encryptField(ssn);
      expect(encrypted.ciphertext).not.toBe(ssn);
      expect(encrypted.algorithm).toBe('AES-256-GCM');
      const decrypted = engine.decryptField(encrypted);
      expect(decrypted).toBe(ssn);
    });

    test('data export requires admin approval for compliance', () => {
      const request = engine.requestDataExport({
        requestedBy: 'tech_staff', scope: 'client_data',
        dateRange: { start: '2026-01-01', end: '2026-03-31' }, format: 'csv',
      });
      expect(request.status).toBe('pending');

      // Staff cannot self-approve
      const selfApprove = engine.approveDataExport(request.id, 'tech_staff', 'staff');
      expect(selfApprove).toBeNull();

      // Admin approves
      const approved = engine.approveDataExport(request.id, 'it_admin', 'admin');
      expect(approved).not.toBeNull();
      expect(approved!.status).toBe('approved');
    });
  });
});
