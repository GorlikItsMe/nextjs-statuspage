# NextJs StatusPage

Strona z statusem twoich usług napisana przy użyciu Nextjs, Typescript. Używająca PlanetScale oraz cronhub.io

## Setup

### Next.js

```bash
npm install
npm run dev
npm build
```

### Prisma (database)

```bash
npx prisma db push # synchronizowane bazy danych
npx prisma studio # tryb studia (łatwe edytowanie bazy danych)
```

### cronhub.io

Ustaw cron na `*/5 * * * *` (co 5 min) żeby robił GET'a do `/api/cron`

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

## Setup PlanetScale

```
sudo apt-get install mysql-client
wget https://github.com/planetscale/cli/releases/download/v0.88.0/pscale_0.88.0_linux_amd64.deb
sudo dpkg -i pscale_0.88.0_linux_amd64.deb

pscale login

pscale shell statuspage main  # access to database sql
```
