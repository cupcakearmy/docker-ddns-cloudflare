# Docker DDNS Cloudflare

## Features 🌈

- Simple container for setting setting and updating cloudflare records to your local ip address.
- Only makes requests if the IP has changed.
- By default it runs once every minute and the IP is resolved by https://api.ipify.org/.

## Quickstart 🚀

1. Get your api token [here](https://dash.cloudflare.com/profile/api-tokens) (Top right -> My Profile -> API Tokens)

Click create token. You can then use the Edit DNS Zone template. Give it a name.

![Settings](https://i.imgur.com/dLs8PHs.png)

2. Create an `.env` file:

```bash
EMAIL=my@mail.com
KEY=my_api_key
ZONE=example.org
DNS_RECORD=some.example.org
```

3. Run the container

```bash
docker run -d --name ddns --restart always --env-file .env cupcakearmy/ddns-cloudflare
```

To check logs:

```bash
docker logs ddns
```

### Docker-Copmose

With docker-compose:

```bash
git clone https://github.com/CupCakeArmy/docker-ddns-cloudflare.git
cp .sample.env .env
# Edit the .env file with your data
docker-compose up -d
```

## Customize

### Custom CRON

By default the script runs every 5 minutes. You can customize this by simply setting the `CRON` value in the `.env` file.

```bash
# .env

# e.g. every minute
CRON=* * * * *
```

### Custom Resolver

By default the script checks the own ip by calling `https://api.ipify.org/`. This also can be configured. It has to be an endpoint that return a plain text containing the ip by get request.

```bash
# .env

RESOLVER=https://ipv4.icanhazip.com/
```
