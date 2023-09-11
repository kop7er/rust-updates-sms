# Rust Updates SMS

A simple SMS notification service, via Twillio, for Rust and related projects updates

Built with [Deno](https://deno.land/), [TypeScript](https://www.typescriptlang.org/), and [Twilio](https://www.twilio.com/)

Support -> <https://discord.gg/KRqDu5X>

## Deploying

Via Docker:

```bash
docker run \
    -e "TWILIO_ACCOUNT_SID=..." \
    -e "TWILIO_AUTH_TOKEN=..." \
    -e "TWILIO_PHONE_NUMBER=..." \
    -e "MY_PHONE_NUMBER=..." \
    -e "CLIENT_UPDATES=..." \
    -e "SERVER_UPDATES=..." \
    -e "OXIDE_UPDATES=..." \
    -e "CARBON_UPDATES=..." \
    -e "PROTOCOL_UPDATES=..." \
    kop7er/rust-updates-sms:latest
```

## Environment Variables

| Name                  | Description                 | Required | Example      |
|-----------------------|-----------------------------|----------| ------------ |
| `TWILIO_ACCOUNT_SID`  | Twilio Account SID          | Yes      |              |
| `TWILIO_AUTH_TOKEN`   | Twilio Auth Token           | Yes      |              |
| `TWILIO_PHONE_NUMBER` | Twilio Phone Number         | Yes      | +15555555555 |
| `MY_PHONE_NUMBER`     | Your Phone Number           | Yes      | +15555555555 |
| `CLIENT_UPDATES`      | Enable Client Updates SMS   | No       | true         |
| `SERVER_UPDATES`      | Enable Server Updates SMS   | No       | false        |
| `OXIDE_UPDATES`       | Enable Oxide Updates SMS    | No       | 1            |
| `CARBON_UPDATES`      | Enable Carbon Updates SMS   | No       | 0            |
| `PROTOCOL_UPDATES`    | Enable Protocol Updates SMS | No       |              |

## License

[MIT](LICENSE)
