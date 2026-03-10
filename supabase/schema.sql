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

-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRAÇÃO — Barbeiros + Roles (corre depois do schema base)
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Colunas adicionais na tabela profiles ────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role       TEXT NOT NULL DEFAULT 'client'
    CHECK (role IN ('client', 'barber', 'admin')),
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ── Tabela de Barbeiros ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.barbers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  role_title  TEXT,
  email       TEXT        UNIQUE,
  phone       TEXT,
  status      TEXT        NOT NULL DEFAULT 'available'
                          CHECK (status IN ('available','busy','break','off')),
  rating      NUMERIC(3,1) NOT NULL DEFAULT 5,
  total_cuts  INTEGER      NOT NULL DEFAULT 0,
  join_date   DATE,
  photo_url   TEXT,
  specialties TEXT[]       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Leitura pública (os barbeiros aparecem no site)
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "barbers: leitura pública" ON public.barbers
  FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "barbers: admin pode gerir" ON public.barbers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- bookings: admin e barbeiro podem ver e actualizar as marcações deles
CREATE POLICY IF NOT EXISTS "booking: barbeiro vê as suas" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.barbers b
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE b.id::text = barber_id AND b.email ILIKE (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- ── Trigger actualizado: detecta role=barbeiro pelo email ────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT := 'client';
BEGIN
  -- Se o email existe na tabela barbers → role = 'barber'
  IF NEW.email IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.barbers WHERE email ILIKE NEW.email
  ) THEN
    user_role := 'barber';
  END IF;

  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    ),
    user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 
-- PASSO CRÍTICO  Corre ESTE bloco no Supabase SQL Editor
-- Corrige o problema de "spinner infinito" ao criar barbeiro
-- 

-- 1. Função SECURITY DEFINER que lê o role SEM recursão de RLS
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Recria a política do barbers usando get_my_role()
DROP POLICY IF EXISTS "barbers: admin pode gerir" ON public.barbers;
CREATE POLICY "barbers: admin pode gerir" ON public.barbers
  FOR ALL
  USING     ( get_my_role() = 'admin' )
  WITH CHECK( get_my_role() = 'admin' );

-- 3. Admin pode ver e editar todos os profiles
DROP POLICY IF EXISTS "profile: admin vê todos"    ON public.profiles;
DROP POLICY IF EXISTS "profile: admin edita todos"  ON public.profiles;
CREATE POLICY "profile: admin vê todos" ON public.profiles
  FOR SELECT USING ( get_my_role() = 'admin' );
CREATE POLICY "profile: admin edita todos" ON public.profiles
  FOR ALL USING ( get_my_role() = 'admin' );

-- 4. Define o teu utilizador como admin (corre UMA VEZ após criar a conta)
-- UPDATE public.profiles SET role = 'admin'
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'danilosilvalira10@gmail.com');
