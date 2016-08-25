# SaoYe

This is the source code of SaoYe (骚也) website.

## Set up.

You need MongoDB and NodeJS to run SaoYe in the local.

1. In sub-directory `saoye`, run `npm install`.
2. Within the directory, create file `.env`. Type in the following content in `.env` file:

```javascript
NODE_ENV="development"
COOKIE_SECRET=<COOKIE_SECRET> // Just some random string is fine.
``` 

3. Ensure your mongo service is run. Then run `npm start`. The website should be able to
 access from `localhost:3000`.

## Deployment

You have to have the proper permission on heroku dyno.

1. In you repo, `git remote add heroku <path-to-git-repository>`.
2. `git fetch heroku`.
3. When you need to deploy, (in root repository) use `git push heroku:master --force`.