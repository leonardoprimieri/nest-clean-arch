<h1 align="center">Welcome to nestjs-clean 👋</h1>

<p>This project aims to be a clean architecture for nestjs projects</p>

<span>For now, this project is in development</span>

<h2>Project features</h2>

- [x] Clean architecture
- [x] JWT authentication
- [x] Prisma ORM
- [x] Docker

<h2>How to run the project</h2>

```sh
docker compose up -d
```

```sh
pnpm install
```

```sh
pnpm start:dev
```

<h2>Env Variables</h2>

```sh
DATABASE_URL="prisma-db-url"
JWT_PRIVATE_KEY="base64-private-key"
JWT_PUBLIC_KEY="base64-public-key"
```

<h2>How to generate the keys</h2>

```sh
 # Generate Private Key
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048

# Generate public key
openssl rsa -pubout -in private.key -out public.key -outform PEM

# Convert private key to base64
JWT_PRIVATE_KEY=$(openssl base64 -in private.key -A)

# Convert public key to base64
JWT_PUBLIC_KEY=$(openssl base64 -in public.key -A)

# Add the keys to .env file
echo "JWT_PRIVATE_KEY=\"$JWT_PRIVATE_KEY\"" >> .env
echo "JWT_PUBLIC_KEY=\"$JWT_PUBLIC_KEY\"" >> .env

# Remove the keys
rm private.key public.key
```
