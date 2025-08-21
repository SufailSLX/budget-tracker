@@ .. @@
 const API_BASE_URL = 'http://localhost:5000/api';
 
 // API utility functions
-const getAuthHeaders = () => {
+const getAuthHeaders = (): HeadersInit => {
   const token = localStorage.getItem('expense_tracker_token');
   return {
     'Content-Type': 'application/json',
@@ .. @@
 };
 
 // Auth API
-export const authAPI = {
-  register: async (userData: { name: string; email: string; pin: string }) => {
+export const authAPI = {
+  register: async (userData: { name: string; email: string; pin: string }) => {
     const response = await fetch(`${API_BASE_URL}/auth/register`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
@@ .. @@
     return response.json();
   },
 
-  login: async (email: string, pin: string) => {
-    const response = await fetch(`${API_BASE_URL}/auth/login`, {
-      method: 'POST',
-      headers: { 'Content-Type': 'application/json' },
-      body: JSON.stringify({ email, pin })
+  login: async (email: string, pin: string) => {
+    const response = await fetch(`${API_BASE_URL}/auth/login?email=${encodeURIComponent(email)}&pin=${encodeURIComponent(pin)}`, {
+      method: 'GET',
+      headers: { 'Content-Type': 'application/json' }
     });
     return response.json();
   }
@@ .. @@
 
 // Transactions API
 export const transactionsAPI = {
-  getAll: async () => {
+  getAll: async (): Promise<any> => {
     const response = await fetch(`${API_BASE_URL}/transactions`, {
       headers: getAuthHeaders()
     });
@@ .. @@
     return response.json();
   },
 
-  create: async (transactionData: any) => {
+  create: async (transactionData: any): Promise<any> => {
     const response = await fetch(`${API_BASE_URL}/transactions`, {
       method: 'POST',
       headers: getAuthHeaders(),
@@ .. @@
     });
     return response.json();
   }
-};