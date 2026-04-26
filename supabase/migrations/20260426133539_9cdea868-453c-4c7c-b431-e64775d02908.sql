-- ============================================================
-- INVITATIONS
-- ============================================================
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  sender_id UUID NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('user','trainer','gym_admin')),
  recipient_email TEXT,
  recipient_id UUID,
  invite_type TEXT NOT NULL CHECK (invite_type IN (
    'user_to_trainer','user_to_gym',
    'trainer_to_user','trainer_to_gym',
    'gym_to_user','gym_to_trainer'
  )),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','expired','cancelled')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invitations_sender ON public.invitations(sender_id);
CREATE INDEX idx_invitations_recipient ON public.invitations(recipient_id);
CREATE INDEX idx_invitations_email ON public.invitations(recipient_email);
CREATE INDEX idx_invitations_code ON public.invitations(invite_code);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invites they sent"
  ON public.invitations FOR SELECT
  USING (sender_id = auth.uid());

CREATE POLICY "Users can view invites addressed to them"
  ON public.invitations FOR SELECT
  USING (recipient_id = auth.uid() OR recipient_email = (SELECT email FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Anyone authenticated can look up by code"
  ON public.invitations FOR SELECT
  TO authenticated
  USING (status = 'pending' AND expires_at > now());

CREATE POLICY "Users can send invites"
  ON public.invitations FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Sender can cancel/update own invites"
  ON public.invitations FOR UPDATE
  USING (sender_id = auth.uid());

CREATE POLICY "Recipient can respond to invites"
  ON public.invitations FOR UPDATE
  USING (recipient_id = auth.uid() OR recipient_email = (SELECT email FROM public.profiles WHERE user_id = auth.uid()));

CREATE TRIGGER invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- REFERRALS
-- ============================================================
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL,
  referrer_role TEXT NOT NULL CHECK (referrer_role IN ('user','trainer','gym_admin')),
  referred_user_id UUID NOT NULL,
  referral_code TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','expired')),
  commission_percent NUMERIC NOT NULL DEFAULT 2.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '12 months'),
  UNIQUE (referrer_id, referred_user_id)
);

CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON public.referrals(referred_user_id);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see referrals they made"
  ON public.referrals FOR SELECT
  USING (referrer_id = auth.uid());

CREATE POLICY "Users see referrals where they are referred"
  ON public.referrals FOR SELECT
  USING (referred_user_id = auth.uid());

-- Referral monthly earnings
CREATE TABLE public.referral_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','credited','withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_earnings_user ON public.referral_earnings(user_id);

ALTER TABLE public.referral_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own earnings"
  ON public.referral_earnings FOR SELECT
  USING (user_id = auth.uid());

-- Wallets
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  lifetime_earnings NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own wallet"
  ON public.wallets FOR SELECT
  USING (user_id = auth.uid());

CREATE TRIGGER wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create wallet on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name',''));

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  INSERT INTO public.fitness_records (user_id) VALUES (NEW.id);
  INSERT INTO public.wallets (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$function$;

-- Backfill wallets for existing users
INSERT INTO public.wallets (user_id)
SELECT user_id FROM public.profiles
WHERE user_id NOT IN (SELECT user_id FROM public.wallets);
