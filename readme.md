# 🦈 Sharkoders' website 🦈

[![GPLv3 License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/) [![GitHub issues](https://img.shields.io/github/issues/sharkoders/website.svg?style=flat)]() [![GitHub PR](https://img.shields.io/github/issues-pr/sharkoders/website.svg?style=flat)]()

## 💻 Local development 💻

### 🏗️ Prerequisites

> [!INFO]
> We recommand to have a UNIX system on your machine for a better development experience.
> In case you're using Windows, install WSL2 if not already done.

You'll need to have `docker` and `openssl` installed on your machine.

### 🔐 Issuing self-signed certificates

As the servers are HTTPS only, you'll need to issue certificates yourself.

For UNIX users, simply run the `generate-dev-certs.sh` script.

### 🕵️ Getting the `.env` file

Contact us, we will provide you with an adequate `.env` file.

### 🐋 Running docker

Run the following line to start the website:
```sh
docker compose up --build
```

If you want to rebuild a service or restart (if there was an error for example), run:
```sh
docker compose build <service>
docker compose restart <service>
```

## ⚖️ License ⚖️

[The MIT License](license)