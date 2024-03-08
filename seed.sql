INSERT INTO public.users(
	 email, phone_number, first_name, last_name, password)
	VALUES ( 'admin@gmail.com', '1234567890', 'admin', 'admin', '$2b$10$vr9LTN7XZjBCVrKobZZtiOg1UdNnqhGB0Qde1KqEAWMU7AN7gAulG');

INSERT INTO public.super_roles(
	 name)
	VALUES ( 'ADMIN');

INSERT INTO public.organization_roles(
	 name)
	VALUES ( 'ADMIN');

INSERT INTO public.society_roles(
	 name)
	VALUES ( 'ADMIN');

INSERT INTO public.users_super_roles(
	 user_id, super_role_id)
	VALUES ( 1, 1);

INSERT INTO public.users_society_roles(
	 user_id, society_role_id, society_id)
	VALUES ( 1, 1, 1);