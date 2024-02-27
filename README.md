# Docker DDNS Cloudflare

![Docker Pulls](https://img.shields.io/docker/pulls/cupcakearmy/ddns-cloudflare?style=flat-square)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/cupcakearmy/ddns-cloudflare/latest?style=flat-square)
![Docker Image Version (tag latest semver)](https://img.shields.io/docker/v/cupcakearmy/ddns-cloudflare/latest?style=flat-square)

## Features 🌈

- Simple container for setting setting and updating cloudflare records to your local ip address.
- Only makes requests if the IP has changed.
- By default it runs once every minute and the IP is resolved by https://api.ipify.org/.

## Quickstart 🚀

1. Get your API Token [here](https://dash.cloudflare.com/profile/api-tokens) (Top right -> My Profile -> API Tokens)

Click create token. You can then use the Edit DNS Zone template. Give it a name.

2. Create an `.env` file:

```bash
TOKEN=mytoken

ZONE=example.org
DNS_RECORD=some.example.org
PROXIED=false
```

3. Run the container

```bash
docker run -d --name ddns --restart always --env-file .env cupcakearmy/ddns-cloudflare
```

### Docker-Copmose

With docker-compose:

```bash
git clone https://github.com/CupCakeArmy/docker-ddns-cloudflare.git
cp .sample.env .env
# Edit the .env file with your data
docker-compose up -d
```

## ENV Reference

| Env          | Default                  | Description                                                                                                 |
| ------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `TOKEN`      |                          | API Token.                                                                                                  |
| `ZONE`       |                          | Cloudflare zone where your domain is.                                                                       |
| `DNS_RECORD` |                          | The actual DNS record that should be updated.                                                               |
| `PROXIED`    | `true`                   | Whether the record is proxied by CloudFlare or not.                                                         |
| `CRON`       | `*/5 * * * *`            | Frequency of updates. The [following syntax](https://croner.56k.guru/usage/pattern/) is supported           |
| `RESOLVER`   | `https://api.ipify.org/` | The endpoint used to determine your public ip.                                                              |
| `LOG_LEVEL`  | `info`                   | Log level to run at. See [winston](https://github.com/winstonjs/winston#logging-levels) for possible values |

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
