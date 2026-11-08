# Azure VM pricing

Mass-pricing of VMs on Azure based on CPU cores count and memory. This is useful when costing a lift-and-shift migration dealing with many thousands VMS of varied sizes.

:rotating_light: This tool will only provide you with an **estimation**. Depending on your Azure spend you might be able to get a better deal from Microsoft. You should use the output of this tool as a coarse-grain estimation. On top of the VM price you will also need to consider [storage][managed-disks-pricing] and [egress][bandwidth-pricing-details] costs.

This tool is composed of two components:

1. A [Parser](#parser) retrieving the prices from [Virtual Machines Pricing][virtual-machines-pricing].
2. A [Coster](#coster) using the output from the Parser and a list of VM specifications to determine their price.

This approach allows to decouple price acquisition from its usage and open the door to automation. The Parser can be scheduled to retrieve the prices at regular interval and the Coster can then use always up-to-date prices.

[![Build Status][github-actions-parser-shield]][github-actions-parser] ([tests documentation](./docs/parser-tests.md))

[![Build Status][github-actions-coster-shield]][github-actions-coster]

## Parser

Retrieve VMs **hourly prices** for a specific combination of **culture**, **currency**, **operating system** and **region**.

:rotating_light: the parser does not support the Azure China regions, their prices are published on a [different website][azure-china].

### Parser pre-requisites

- [Node.js 24][node-js-lts] (see `parser/.nvmrc`)
- [Yarn modern][yarn-modern]

```powershell
> cd .\parser\
> yarn
```

### Parser usage

```powershell
> cd .\parser\
> yarn crawl --culture en-us --currency usd --operating-system linux --region us-west --output-path .\out\
```

You can also use short names:

```powershell
> yarn crawl -l en-us -c usd -o linux -r us-west -p .\out\
```

Arguments (all optional):

- `culture` (short name `-l`): [available cultures](#supported-cultures), **will impact the formatting of the pricing** (defaults to `en-au`)
- `currency` (short name `-c`): [available currencies](#supported-currencies) (defaults to `aud`)
- `operating-system` (short name `-o`): [available OS/Software](#supported-ossoftware) (defaults to `windows`)
- `region` (short name `-r`): [available regions](#supported-regions) (defaults to `australia-southeast`)
- `output-path` (short name `-p`): where the output files will be written (defaults to `.\out\`)
- `debug` (short name `-d`): when the crawl fails, writes the console log (`JSON`) and a screenshot of the page (`PNG`) to the `log-path` directory
- `log-path` (short name `-g`): where the debug log and screenshot will be written (defaults to `.\out\log\`)

### Parser output

Writes `2` output files in the `out\` directory, or the directory specified by the `--output-path` argument. One is a `CSV`, the other one is `JSON`. Both files contain the same data.

```text
.\out\vm-pricing_<region>_<operating-system>.csv
.\out\vm-pricing_<region>_<operating-system>.json
```

Fields:

| `CSV` column                                         | `JSON` property                              |
| ---------------------------------------------------- | -------------------------------------------- |
| `INSTANCE`                                           | `instance`                                   |
| `VCPU`                                               | `vCpu`                                       |
| `RAM`                                                | `ram`                                        |
| `PAY AS YOU GO`                                      | `payAsYouGo`                                 |
| `PAY AS YOU GO WITH AZURE HYBRID BENEFIT`            | `payAsYouGoWithAzureHybridBenefit`           |
| `ONE YEAR RESERVED`                                  | `oneYearReserved`                            |
| `ONE YEAR RESERVED WITH AZURE HYBRID BENEFIT`        | `oneYearReservedWithAzureHybridBenefit`      |
| `THREE YEAR RESERVED`                                | `threeYearReserved`                          |
| `THREE YEAR RESERVED WITH AZURE HYBRID BENEFIT`      | `threeYearReservedWithAzureHybridBenefit`    |
| `SPOT`                                               | `spot`                                       |
| `SPOT WITH AZURE HYBRID BENEFIT`                     | `spotWithAzureHybridBenefit`                 |
| `ONE YEAR SAVINGS PLAN`                              | `oneYearSavingsPlan`                         |
| `ONE YEAR SAVINGS PLAN WITH AZURE HYBRID BENEFIT`    | `oneYearSavingsPlanWithAzureHybridBenefit`   |
| `THREE YEAR SAVINGS PLAN`                            | `threeYearSavingsPlan`                       |
| `THREE YEAR SAVINGS PLAN WITH AZURE HYBRID BENEFIT`  | `threeYearSavingsPlanWithAzureHybridBenefit` |

Prices are hourly. When a price is not available for an instance, the `CSV` contains `N/A` and the `JSON` property is omitted. For cultures using a comma as the decimal point (e.g. `fr-fr`), the `CSV` prices are quoted (e.g. `"0,1876"`), the `JSON` always uses a period.

### Docker

#### Build the Docker image

You can build a `Docker` image for the `azure-vm-pricing`:

```bash
# Parser Docker image
cd parser
# For Linux machines running on x86_64 or in Windows WSL
docker build -f ./Dockerfile --platform linux/amd64 --build-arg ARCH=amd64 -t azure-vm-pricing .
# For Linux machines running on arm64, for example Apple Macbooks with Apple Silicon
docker build -f ./Dockerfile --platform linux/arm64 --build-arg ARCH=arm64 -t azure-vm-pricing .
```

#### Run the Docker image

You can run the `azure-vm-pricing` image:

```bash
docker run --rm -it -v ./data:/data/ azure-vm-pricing:latest bash -c "yarn crawl --culture en-us --currency eur --operating-system linux --region europe-west -p /data/"
```

## Coster

Price VMs using the `JSON` prices files generated by the Parser. For each VM, the Coster selects the instance with the cheapest _Pay as You Go_ price that has enough CPU cores and RAM, in the same region and for the same operating system.

### Coster pre-requisites

- [.NET SDK 8.x][dotnet-sdk]

### Coster usage

You should paste the `JSON` prices files generated by the Parser in the `coster\src\AzureVmCoster\Prices\` folder. Setting the `culture` is only relevant when dealing with prices and input files that were written using another culture with a different decimal point (e.g. comma vs period).

In `Release` mode:

```powershell
> cd .\coster\src\AzureVmCoster
> dotnet run --configuration Release -- --input <input-path> --culture <culture>
> dotnet run --configuration Release -- --input <input-path> --configuration <configuration-path>
> dotnet run --configuration Release -- -i <input-path> -l <culture>
> dotnet run --configuration Release -- -i <input-path> -c <configuration-path>
> dotnet run --configuration Release -- -i <input-path>
```

Arguments:

- `input` (short name `-i`): the input `CSV` file (required)
- `configuration` (short name `-c`): the [Coster configuration](#coster-configuration) file (optional)
- `culture` (short name `-l`): the culture used to read the input file and write the output file (optional, defaults to the system culture)

You can exclude VMs by providing a configuration file, see [Coster configuration](#coster-configuration).

In `Debug` mode:

```powershell
> cd .\coster\src\AzureVmCoster
> dotnet run --configuration Debug
Input file path: <input-path>
Configuration file path (leave blank if not used): 
Culture (leave blank for system default):
```

You'll need to provide the `<input-path>` when prompted, the configuration file path and culture are optional.

`<input-path>` should point to a `CSV` file with the following fields:

- _Region_
- _Name_
- _CPU_ (a `short`)
- _RAM_ (in `GB`, a `decimal`)
- _Operating System_

The columns can be in any order and the `CSV` file can contain extra-columns. The _Region_ and _Operating System_ fields must match [existing regions](#supported-regions) and [supported operating systems](#supported-ossoftware) in the Virtual Machines Pricing website (the comparison is case-insensitive). A `JSON` prices file must be present for every combination of _Region_ and _Operating System_ in the input file.

When _CPU_ or _RAM_ is `0`, the Coster uses the median of the non-zero values of the other VMs instead. The fields cannot be blank.

### Coster output

The `Coster` will generate a `CSV` file with the same name as the input file in the `Out\` directory, with the following fields:

- _Region_
- _Name_
- _Operating System_
- _Instance_
- _CPU_
- _RAM_
- _Pay as You Go_
- _Pay as You Go with Azure Hybrid Benefit_
- _One Year Reserved_
- _One Year Reserved with Azure Hybrid Benefit_
- _Three Year Reserved_
- _Three Year Reserved with Azure Hybrid Benefit_
- _Spot_
- _Spot with Azure Hybrid Benefit_
- _One Year Savings plan_
- _One Year Savings plan with Azure Hybrid Benefit_
- _Three Year Savings plan_
- _Three Year Savings plan with Azure Hybrid Benefit_

When no instance has enough CPU cores and RAM, the Coster logs a warning and writes the VM with its own _CPU_ and _RAM_, but without an _Instance_ and prices.

## Supported cultures

Supported cultures (newer cultures might have been added after I last updated the `README`, they're likely to be supported):

- `cs-cz` (Čeština (Česká republika))
- `da-dk` (Dansk (Danmark))
- `de-de` (Deutsch (Deutschland))
- `en-au` (English (Australia))
- `en-ca` (English (Canada))
- `en-in` (English (India))
- `en-gb` (English (United Kingdom))
- `en-us` (English (United States))
- `es-es` (Español (España))
- `es-mx` (Español (México))
- `fr-ca` (Français (Canada))
- `fr-fr` (Français (France))
- `id-id` (Indonesia (Indonesia))
- `it-it` (Italiano (Italia))
- `hu-hu` (Magyar (Magyarország))
- `nl-nl` (Nederlands (Nederland))
- `nb-no` (Norsk (Norge))
- `pl-pl` (Polski (Polska))
- `pt-br` (Português (Brasil))
- `pt-pt` (Português (Portugal))
- `sv-se` (Svenska (Sverige))
- `tr-tr` (Türkçe (Türkiye))
- `ru-ru` (Русский (Россия))
- `ko-kr` (한국어 (대한민국))
- `zh-cn` (中文(中国))
- `ja-jp` (日本語 (日本))
- `zh-tw` (繁體中文 (台灣))

## Supported currencies

Supported currencies (newer currencies might have been added after I last updated the `README`, they're likely to be supported):

- `usd` (United States – Dollar ($) USD)
- `aud` (Australia – Dollar ($) AUD)
- `brl` (Brazil – Real (R$) BRL)
- `cad` (Canada – Dollar ($) CAD)
- `dkk` (Denmark – Krone (kr) DKK)
- `eur` (Euro Zone – Euro (€) EUR)
- `inr` (India – Rupee (₹) INR)
- `jpy` (Japan – Yen (¥) JPY)
- `krw` (Korea – Won (₩) KRW)
- `nzd` (New Zealand – Dollar ($) NZD)
- `nok` (Norway – Krone (kr) NOK)
- `rub` (Russia – Ruble (руб) RUB)
- `sek` (Sweden – Krona (kr) SEK)
- `chf` (Switzerland – Franc (chf) CHF)
- `twd` (Taiwan – Dollar (NT$) TWD)
- `gbp` (United Kingdom – Pound (£) GBP)

## Supported OS/Software

Supported OS/Software (newer OS/Software might have been added after I last updated the `README`, they're likely to be supported):

- Linux
  - `linux` (Ubuntu)
  - `azure-linux` (Azure Linux (Preview))
  - `red-hat` (Red Hat Enterprise Linux)
  - `rhel-ha` (Red Hat Enterprise Linux with HA)
  - `rhel-sap-ha` (RHEL for SAP with HA)
  - `rhel-sap-business` (RHEL for SAP Business Applications)
  - `sles-basic` (SUSE Linux Enterprise + Patching only)
  - `sles-standard` (SUSE Linux Enterprise + 24x7 Support)
  - `sles-hpc-standard` (SUSE Linux Enterprise for HPC + 24x7 Support)
  - `sles-sap` (SUSE Linux Enterprise for SAP Applications + 24x7 Support)
  - `ubuntu-pro` (Ubuntu Pro)
  - `ubuntu-advantage-essential` (Ubuntu Advantage Essential (Support))
  - `ubuntu-advantage-standard` (Ubuntu Advantage Standard (Support))
  - `ubuntu-advantage-advanced` (Ubuntu Advantage Advanced (Support))
  - `sql-server-developer-ubuntu-pro` (SQL Server Developer Ubuntu Pro)
  - `sql-server-enterprise-ubuntu-pro` (SQL Server Enterprise Ubuntu Pro)
  - `sql-server-standard-ubuntu-pro` (SQL Server Standard Ubuntu Pro)
  - `sql-server-web-ubuntu-pro` (SQL Server Web Ubuntu Pro)
  - `sql-server-enterprise-linux` (SQL Server Enterprise Ubuntu Linux)
  - `sql-server-standard-linux` (SQL Server Standard Ubuntu Linux)
  - `sql-server-web-linux` (SQL Server Web Ubuntu Linux)
  - `sql-server-enterprise-redhat` (SQL Server Enterprise Red Hat Enterprise Linux)
  - `sql-server-standard-redhat` (SQL Server Standard Red Hat Enterprise Linux)
  - `sql-server-web-redhat` (SQL Server Web Red Hat Enterprise Linux)
  - `sql-server-enterprise-sles` (SQL Server Enterprise SUSE Priority)
  - `sql-server-standard-sles` (SQL Server Standard SUSE Priority)
  - `sql-server-web-sles` (SQL Server Web SUSE Priority)
- Windows
  - `windows` (Windows OS)
  - `biztalk-enterprise` (BizTalk Enterprise)
  - `biztalk-standard` (BizTalk Standard)
  - `sharepoint` (SharePoint)
  - `sql-server-enterprise` (SQL Server Enterprise)
  - `sql-server-standard` (SQL Server Standard)
  - `sql-server-web` (SQL Server Web)

## Supported regions

Supported regions (newer regions might have been added after I last updated the `README`, they're likely to be supported):

- United States
  - `us-central` (Central US)
  - `us-east` (East US)
  - `us-east-2` (East US 2)
  - `us-north-central` (North Central US)
  - `us-south-central` (South Central US)
  - `us-west-central` (West Central US)
  - `us-west` (West US)
  - `us-west-2` (West US 2)
  - `us-west-3` (West US 3)
- United Kingdom
  - `united-kingdom-south` (UK South)
  - `united-kingdom-west` (UK West)
- United Arab Emirates
  - `uae-central` (UAE Central)
  - `uae-north` (UAE North)
- Taiwan
  - `taiwan-north` (Taiwan North)
- Switzerland
  - `switzerland-north` (Switzerland North)
  - `switzerland-west` (Switzerland West)
- Sweden
  - `sweden-central` (Sweden Central)
  - `sweden-south` (Sweden South)
- Spain
  - `spain-central` (Spain Central)
- Qatar
  - `qatar-central` (Qatar Central)
- Poland
  - `poland-central` (Poland Central)
- Norway
  - `norway-east` (Norway East)
  - `norway-west` (Norway West)
- New Zealand
  - `new-zealand-north` (New Zealand North)
- Mexico
  - `mexico-central` (Mexico Central)
- Malaysia
  - `malaysia-west` (Malaysia West)
- Korea
  - `korea-central` (Korea Central)
  - `korea-south` (Korea South)
- Japan
  - `japan-east` (Japan East)
  - `japan-west` (Japan West)
- Italy
  - `italy-north` (Italy North)
- Israel
  - `israel-central` (Israel Central)
- Indonesia
  - `indonesia-central` (Indonesia Central)
- India
  - `central-india` (Central India)
  - `south-central-india` (India South Central)
  - `south-india` (South India)
  - `west-india` (West India)
- Germany
  - `germany-north` (Germany North)
  - `germany-west-central` (Germany West Central)
- France
  - `france-central` (France Central)
  - `france-south` (France South)
- Europe
  - `europe-north` (North Europe)
  - `europe-west` (West Europe)
- Denmark
  - `denmark-east` (Denmark East)
- Chile
  - `chile-central` (Chile Central)
- Canada
  - `canada-central` (Canada Central)
  - `canada-east` (Canada East)
- Brazil
  - `brazil-south` (Brazil South)
  - `brazil-southeast` (Brazil Southeast)
- Belgium
  - `belgium-central` (Belgium Central)
- Azure Government
  - `usgov-arizona` (US Gov Arizona)
  - `usgov-texas` (US Gov Texas)
  - `usgov-virginia` (US Gov Virginia)
- Austria
  - `austria-east` (Austria East)
- Australia
  - `australia-central` (Australia Central)
  - `australia-central-2` (Australia Central 2)
  - `australia-east` (Australia East)
  - `australia-southeast` (Australia Southeast)
- Asia Pacific
  - `asia-pacific-east` (East Asia)
  - `asia-pacific-southeast` (Southeast Asia)
- Africa
  - `south-africa-north` (South Africa North)
  - `south-africa-west` (South Africa West)

## Coster configuration

The only configuration available currently is `excludedVms`, it takes an array of instance names. These instances won't be considered when costing VMs.

For example, if you want to discard all burstable VMs, you can use the below configuration file:

```json
{
  "excludedVms": [
    "B2ts v2",
    "B2ls v2",
    "B2s v2",
    "B4ls v2",
    "B4s v2",
    "B8ls v2",
    "B8s v2",
    "B16ls v2",
    "B16s v2",
    "B32ls v2",
    "B32s v2",
    "B2ats v2",
    "B2als v2",
    "B2as v2",
    "B4als v2",
    "B4as v2",
    "B8als v2",
    "B8as v2",
    "B16als v2",
    "B16as v2",
    "B32als v2",
    "B32as v2",
    "B1s",
    "B1ms",
    "B2s",
    "B2ms",
    "B4ms",
    "B8ms",
    "B12ms",
    "B16ms",
    "B20ms"
  ]
}
```

[virtual-machines-pricing]: https://azure.microsoft.com/en-au/pricing/details/virtual-machines/windows/
[managed-disks-pricing]: https://azure.microsoft.com/en-us/pricing/details/managed-disks/
[bandwidth-pricing-details]: https://azure.microsoft.com/en-us/pricing/details/bandwidth/
[azure-china]: https://www.azure.cn/en-us/pricing/details/virtual-machines/
[dotnet-sdk]: https://dotnet.microsoft.com/download/dotnet/8.0
[github-actions-parser-shield]: https://github.com/gabrielweyer/azure-vm-pricing/actions/workflows/parser.yml/badge.svg
[github-actions-parser]: https://github.com/gabrielweyer/azure-vm-pricing/actions/workflows/parser.yml
[github-actions-coster-shield]: https://github.com/gabrielweyer/azure-vm-pricing/actions/workflows/coster.yml/badge.svg
[github-actions-coster]: https://github.com/gabrielweyer/azure-vm-pricing/actions/workflows/coster.yml
[yarn-modern]: https://yarnpkg.com/getting-started/install
[node-js-lts]: https://nodejs.org/en/download/
