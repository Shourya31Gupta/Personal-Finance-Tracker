const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ override: true });

const app = express();

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing Supabase env vars. Set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY."
  );
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Middleware
app.use(cors());
app.use(express.json());

const isValidTransactionType = (value) => value === "income" || value === "expense";

const normalizeTransactionInput = (payload, { partial = false } = {}) => {
  const normalized = {};

  if (payload.amount !== undefined) {
    const parsedAmount = Number(payload.amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      return { error: "Amount must be a non-negative number." };
    }
    normalized.amount = parsedAmount;
  } else if (!partial) {
    return { error: "Amount is required." };
  }

  if (payload.description !== undefined) {
    const description = String(payload.description).trim();
    if (!description) {
      return { error: "Description is required." };
    }
    normalized.description = description;
  } else if (!partial) {
    return { error: "Description is required." };
  }

  if (payload.type !== undefined) {
    if (!isValidTransactionType(payload.type)) {
      return { error: "Type must be either income or expense." };
    }
    normalized.type = payload.type;
  } else if (!partial) {
    normalized.type = "expense";
  }

  if (payload.category !== undefined) {
    const category = String(payload.category).trim();
    normalized.category = category || "General";
  } else if (!partial) {
    normalized.category = "General";
  }

  if (payload.id !== undefined && payload.id !== null && payload.id !== "") {
    const legacyId = Number(payload.id);
    if (Number.isNaN(legacyId)) {
      return { error: "id must be numeric when provided." };
    }
    normalized.legacy_id = legacyId;
  }

  return { data: normalized };
};

const toLegacyTransaction = (row) => ({
  _id: row.id,
  id: row.legacy_id ?? undefined,
  amount: row.amount,
  description: row.description,
  type: row.type,
  category: row.category,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const handleSupabaseError = (res, error, fallbackMessage) => {
  const message = error?.message || fallbackMessage;
  console.error(message, error);
  res.status(500).json({ error: message });
};

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : null;

  if (!token) {
    return res.status(401).json({ error: "Missing or invalid Authorization header." });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Unauthorized request." });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized request." });
  }
};

// Routes
app.get("/", (req, res) => {
  res.send("API is running.");
});

app.get("/transactions", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return handleSupabaseError(res, error, "Failed to fetch transactions.");
    }

    res.json((data || []).map(toLegacyTransaction));
  } catch (err) {
    handleSupabaseError(res, err, "Unexpected error while fetching transactions.");
  }
});

app.get("/transactions/:id", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (error) {
      return handleSupabaseError(res, error, "Failed to fetch transaction.");
    }

    if (!data) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    res.json(toLegacyTransaction(data));
  } catch (err) {
    handleSupabaseError(res, err, "Unexpected error while fetching transaction.");
  }
});

app.post("/transactions", requireAuth, async (req, res) => {
  try {
    const { data: payload, error: validationError } = normalizeTransactionInput(req.body);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { data, error } = await supabaseAdmin
      .from("transactions")
      .insert({
        ...payload,
        user_id: req.user.id,
      })
      .select("*")
      .single();

    if (error) {
      return handleSupabaseError(res, error, "Failed to create transaction.");
    }

    res.status(201).json(toLegacyTransaction(data));
  } catch (err) {
    handleSupabaseError(res, err, "Unexpected error while creating transaction.");
  }
});

app.put("/transactions/:id", requireAuth, async (req, res) => {
  try {
    const { data: payload, error: validationError } = normalizeTransactionInput(req.body, {
      partial: true,
    });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (!Object.keys(payload).length) {
      return res.status(400).json({ error: "No valid fields supplied for update." });
    }

    const { data, error } = await supabaseAdmin
      .from("transactions")
      .update(payload)
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .select("*")
      .maybeSingle();

    if (error) {
      return handleSupabaseError(res, error, "Failed to update transaction.");
    }

    if (!data) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    res.json(toLegacyTransaction(data));
  } catch (err) {
    handleSupabaseError(res, err, "Unexpected error while updating transaction.");
  }
});

app.delete("/transactions/:id", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .select("*")
      .maybeSingle();

    if (error) {
      return handleSupabaseError(res, error, "Failed to delete transaction.");
    }

    if (!data) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    res.json(toLegacyTransaction(data));
  } catch (err) {
    handleSupabaseError(res, err, "Unexpected error while deleting transaction.");
  }
});

// Start server on Render-assigned port or 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});