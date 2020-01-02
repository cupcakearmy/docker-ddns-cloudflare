# Docker DDNS Cloudflare
This container is an adapted version of [this](https://gist.github.com/benkulbertis/fff10759c2391b6618dd) script. It runs once every minute and only makes requests if the IP has changed since last time. The IP is resolved by https://canihazip.com.

## Quickstart 🚀

1. Get yout api token [here](https://dash.cloudflare.com/) (Top right -> My Profile -> Scroll Down -> Global Api Key)

2. Create the wanted DNS record (e.g. `some.example.com`). The script can only update it, not create it.

3. Create an `.env` file:

```bash
EMAIL=my@mail.com
KEY=my_api_key
ZONE=example.org
DNS_RECORD=some.example.org
```

4. Run the container

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
