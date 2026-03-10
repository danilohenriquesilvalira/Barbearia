-- ═══════════════════════════════════════════════════════════════════════════
-- Connect Barber — Schema Supabase
-- Corre este script em: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Tabela de Perfis (apenas Nome + Telemóvel — dados mínimos RGPD) ─────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL DEFAULT '',
  phone      TEXT        NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabela de Marcações ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id   TEXT        NOT NULL,
  service_name TEXT        NOT NULL,
  barber_id    TEXT        NOT NULL,
  barber_name  TEXT        NOT NULL,
  date         DATE        NOT NULL,
  time_slot    TEXT        NOT NULL,
  price        NUMERIC(8,2) NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'confirmed'
                           CHECK (status IN ('confirmed','completed','cancelled')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row Level Security — cada utilizador só vê os seus próprios dados ────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings  ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profile: ver o próprio"     ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profile: inserir o próprio" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profile: editar o próprio"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Bookings
CREATE POLICY "booking: ver as próprias"    ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "booking: criar marcação"     ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "booking: cancelar marcação"  ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- ── Trigger: cria perfil automaticamente quando o utilizador faz login ───────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
