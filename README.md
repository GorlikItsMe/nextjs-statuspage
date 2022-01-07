# NextJs StatusPage

Status page app which can be easily deployed on [Vercel](https://vercel.com)

Nextjs, Typescript, Prisma, (database ORM) PlanetScale (database host) and cronhub.io (trigger check service event)

## Setup

1. `yarn`
2. Create Database on [PlanetScale](https://app.planetscale.com/)
3. Copy `.env.example` to `.env`
4. Set correct `DATABASE_URL` in `.env` file
5. `yarn db:generate`
6. `yarn db:push`
7. Open prisma studio (database client) `yarn db:studio`
8. Create new Categorys in Category table
9. Create new Services in Service table
10. `yarn dev`
11. Check localhost:3000 (if you can see services list is ok)
12. Go to [cronhub.io](https://cronhub.io) and create account
13. Set cron to `*/5 * * * *` (every 5min) to open `https://YOURDOMAIN.COM/api/cron`
