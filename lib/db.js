/**
 * IndexedDB Database Utility for InstantInvoice
 * Manages local storage of invoices, clients, business details, and settings
 */

const DB_NAME = 'InstantInvoiceDB';
const DB_VERSION = 1;

// Object Store Names
export const STORES = {
    INVOICES: 'invoices',
    CLIENTS: 'clients',
    BUSINESS: 'business',
    SETTINGS: 'settings'
};

/**
 * Initialize and open the IndexedDB database
 */
export const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Invoices Store
            if (!db.objectStoreNames.contains(STORES.INVOICES)) {
                const invoiceStore = db.createObjectStore(STORES.INVOICES, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                invoiceStore.createIndex('invoiceNumber', 'invoiceNumber', { unique: true });
                invoiceStore.createIndex('status', 'status', { unique: false });
                invoiceStore.createIndex('clientId', 'clientId', { unique: false });
                invoiceStore.createIndex('createdAt', 'createdAt', { unique: false });
            }

            // Clients Store
            if (!db.objectStoreNames.contains(STORES.CLIENTS)) {
                const clientStore = db.createObjectStore(STORES.CLIENTS, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                clientStore.createIndex('name', 'name', { unique: false });
                clientStore.createIndex('email', 'email', { unique: true });
            }

            // Business Store (single record)
            if (!db.objectStoreNames.contains(STORES.BUSINESS)) {
                db.createObjectStore(STORES.BUSINESS, { keyPath: 'id' });
            }

            // Settings Store
            if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
                db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
            }
        };
    });
};

/**
 * Generic function to add data to a store
 */
export const addData = async (storeName, data) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Generic function to get data by ID
 */
export const getData = async (storeName, id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Generic function to get all data from a store
 */
export const getAllData = async (storeName) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Generic function to update data
 */
export const updateData = async (storeName, data) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Generic function to delete data
 */
export const deleteData = async (storeName, id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Get data by index
 */
export const getDataByIndex = async (storeName, indexName, value) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(value);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// ============= Invoice-specific functions =============

/**
 * Save a new invoice
 */
export const saveInvoice = async (invoiceData) => {
    const invoice = {
        ...invoiceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    return addData(STORES.INVOICES, invoice);
};

/**
 * Get all invoices
 */
export const getAllInvoices = async () => {
    return getAllData(STORES.INVOICES);
};

/**
 * Get a single invoice by ID
 */
export const getInvoice = async (id) => {
    return getData(STORES.INVOICES, id);
};

/**
 * Get invoices by status
 */
export const getInvoicesByStatus = async (status) => {
    return getDataByIndex(STORES.INVOICES, 'status', status);
};

/**
 * Update invoice - accepts id and partial data
 */
export const updateInvoice = async (id, partialData) => {
    const existing = await getInvoice(id);
    if (!existing) {
        throw new Error('Invoice not found');
    }

    const updated = {
        ...existing,
        ...partialData,
        updatedAt: new Date().toISOString()
    };
    return updateData(STORES.INVOICES, updated);
};

/**
 * Delete invoice
 */
export const deleteInvoice = async (id) => {
    return deleteData(STORES.INVOICES, id);
};

/**
 * Delete invoices by year
 */
export const deleteInvoicesByYear = async (year) => {
    const invoices = await getAllInvoices();
    const toDelete = invoices.filter(inv => {
        const dateStr = inv.issueDate || inv.createdAt;
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && date.getFullYear().toString() === year.toString();
    });

    const db = await openDB();
    const transaction = db.transaction([STORES.INVOICES], 'readwrite');
    const store = transaction.objectStore(STORES.INVOICES);

    const promises = toDelete.map(inv => {
        return new Promise((resolve, reject) => {
            const request = store.delete(inv.id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    });

    await Promise.all(promises);
    return toDelete.length;
};

/**
 * Generate next invoice number
 */
export const getNextInvoiceNumber = async () => {
    const invoices = await getAllInvoices();
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${String(count).padStart(3, '0')}`;
};

// ============= Client-specific functions =============

/**
 * Save a new client
 */
export const saveClient = async (clientData) => {
    return addData(STORES.CLIENTS, clientData);
};

/**
 * Get all clients
 */
export const getAllClients = async () => {
    return getAllData(STORES.CLIENTS);
};

/**
 * Update client
 */
export const updateClient = async (client) => {
    return updateData(STORES.CLIENTS, client);
};

/**
 * Delete client
 */
export const deleteClient = async (id) => {
    return deleteData(STORES.CLIENTS, id);
};

// ============= Business-specific functions =============

/**
 * Save business details (single record with id: 'main')
 */
export const saveBusinessDetails = async (businessData) => {
    const business = {
        id: 'main',
        ...businessData,
        updatedAt: new Date().toISOString()
    };
    return updateData(STORES.BUSINESS, business);
};

/**
 * Get business details
 */
export const getBusinessDetails = async () => {
    return getData(STORES.BUSINESS, 'main');
};

// ============= Settings-specific functions =============

/**
 * Save a setting
 */
export const saveSetting = async (key, value) => {
    return updateData(STORES.SETTINGS, { key, value });
};

/**
 * Get a setting
 */
export const getSetting = async (key) => {
    const result = await getData(STORES.SETTINGS, key);
    return result ? result.value : null;
};

/**
 * Get all settings
 */
export const getAllSettings = async () => {
    const settings = await getAllData(STORES.SETTINGS);
    return settings.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
    }, {});
};

/**
 * Clear all data (for testing/reset)
 */
export const clearAllData = async () => {
    const db = await openDB();
    const stores = [STORES.INVOICES, STORES.CLIENTS, STORES.BUSINESS, STORES.SETTINGS];

    for (const storeName of stores) {
        await new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
};

/**
 * Manually calculate storage usage by stringifying all data
 * This is more reliable on mobile devices than navigator.storage.estimate()
 */
export const calculateTotalStorageUsage = async () => {
    const stores = Object.values(STORES);
    let totalSize = 0;

    for (const storeName of stores) {
        const data = await getAllData(storeName);
        if (data) {
            // Estimate size based on JSON stringification
            // Roughly 2 bytes per character for UTF-16 in JS string
            const stringified = JSON.stringify(data);
            totalSize += stringified.length * 2;
        }
    }

    return totalSize;
};
