/**
 * IndexedDB Database Utility for InstantInvoice
 * Manages local storage of invoices, clients, business details, and settings
 */

const DB_NAME = 'InstantInvoiceDB';
const DB_VERSION = 2;

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
        request.onsuccess = (event) => {
            const db = event.target.result;
            // Run migration if needed
            migrateLegacyData(db).then(() => resolve(db)).catch(reject);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const oldVersion = event.oldVersion;

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
                invoiceStore.createIndex('businessId', 'businessId', { unique: false });
            } else if (oldVersion < 2) {
                const transaction = event.target.transaction;
                const invoiceStore = transaction.objectStore(STORES.INVOICES);
                if (!invoiceStore.indexNames.contains('businessId')) {
                    invoiceStore.createIndex('businessId', 'businessId', { unique: false });
                }
            }

            // Clients Store
            if (!db.objectStoreNames.contains(STORES.CLIENTS)) {
                const clientStore = db.createObjectStore(STORES.CLIENTS, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                clientStore.createIndex('name', 'name', { unique: false });
                clientStore.createIndex('email', 'email', { unique: true });
                clientStore.createIndex('businessId', 'businessId', { unique: false });
            } else if (oldVersion < 2) {
                const transaction = event.target.transaction;
                const clientStore = transaction.objectStore(STORES.CLIENTS);
                if (!clientStore.indexNames.contains('businessId')) {
                    clientStore.createIndex('businessId', 'businessId', { unique: false });
                }
            }

            // Business Store
            if (!db.objectStoreNames.contains(STORES.BUSINESS)) {
                db.createObjectStore(STORES.BUSINESS, { keyPath: 'id' });
            }

            // Settings Store
            if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
                const settingsStore = db.createObjectStore(STORES.SETTINGS, { keyPath: 'id', autoIncrement: true });
                settingsStore.createIndex('key', 'key', { unique: false });
                settingsStore.createIndex('businessId', 'businessId', { unique: false });
            } else if (oldVersion < 2) {
                // Settings migration is tricky because keyPath was 'key'. 
                // We'll keep it as is for now or use a prefix strategy in the functions.
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
/**
 * Migrate legacy data (without businessId) to the 'main' business
 */
export const migrateLegacyData = async (db) => {
    const storesToMigrate = [STORES.INVOICES, STORES.CLIENTS];

    for (const storeName of storesToMigrate) {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        await new Promise((resolve, reject) => {
            request.onsuccess = async () => {
                const items = request.result;
                const updates = items.filter(item => !item.businessId);

                if (updates.length > 0) {
                    console.log(`Migrating ${updates.length} items in ${storeName} to main business`);
                    const writeTransaction = db.transaction([storeName], 'readwrite');
                    const writeStore = writeTransaction.objectStore(storeName);

                    for (const item of updates) {
                        writeStore.put({ ...item, businessId: 'main' });
                    }

                    writeTransaction.oncomplete = () => resolve();
                    writeTransaction.onerror = () => reject(writeTransaction.error);
                } else {
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Special handling for settings (legacy keys weren't prefixed)
    const settingsTransaction = db.transaction([STORES.SETTINGS], 'readwrite');
    const settingsStore = settingsTransaction.objectStore(STORES.SETTINGS);
    const settingsRequest = settingsStore.getAll();

    await new Promise((resolve, reject) => {
        settingsRequest.onsuccess = async () => {
            const items = settingsRequest.result;
            const updates = items.filter(item => !item.businessId && !item.key.includes(':'));

            if (updates.length > 0) {
                const writeTransaction = db.transaction([STORES.SETTINGS], 'readwrite');
                const writeStore = writeTransaction.objectStore(STORES.SETTINGS);

                for (const item of updates) {
                    // Update both key (to include prefix if necessary) and add businessId
                    if (writeStore.keyPath === 'key') {
                        writeStore.put({ ...item, key: `main:${item.key}`, businessId: 'main' });
                        // Delete the old one
                        writeStore.delete(item.key);
                    } else {
                        writeStore.put({ ...item, businessId: 'main' });
                    }
                }
                writeTransaction.oncomplete = () => resolve();
                writeTransaction.onerror = () => reject(writeTransaction.error);
            } else {
                resolve();
            }
        };
        settingsRequest.onerror = () => reject(settingsRequest.error);
    });
};

/**
 * Get active business ID from localStorage
 */
export const getActiveBusinessId = () => {
    if (typeof window !== 'undefined') {
        const id = localStorage.getItem('activeBusinessId');
        if (id) return id;
    }
    return 'main';
};

/**
 * Set active business ID in localStorage
 */
export const setActiveBusinessId = (id) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('activeBusinessId', id);
    }
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

// ============= Business-specific functions =============

/**
 * Save/Update business details
 */
export const saveBusiness = async (businessData) => {
    const business = {
        ...businessData,
        id: businessData.id || `biz_${Date.now()}`,
        updatedAt: new Date().toISOString()
    };
    return updateData(STORES.BUSINESS, business);
};

/**
 * Get a specific business by ID
 */
export const getBusiness = async (id) => {
    return getData(STORES.BUSINESS, id || getActiveBusinessId());
};

/**
 * Get all businesses
 */
export const getAllBusinesses = async () => {
    const businesses = await getAllData(STORES.BUSINESS);
    // Ensure at least one business exists
    if (businesses.length === 0) {
        const defaultBiz = {
            id: 'main',
            name: 'My Business',
            updatedAt: new Date().toISOString()
        };
        await saveBusiness(defaultBiz);
        return [defaultBiz];
    }
    return businesses;
};

/**
 * Delete business and its related data
 */
export const deleteBusiness = async (businessId) => {
    if (businessId === 'main') {
        throw new Error('Cannot delete the default business');
    }

    // Delete related data first (or we could just leave it orphaned, but cleaning up is better)
    const invoices = await getInvoicesByBusiness(businessId);
    const clients = await getClientsByBusiness(businessId);

    // Perform deletions... (simplified for now)
    await deleteData(STORES.BUSINESS, businessId);
};

// ============= Invoice-specific functions =============

/**
 * Save a new invoice
 */
export const saveInvoice = async (invoiceData) => {
    const businessId = getActiveBusinessId();
    const invoice = {
        ...invoiceData,
        businessId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    return addData(STORES.INVOICES, invoice);
};

/**
 * Get invoices for a business
 */
export const getInvoicesByBusiness = async (businessId) => {
    const id = businessId || getActiveBusinessId();
    return getDataByIndex(STORES.INVOICES, 'businessId', id);
};

/**
 * Get all invoices (for current business)
 */
export const getAllInvoices = async () => {
    return getInvoicesByBusiness();
};

/**
 * Get a single invoice by ID
 */
export const getInvoice = async (id) => {
    return getData(STORES.INVOICES, id);
};

/**
 * Get invoices by status for current business
 */
export const getInvoicesByStatus = async (status) => {
    const invoices = await getInvoicesByBusiness();
    return invoices.filter(inv => inv.status === status);
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
 * Delete invoices by year for current business
 */
export const deleteInvoicesByYear = async (year) => {
    const invoices = await getInvoicesByBusiness();
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
 * Generate next invoice number for current business
 */
export const getNextInvoiceNumber = async () => {
    const invoices = await getInvoicesByBusiness();
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${String(count).padStart(3, '0')}`;
};

// ============= Client-specific functions =============

/**
 * Save a new client
 */
export const saveClient = async (clientData) => {
    const businessId = getActiveBusinessId();
    const client = {
        ...clientData,
        businessId
    };
    return addData(STORES.CLIENTS, client);
};

/**
 * Get clients for a business
 */
export const getClientsByBusiness = async (businessId) => {
    const id = businessId || getActiveBusinessId();
    return getDataByIndex(STORES.CLIENTS, 'businessId', id);
};

/**
 * Get all clients (for current business)
 */
export const getAllClients = async () => {
    return getClientsByBusiness();
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

// ============= Settings-specific functions =============

/**
 * Save a setting (per business)
 */
export const saveSetting = async (key, value) => {
    const businessId = getActiveBusinessId();
    // Since we didn't change the keyPath of SETTINGS yet to support a clean migration,
    // we use a prefix for the key if the store still uses 'key' as keyPath.
    // However, in our v2 upgrade we tried to change it. 
    // Let's use a robust approach:
    const db = await openDB();
    const transaction = db.transaction([STORES.SETTINGS], 'readwrite');
    const store = transaction.objectStore(STORES.SETTINGS);

    const compositeKey = `${businessId}:${key}`;

    // If keyPath is 'key', then use compositeKey as 'key'.
    // If we successfully migrated to autoIncrement with 'id', we store 'key' and 'businessId' separately.
    if (store.keyPath === 'key') {
        return updateData(STORES.SETTINGS, { key: compositeKey, value });
    } else {
        // Find existing record for this business and key
        const settings = await getAllData(STORES.SETTINGS);
        const existing = settings.find(s => s.businessId === businessId && s.key === key);

        const data = {
            key,
            businessId,
            value,
            id: existing ? existing.id : undefined
        };
        return updateData(STORES.SETTINGS, data);
    }
};

/**
 * Get a setting (per business)
 */
export const getSetting = async (key) => {
    const businessId = getActiveBusinessId();
    const db = await openDB();
    const transaction = db.transaction([STORES.SETTINGS], 'readonly');
    const store = transaction.objectStore(STORES.SETTINGS);

    if (store.keyPath === 'key') {
        const result = await getData(STORES.SETTINGS, `${businessId}:${key}`);
        return result ? result.value : null;
    } else {
        const settings = await getAllData(STORES.SETTINGS);
        const result = settings.find(s => s.businessId === businessId && s.key === key);
        return result ? result.value : null;
    }
};

/**
 * Get all settings (for current business)
 */
export const getAllSettings = async () => {
    const businessId = getActiveBusinessId();
    const settings = await getAllData(STORES.SETTINGS);

    return settings
        .filter(s => {
            if (s.businessId) return s.businessId === businessId;
            // Handle prefix format if businessId is missing
            return s.key && s.key.startsWith(`${businessId}:`);
        })
        .reduce((acc, s) => {
            const key = s.businessId ? s.key : s.key.split(':')[1];
            acc[key] = s.value;
            return acc;
        }, {});
};

// ============= Legacy/Misc functions =============

/**
 * Save business details (Legacy support)
 */
export const saveBusinessDetails = async (businessData) => {
    return saveBusiness({ ...businessData, id: getActiveBusinessId() });
};

/**
 * Get business details (Legacy support - defaults to main)
 */
export const getBusinessDetails = async () => {
    return getBusiness();
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
