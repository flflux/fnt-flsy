
# This is used for initiating the backend with username as 'admin@gmail.com' and password as 'admin'. Also this will allocate this user as superAdmin.

```
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
```

# next step is to start process with

```
npm i
npx nx serve api
```

# for applying prisma migration with newly added schema first create down migration then up migration with --create-only then apply check the migration sql syntax if it satisfies the desired state then apply the migration with db push

```
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma   --to-schema-datasource prisma/schema.prisma --script >down_< current_migration_no >_.sql
npx prisma migrate dev --create-only
npx prisma migrate dev

```
