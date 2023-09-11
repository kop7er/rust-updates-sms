import "https://deno.land/std@0.201.0/dotenv/load.ts";

type VersionType = "client" | "server" | "oxide" | "carbon" | "protocol";

type VersionInfo = {
    version: string;
    releaseDate: string;
    releaseUnix: number;
};

type CurrentVersionsResponse = Record<VersionType, VersionInfo>;

const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
const myPhoneNumber = Deno.env.get("MY_PHONE_NUMBER");

if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber || !myPhoneNumber) {

    console.error("------------------------------------------")
    console.error("Missing required environment variables");
    console.error("------------------------------------------")
    console.error(`TWILIO_ACCOUNT_SID -> ${twilioAccountSid ? "✓" : "X"}`);
    console.error(`TWILIO_AUTH_TOKEN -> ${twilioAuthToken ? "✓" : "X"}`);
    console.error(`TWILIO_PHONE_NUMBER -> ${twilioPhoneNumber ? "✓" : "X"}`);
    console.error(`MY_PHONE_NUMBER -> ${myPhoneNumber ? "✓" : "X"}`);
    console.error("------------------------------------------")

    Deno.exit(1);

}

const storedVersions = new Map<VersionType, string>();

const updateMessages = new Map<VersionType, string>([
    ["client", "New client update available"],
    ["server", "New server update available"],
    ["oxide", "New oxide update available"],
    ["carbon", "New carbon update available"],
    ["protocol", "The protocol has been updated, which means the lastest update is mandatory"]
]);

function isUpdateTypeEnabled(versionType: VersionType): boolean {

    const versionTypeSetting = Deno.env.get(`${versionType.toUpperCase()}_UPDATES`)?.toLowerCase();

    return !!versionTypeSetting && (versionTypeSetting === "true" || versionTypeSetting === "1");

}

function printEnabledUpdateTypes() {

    console.log("------------------------------------------")
    console.log("Enabled update types");
    console.log("------------------------------------------")

    updateMessages.forEach((_, updateType) => {

        const isEnabled = isUpdateTypeEnabled(updateType);

        console.log(`${updateType.charAt(0).toUpperCase() + updateType.slice(1)} -> ${isEnabled ? "✓" : "X"}`);

    });

    console.log("------------------------------------------")

}

async function checkForUpdates() {

    try {

        console.log("Checking for updates...");

        const currentVersions: CurrentVersionsResponse = await fetch("https://api.rusttools.xyz/versions").then(res => res.json());

        updateMessages.forEach((message, updateType) => {

            if (!isUpdateTypeEnabled(updateType)) {

                return;

            }

            const storedVersion = storedVersions.get(updateType);

            const currentVersion = currentVersions[updateType].version;

            if (!storedVersion) {

                storedVersions.set(updateType, currentVersion);

            } else if (storedVersion !== currentVersion) {

                storedVersions.set(updateType, currentVersion);

                fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`
                    },

                    body: new URLSearchParams({
                        "From": twilioPhoneNumber!,
                        "To": myPhoneNumber!,
                        "Body": message.replace("NEW_VERSION", currentVersion).replace("OLD_VERSION", storedVersion)
                    })

                }).catch(error => console.error(`Error sending ${updateType} update message:`, error));

            }

        });

    } catch (error) {

        console.error(error);

    }

}

console.log("Starting up...");

printEnabledUpdateTypes();

checkForUpdates();
setInterval(checkForUpdates, 60000); // Every minute
