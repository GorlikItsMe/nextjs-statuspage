This is a starter template for [Learn Next.js](https://nextjs.org/learn).

# Setup

Next.js

```bash
npm install
npm run dev
npm build
```

Prisma (database)

```bash
npx prisma db push # synchronizowane bazy danych
npx prisma studio # tryb studia (łatwe edytowanie bazy danych)
```

## Examples (what i will propably use in future)

```ts
export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return { props: { feed } };
};
```

```
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: post,
  };
};
```

https://vercel.com/guides/nextjs-prisma-postgres

## Database User

```bash
CREATE DATABASE nextjsshopdb;
CREATE USER 'nextjsshop'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON nextjsshopdb . * TO 'nextjsshop'@'%';
FLUSH PRIVILEGES;
```

After that run to propagate database

```bash
npx prisma db push
```
