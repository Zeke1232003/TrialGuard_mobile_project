import { getApps, getApp, initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth } from './authClient';
import { Subscription } from '@models/Subscription';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

type SubscriptionPayload = {
  userId: string;
  name: string;
  category?: string | null;
  cost: number;
  currency: string;
  billingCycle: Subscription['billingCycle'];
  nextBillingDate: string;
  trialEndDate?: string | null;
  status: Subscription['status'];
  source: Subscription['source'];
  reminderEnabled: boolean;
  reminderDays: number;
  iconUrl?: string | null;
  iconLibrary?: Subscription['iconLibrary'] | null;
  iconName?: string | null;
  iconColor?: string | null;
  notes?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

function getUserSubscriptionsCollection() {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('Please log in first.');
  }

  return collection(db, 'users', uid, 'subscriptions');
}

function toOptionalString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function mapDocToSubscription(docId: string, data: any): Subscription {
  return {
    id: docId,
    userId: data.userId,
    name: data.name,
    category: data.category || undefined,
    cost: data.cost,
    currency: data.currency,
    billingCycle: data.billingCycle,
    nextBillingDate: new Date(data.nextBillingDate),
    trialEndDate: data.trialEndDate ? new Date(data.trialEndDate) : undefined,
    status: data.status,
    source: data.source,
    reminderEnabled: data.reminderEnabled,
    reminderDays: data.reminderDays,
    iconUrl: data.iconUrl || undefined,
    iconLibrary: data.iconLibrary || undefined,
    iconName: data.iconName || undefined,
    iconColor: data.iconColor || undefined,
    notes: data.notes || undefined,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
  };
}

export async function fetchSubscriptionsFromFirestore(): Promise<Subscription[]> {
  const subscriptionsRef = getUserSubscriptionsCollection();
  const q = query(subscriptionsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => mapDocToSubscription(document.id, document.data()));
}

export async function addSubscriptionToFirestore(
  subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Subscription> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('Please log in first.');
  }

  const subscriptionsRef = getUserSubscriptionsCollection();
  const payload: SubscriptionPayload = {
    userId: uid,
    name: subscription.name,
    category: toOptionalString(subscription.category),
    cost: subscription.cost,
    currency: subscription.currency,
    billingCycle: subscription.billingCycle,
    nextBillingDate: subscription.nextBillingDate.toISOString(),
    trialEndDate: subscription.trialEndDate ? subscription.trialEndDate.toISOString() : null,
    status: subscription.status,
    source: subscription.source,
    reminderEnabled: subscription.reminderEnabled,
    reminderDays: subscription.reminderDays,
    iconUrl: toOptionalString(subscription.iconUrl),
    iconLibrary: toOptionalString(subscription.iconLibrary) as Subscription['iconLibrary'] | null,
    iconName: toOptionalString(subscription.iconName),
    iconColor: toOptionalString(subscription.iconColor),
    notes: toOptionalString(subscription.notes),
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  const docRef = await addDoc(subscriptionsRef, payload);
  const now = new Date();

  return {
    ...subscription,
    id: docRef.id,
    userId: uid,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateSubscriptionInFirestore(
  id: string,
  updates: Partial<Subscription>
): Promise<void> {
  const subscriptionsRef = getUserSubscriptionsCollection();
  const ref = doc(subscriptionsRef, id);

  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.category !== undefined) payload.category = toOptionalString(updates.category);
  if (updates.cost !== undefined) payload.cost = updates.cost;
  if (updates.currency !== undefined) payload.currency = updates.currency;
  if (updates.billingCycle !== undefined) payload.billingCycle = updates.billingCycle;
  if (updates.nextBillingDate !== undefined) payload.nextBillingDate = updates.nextBillingDate.toISOString();
  if (updates.trialEndDate !== undefined) {
    payload.trialEndDate = updates.trialEndDate ? updates.trialEndDate.toISOString() : null;
  }
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.source !== undefined) payload.source = updates.source;
  if (updates.reminderEnabled !== undefined) payload.reminderEnabled = updates.reminderEnabled;
  if (updates.reminderDays !== undefined) payload.reminderDays = updates.reminderDays;
  if (updates.iconUrl !== undefined) payload.iconUrl = toOptionalString(updates.iconUrl);
  if (updates.iconLibrary !== undefined) payload.iconLibrary = toOptionalString(updates.iconLibrary);
  if (updates.iconName !== undefined) payload.iconName = toOptionalString(updates.iconName);
  if (updates.iconColor !== undefined) payload.iconColor = toOptionalString(updates.iconColor);
  if (updates.notes !== undefined) payload.notes = toOptionalString(updates.notes);

  await updateDoc(ref, payload);
}

export async function deleteSubscriptionFromFirestore(id: string): Promise<void> {
  const subscriptionsRef = getUserSubscriptionsCollection();
  const ref = doc(subscriptionsRef, id);
  await deleteDoc(ref);
}

export async function deleteAllCurrentUserDataFromFirestore(): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('Please log in first.');
  }

  const subscriptionsRef = collection(db, 'users', uid, 'subscriptions');
  const snapshot = await getDocs(subscriptionsRef);

  if (!snapshot.empty) {
    await Promise.all(snapshot.docs.map((subscriptionDoc) => deleteDoc(subscriptionDoc.ref)));
  }

  const userDocRef = doc(db, 'users', uid);
  await deleteDoc(userDocRef).catch(() => {
    // Ignore missing profile document; subscriptions deletion is the critical part.
  });
}
