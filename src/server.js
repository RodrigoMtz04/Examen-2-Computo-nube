'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const { z } = require('zod');

const { recommend, FEATURES } = require('./naiveBayes');
const { getPool } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Servir frontend estático
app.use('/', express.static(path.join(__dirname, '..', 'public')));

const RecommendSchema = z.object({
  ctd: z.enum(FEATURES.ctd.values),
  hm: z.enum(FEATURES.hm.values),
  cel: z.enum(FEATURES.cel.values),
  mi: z.enum(FEATURES.mi.values),
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/recommend', (req, res) => {
  const parsed = RecommendSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Payload inválido', details: parsed.error.flatten() });
  }
  return res.json(recommend(parsed.data));
});

const PurchaseSchema = z.object({
  customer: z.object({
    nombre: z.string().min(1),
    email: z.string().email(),
    telefono: z.string().min(6).max(30).optional().nullable(),
  }),
  answers: RecommendSchema,
  recommended: z.enum(['i100', 'i500']),
});

app.post('/api/purchase', async (req, res) => {
  const parsed = PurchaseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Payload inválido', details: parsed.error.flatten() });
  }

  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const { customer, answers, recommended } = parsed.data;

    // upsert customer by email
    const [existing] = await conn.execute(
      'SELECT id FROM customers WHERE email = ? LIMIT 1',
      [customer.email]
    );

    let customerId;
    if (Array.isArray(existing) && existing.length > 0) {
      customerId = existing[0].id;
      await conn.execute(
        'UPDATE customers SET nombre = ?, telefono = ? WHERE id = ?',
        [customer.nombre, customer.telefono ?? null, customerId]
      );
    } else {
      const [ins] = await conn.execute(
        'INSERT INTO customers (nombre, email, telefono) VALUES (?, ?, ?)',
        [customer.nombre, customer.email, customer.telefono ?? null]
      );
      customerId = ins.insertId;
    }

    const [prodRows] = await conn.execute('SELECT id, price FROM products WHERE code = ? LIMIT 1', [recommended]);
    if (!Array.isArray(prodRows) || prodRows.length === 0) {
      return res.status(500).json({ error: 'Producto no configurado en BD (products)' });
    }

    const productId = prodRows[0].id;
    const price = Number(prodRows[0].price);

    const [purchaseIns] = await conn.execute(
      `INSERT INTO purchases (customer_id, product_id, price, answers_json)
       VALUES (?, ?, ?, ?)`,
      [customerId, productId, price, JSON.stringify(answers)]
    );

    await conn.commit();
    return res.status(201).json({ ok: true, purchaseId: purchaseIns.insertId });
  } catch (e) {
    await conn.rollback();
    return res.status(500).json({ error: 'No se pudo guardar la compra', details: String(e?.message ?? e) });
  } finally {
    conn.release();
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor listo en http://localhost:${port}`);
});

