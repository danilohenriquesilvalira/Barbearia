# Problemas Pendentes — Connect Barber

## Estado actual (Março 2026)

---

## 1. Login do Barbeiro em `/staff` — NÃO FUNCIONA

**URL:** `http://localhost:5173/Barbearia/staff`

O barbeiro tenta entrar com email + password mas não consegue logar.

**Causa provável:**
- O perfil do barbeiro pode não ter `role = 'barber'` na tabela `profiles` do Supabase
- O trigger `handle_new_user` precisa que o email já exista na tabela `barbers` ANTES de criar a conta auth — se a ordem estiver errada, o role fica como `client`
- Confirmar no Supabase Dashboard → Table Editor → `profiles` → ver se o barbeiro tem `role = 'barber'`

**O que testar:**
1. Ir ao Supabase → SQL Editor e correr:
   ```sql
   SELECT au.email, p.role 
   FROM auth.users au
   JOIN public.profiles p ON p.id = au.id
   WHERE au.email = 'email_do_barbeiro@exemplo.com';
   ```
2. Se o role aparecer como `client`, corrigir manualmente:
   ```sql
   UPDATE public.profiles SET role = 'barber'
   WHERE id = (SELECT id FROM auth.users WHERE email = 'email_do_barbeiro@exemplo.com');
   ```

---

## 2. Criação de Barbeiro via Painel Admin — PODE FALHAR

**Onde:** Painel Admin → Barbeiros → Novo Barbeiro

**Causa provável:**
- A política RLS da tabela `barbers` exige que o admin tenha `role = 'admin'` na tabela `profiles`
- Se o admin fizer logout/login e o role não carregar correctamente, a inserção é bloqueada

**Solução já implementada no código** mas precisa das migrações SQL a correr no Supabase:
- Ver o ficheiro `supabase/schema.sql` — secção "PASSO CRÍTICO" no final
- Correr esse bloco no Supabase SQL Editor
- Garantir que o admin tem `role = 'admin'`:
  ```sql
  UPDATE public.profiles SET role = 'admin'
  WHERE id = (SELECT id FROM auth.users WHERE email = 'danilosilvalira10@gmail.com');
  ```

---

## 3. Alterar Password do Barbeiro — PRECISA DE CONFIGURAÇÃO

**Onde:** Painel Admin → Barbeiros → Editar → campo "Nova Password"

**Causa:** Requer a `service_role` key do Supabase no `.env.local`

**Solução:**
1. Ir ao Supabase Dashboard → Project Settings → API
2. Copiar a chave `service_role` (secret)
3. Adicionar ao ficheiro `.env.local` na raiz do projecto:
   ```
   VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  (colar aqui)
   ```
4. Reiniciar o servidor de desenvolvimento

---

## 4. SQL a correr no Supabase (obrigatório para tudo funcionar)

Ir ao **Supabase Dashboard → SQL Editor → New Query** e correr:

```sql
-- Função sem recursão de RLS
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Política corrigida para a tabela barbers
DROP POLICY IF EXISTS "barbers: admin pode gerir" ON public.barbers;
CREATE POLICY "barbers: admin pode gerir" ON public.barbers
  FOR ALL
  USING     ( get_my_role() = 'admin' )
  WITH CHECK( get_my_role() = 'admin' );

-- Políticas de profiles para admin
DROP POLICY IF EXISTS "profile: admin vê todos"   ON public.profiles;
DROP POLICY IF EXISTS "profile: admin edita todos" ON public.profiles;
CREATE POLICY "profile: admin vê todos" ON public.profiles
  FOR SELECT USING ( get_my_role() = 'admin' OR auth.uid() = id );
CREATE POLICY "profile: admin edita todos" ON public.profiles
  FOR ALL USING ( get_my_role() = 'admin' );

-- Define admin (correr UMA VEZ)
UPDATE public.profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'danilosilvalira10@gmail.com');
```

---

## Arquitectura resumida

| Utilizador | Como entra | URL |
|---|---|---|
| **Cliente** | Google OAuth | `/Barbearia/` |
| **Barbeiro** | Email + Password | `/Barbearia/staff` |
| **Admin** | Google OAuth (email na lista ADMIN_EMAILS) | `/Barbearia/` |

**Ficheiros chave:**
- `src/context/AuthContext.tsx` — lógica de auth e roles
- `src/admin/components/BarberFormModal.tsx` — criação/edição de barbeiros
- `src/components/StaffLoginPage.tsx` — página de login dos funcionários
- `src/barber/BarberApp.tsx` — painel do barbeiro
- `src/admin/AdminApp.tsx` — painel do admin
- `supabase/schema.sql` — schema completo + migrações
