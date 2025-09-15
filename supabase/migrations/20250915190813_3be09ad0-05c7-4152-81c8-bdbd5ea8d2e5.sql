-- Ensure the default site exists for holding domain
INSERT INTO public.sites (id, slug, domain)
VALUES ('11111111-1111-1111-1111-111111111111', 'holding', 'alialshehriholding.com')
ON CONFLICT (domain) DO NOTHING;