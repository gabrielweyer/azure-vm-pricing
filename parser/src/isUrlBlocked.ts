const blockedUrls = [
  'https://www.microsoft.com/library/svy/azure/broker.js',
];

const blockedDomains = [
  'https://munchkin.marketo.net/',
  'https://cdnssl.clicktale.net/',
  'https://publisher.liveperson.net/',
  'https://www.facebook.com/',
  'https://googleads.g.doubleclick.net/',
  'https://dc.ads.linkedin.com/',
  'https://dpm.demdex.net/',
  'https://mscom.demdex.net/',
  'https://msftenterprise.sc.omtrdc.net/',
  'https://cm.everesttech.net/',
  'https://sync.mathtag.com/',
  'https://ib.adnxs.com/',
  'https://idsync.rlcdn.com/',
  'https://cm.g.doubleclick.net/',
  'https://rtd.tubemogul.com/',
  'https://idpix.media6degrees.com/',
  'https://ad.doubleclick.net/'
];

const blockedFiles = [
  '/LivePersonChat-iframe.js'
];

export function isUrlBlocked(url: string): boolean {
  if (blockedUrls.includes(url)) {
    return true;
  }

  for (let offset = 0; offset < blockedDomains.length; offset++) {
    if (url.startsWith(blockedDomains[offset])) {
      return true;
    }
  }

  for (let offset = 0; offset < blockedFiles.length; offset++) {
    if (url.endsWith(blockedFiles[offset])) {
      return true;
    }
  }

  return false;
}
