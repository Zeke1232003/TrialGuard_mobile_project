const express = require('express');
const { z } = require('zod');
const { db, admin } = require('../config/firebaseAdmin');

const router = express.Router();

const billingCycleSchema = z.enum(['daily', 'weekly', 'monthly', 'yearly']);
const statusSchema = z.enum(['active', 'trial', 'cancelled', 'expired']);
const sourceSchema = z.enum(['manual', 'email', 'sms']);
const isoDateOrDateOnlySchema = z.string().refine((value) => {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}, 'Invalid date format');

const createSubscriptionSchema = z.object({
  name: z.string().min(1),
  cost: z.number().nonnegative(),
  category: z.string().max(100).optional(),
  currency: z.string().min(1),
  billingCycle: billingCycleSchema,
  nextBillingDate: isoDateOrDateOnlySchema,
  trialEndDate: isoDateOrDateOnlySchema.optional(),
  status: statusSchema.default('active'),
  source: sourceSchema.default('manual'),
  reminderEnabled: z.boolean().default(true),
  reminderDays: z.number().int().min(0).max(30).default(3),
  iconUrl: z.string().url().optional(),
  iconLibrary: z.enum(['Ionicons', 'MaterialCommunityIcons']).optional(),
  iconName: z.string().max(100).optional(),
  iconColor: z.string().max(20).optional(),
  notes: z.string().max(1000).optional(),
});

const updateSubscriptionSchema = createSubscriptionSchema.partial();

function getCollection(uid) {
  return db.collection('users').doc(uid).collection('subscriptions');
}

function toDateOrUndefined(value) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function docToApiShape(doc) {
  const data = doc.data();
  const normalizeDate = (value) => {
    if (!value) return null;
    if (typeof value.toDate === 'function') return value.toDate().toISOString();
    if (value instanceof Date) return value.toISOString();
    return value;
  };

  return {
    id: doc.id,
    ...data,
    nextBillingDate: normalizeDate(data.nextBillingDate),
    trialEndDate: normalizeDate(data.trialEndDate),
    createdAt: normalizeDate(data.createdAt),
    updatedAt: normalizeDate(data.updatedAt),
  };
}

router.get('/', async (req, res, next) => {
  try {
    const snapshot = await getCollection(req.user.uid).orderBy('createdAt', 'desc').get();
    const items = snapshot.docs.map(docToApiShape);
    return res.json(items);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = createSubscriptionSchema.parse(req.body);
    const now = admin.firestore.FieldValue.serverTimestamp();

    const data = {
      userId: req.user.uid,
      name: payload.name,
      cost: payload.cost,
      category: payload.category || null,
      currency: payload.currency,
      billingCycle: payload.billingCycle,
      nextBillingDate: toDateOrUndefined(payload.nextBillingDate),
      trialEndDate: toDateOrUndefined(payload.trialEndDate) || null,
      status: payload.status,
      source: payload.source,
      reminderEnabled: payload.reminderEnabled,
      reminderDays: payload.reminderDays,
      iconUrl: payload.iconUrl || null,
      iconLibrary: payload.iconLibrary || null,
      iconName: payload.iconName || null,
      iconColor: payload.iconColor || null,
      notes: payload.notes || null,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await getCollection(req.user.uid).add(data);
    const createdDoc = await ref.get();
    return res.status(201).json(docToApiShape(createdDoc));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.flatten() });
    }
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const doc = await getCollection(req.user.uid).doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    return res.json(docToApiShape(doc));
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const payload = updateSubscriptionSchema.parse(req.body);
    const ref = getCollection(req.user.uid).doc(req.params.id);
    const existing = await ref.get();

    if (!existing.exists) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const updates = {
      ...payload,
      nextBillingDate: payload.nextBillingDate ? toDateOrUndefined(payload.nextBillingDate) : undefined,
      trialEndDate: payload.trialEndDate ? toDateOrUndefined(payload.trialEndDate) : undefined,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const sanitizedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    await ref.update(sanitizedUpdates);
    const updatedDoc = await ref.get();
    return res.json(docToApiShape(updatedDoc));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.flatten() });
    }
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const ref = getCollection(req.user.uid).doc(req.params.id);
    const existing = await ref.get();

    if (!existing.exists) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await ref.delete();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
