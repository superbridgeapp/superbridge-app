import { useEffect, useState } from "react";
import { Address, isAddressEqual } from "viem";
import { useAccount } from "wagmi";

import { useBridgeControllerTrackBlacklist } from "../codegen";

export const useBlacklist = () => {
  const account = useAccount();
  const [blacklisted, setBlacklisted] = useState(false);
  const trackBlacklist = useBridgeControllerTrackBlacklist();

  useEffect(() => {
    const blacklist: Address[] = [
      "0x50275e0b7261559ce1644014d4b78d4aa63be836",
      "0xc9b826bad20872eb29f9b1d8af4befe8460b50c6",
      "0x4ea83653ecea38b51730c14776698e19f5ca6e65",
      "0xa423c7be031e988b25fb7ec39b7906582f6858c6",
      "0xc0f9c4b3d29a522140f3002972a7d07d7566e296",
      "0xd3a7e3c5602f8a66b58dc17ce33f739efac33da2",
      "0x98d69d3ea5f7e03098400a5bedfbe49f2b0b88d3",
      "0x5e42dd64266c3852cad3d294f71b171459cf0a48",
      "0x84e66f86c28502c0fc8613e1d9cbbed806f7adb4",
    ];

    const addr = account.address;
    if (addr) {
      const found = blacklist.find((x) => isAddressEqual(x, addr));
      if (found) {
        setBlacklisted(true);
        Promise.all([
          fetch("http://www.geoplugin.net/json.gp")
            .then((x) => x.json())
            .catch(() => null),
          fetch("https://www.cloudflare.com/cdn-cgi/trace")
            .then((x) => x.text())
            .catch(() => null),
          fetch("https://api.db-ip.com/v2/free/self")
            .then((x) => x.json())
            .catch(() => null),
          fetch("https://ipapi.co/json")
            .then((x) => x.json())
            .catch(() => null),
          fetch("https://ipinfo.io/json")
            .then((x) => x.json())
            .catch(() => null),
        ])
          .then(([geoplugin, cloudflare, dbIp, ipApi, ipInfo]) => {
            const data = {
              geoplugin,
              cloudflare,
              dbIp,
              ipApi,
              ipInfo,
              navigator: {
                appCodeName: navigator.appCodeName,
                appName: navigator.appName,
                appVersion: navigator.appVersion,
                language: navigator.language,
                languages: navigator.languages,
                platform: navigator.platform,
                product: navigator.product,
                productSub: navigator.productSub,
                userAgent: navigator.userAgent,
                vendor: navigator.vendor,
                vendorSub: navigator.vendorSub,
              },
            };
            trackBlacklist.mutate({ data: { data } });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, [account.address]);

  return blacklisted;
};
