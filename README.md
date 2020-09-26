# Azure VM pricing

Mass-pricing of `VMs` on `Azure` based on `CPU` cores count and memory. This is useful when costing a lift-and-shift migration dealing with many thousands `VMS` of varied sizes.

The pricing is retrieved from [Virtual Machines Pricing][virtual-machines-pricing].

:rotating_light: This tool will only provide you with an **estimation**. Depending on your `Azure` spends you might be able to get a better deal from `Microsoft`. You should use the output of this tool as a coarse-grain estimation. On top of the `VM` price you will also need to consider [storage][managed-disks-pricing] and [egress][bandwidth-pricing-details] costs.

This tool is composed of two components:

1. A [Parser](#parser) retrieving the pricing from [Virtual Machines Pricing][virtual-machines-pricing]
2. A [Coster](#coster) using the output from the `Parser` and a list of `VM` specifications to determine their price

This approach allows to decouple pricing acquisition from its usage and open the door to automation. The `Parser` can be scheduled to retrieve the pricing at regular interval and the `Coster` can then use an always up-to-date pricing.

[![Build Status](https://dev.azure.com/gabrielweyer/azure-vm-pricing/_apis/build/status/Parser?branchName=master&label=Parser)](https://dev.azure.com/gabrielweyer/azure-vm-pricing/_build/latest?definitionId=14&branchName=master)

[![Build Status](https://dev.azure.com/gabrielweyer/azure-vm-pricing/_apis/build/status/Coster?branchName=master&label=Coster)](https://dev.azure.com/gabrielweyer/azure-vm-pricing/_build/latest?definitionId=18&branchName=master)

## Parser

Retrieve `VMs` **hourly pricing** for a specific combination of **culture**, **currency**, **operating system** and **region**.

| Culture | Culture display name | Currency | Currency display name | Support |
| - | - | - | - | - |
| `en-us` | `English (US)` | `USD` | `US Dollar ($)` | :white_check_mark: |
| | | `SAR`[[8]](#closest-currency-8) | `Saudi Riyal (SR)` | :white_check_mark: |
| | | `IDR`[[11]](#closest-culture-11) | `Indonesian Rupiah (Rp)` | :white_check_mark: |
| `cs-cz` | `Čeština` | `EUR`[[1]](#closest-currency-1) | `Euro (€)` | :white_check_mark: |
| `da-dk` | `Dansk` | `DKK` | `Danish Krone (kr)` | :white_check_mark: |
| `de-de` | `Deutsch` | `EUR` | `Euro (€)` | :white_check_mark: |
| | | `CHF`[[9]](#closest-culture-9)  | `Swiss Franc. (chf)` | :white_check_mark: |
| `en-au` | `English (Australia)` | `AUD` | `Australian Dollar ($)` | :white_check_mark: |
| `en-ca` | `English (Canada)` | `CAD` | `Canadian Dollar ($)` | :white_check_mark: |
| `en-in` | `English (India)` | `INR` | `Indian Rupee (₹)` | :white_check_mark: |
| `en-gb` | `English (UK)` | `GBP` | `British Pound (£)` | :white_check_mark: |
| | | `MYR`[[6]](#closest-culture-6) | `Malaysian Ringgit (RM$)` | :white_check_mark: |
| | | `ZAR`[[4]](#closest-culture-4) | `South African Rand (R)` | :white_check_mark: |
| | | `NZD`[[7]](#closest-culture-7) | `New Zealand Dollar ($)` | :white_check_mark: |
| | | `HKD`[[10]](#closest-culture-10) | `Hong Kong Dollar (HK$)` | :white_check_mark: |
| `es-es` | `Español` | `EUR` | `Euro (€)` | :white_check_mark: |
| | | `ARS`[[5]](#closest-culture-5) | `Argentine Peso ($)` | :white_check_mark: |
| `es-mx` | `Español (MX)` | `MXN` | `Mexican Peso (MXN$)` | :white_check_mark: |
| `fr-fr` | `Français` | `EUR` | `Euro (€)` | :white_check_mark: |
| | | `CHF`[[9]](#closest-culture-9)  | `Swiss Franc. (chf)` | :white_check_mark: |
| `fr-ca` | `Français (Canada)` | `CAD` | `Canadian Dollar ($)` | :white_check_mark: |
| `it-it` | `Italiano` | `EUR` | `Euro (€)` | :white_check_mark: |
| | | `CHF`[[9]](#closest-culture-9) | `Swiss Franc. (chf)` | :white_check_mark: |
| `hu-hu` | `Magyar` | `EUR`[[1]](#closest-currency-1) | `Euro (€)` | :white_check_mark: |
| `nb-no` | `Norsk` | `NOK` | `Norwegian Krone (kr)` | :white_check_mark: |
| `nl-nl` | `Nederlands` | `EUR` | `Euro (€)` | :white_check_mark: |
| `pl-pl` | `Polski` | `EUR`[[1]](#closest-currency-1) | `Euro (€)` | :white_check_mark: |
| `pt-br` | `Português (Brasil)` | `BRL` | `Brazilian Real (R$)` | :white_check_mark: |
| `pt-pt` | `Português` | `EUR` | `Euro (€)` | :white_check_mark: |
| `sv-se` | `Svenska` | `SEK` | `Swedish Krona (kr)` | :white_check_mark: |
| `tr-tr` | `Türkçe` | `TRY` | `Turkish Lira (TL)` | :white_check_mark: |
| `ru-ru` | `Pусский` | `RUB` | `Russian Ruble (руб)` | :white_check_mark: |
| `ja-jp` | `日本語` | `JPY` | `Japanese Yen (¥)` | :white_check_mark: |
| `ko-kr` | `한국어` | `KRW` | `Korean Won (₩)` | :white_check_mark: |
| `zh-cn` | `中文(简体)` | `N/A` | `N/A` | `N/A` |
| `zh-tw` | `中文(繁體)` | `TWD` | `Taiwanese Dollar (NT$)` | :white_check_mark: |
| | | `HKD`[[10]](#closest-culture-10) | `Hong Kong Dollar (HK$)` | :white_check_mark: |

:rotating_light: the parser is not - yet - able to retrieve pricing for the regions `east-china2`, `north-china2`, `east-china` and `north-china` as it is available on a [different website][azure-china].

:rotating_light: the parser is not able to retrieve pricing for the regions `us-dod-central` and `us-dod-east` as no virtual machines are listed as publicly available.

### Parser pre-requisites

- `Node.js 12.13.0`
- `Yarn 1.22.4`

```powershell
> cd .\parser\
> yarn
```

### Parser usage

```powershell
> cd .\parser\
> yarn crawl --culture en-us --currency USD --operating-system linux --region us-west
```

You can also use short names:

```powershell
> yarn crawl -l en-us -c USD -o linux -r us-west
```

Arguments:

- `culture` any of the `option` `value` in the **Culture** `select`
  - **This will impact the formatting of the pricing**
- `currency` any of the `option` `value` in the **Currency** `select`
- `operating-system` any of the `option` `value` in the **OS/Software** `select`
- `region` any of the `option` `value` in the **Region** `select`

![OS and Region select](docs/assets/os-region.png)

In the footer:

![Culture and Currency select](docs/assets/culture-currency.png)

### Parser output

Writes `2` output files in the `out\` directory. One is a `CSV`, the other one is `JSON`. Both files contain the same data.

```text
.\out\vm-pricing_<region>_<operating-system>.csv
.\out\vm-pricing_<region>_<operating-system>.json
```

Fields:

- _Instance_
- _vCPU_
- _RAM_
- _Pay as You Go_
- _Pay as You Go With Azure Hybrid Benefit_
- _One Year Reserved_
- _One Year Reserved With Azure Hybrid Benefit_
- _Three Year Reserved_
- _Three Year Reserved With Azure Hybrid Benefit_
- _Spot_
- _Spot With Azure Hybrid Benefit_

### Parser tests

The parser has unit tests focusing on edge cases of price formatting:

```powershell
> cd .\parser\
> yarn test
```

The end-to-end tests attempt to compare known prices for the `windows` instance `D2 v3` in `us-west` using permutations of supported `culture` and `currency`:

```powershell
> cd .\parser\
> yarn e2e
```

## Coster

Price `VMs` using the `JSON` pricing files generated by the `Parser`. The `Coster` will select the cheapest `VM` that has enough `CPU` cores and `RAM`.

### Coster pre-requisites

- `.NET Core SDK 3.1`

### Coster usage

You should paste the `JSON` pricing files generated by the `Parser` in the `Pricing\` folder. Setting the `culture` is only relevant when dealing with pricing and input files that were written using another culture with a different decimal point (e.g. comma vs period).

In `Release` mode:

```powershell
> cd .\coster\src\AzureVmCoster
> dotnet run --configuration Release -- --input <input-path> --culture <culture>
> dotnet run --configuration Release -- -i <input-path> -l <culture>
> dotnet run --configuration Release -- -i <input-path>
```

The `culture` is optional.

In `Debug` mode

```powershell
> cd .\coster\src\AzureVmCoster
> dotnet run --configuration Debug
Input file path: <input-path>
Culture (leave blank for system default):
```

You'll need to provide the `<input-path>` when prompted, the `culture` is optional.

`<input-path>` should point to a `CSV` file with the following fields:

- _Region_
- _Name_
- _CPU_ (a `short`)
- _RAM_ (in `GB`, a `decimal`)
- _Operating System_

The columns can be in any order and the `CSV` file can contain extra-columns. The `Region` and `Operating System` fields must match existing regions and supported operating systems in `Azure`.

### Coster output

The `Coster` will generate a `CSV` file in the `Out\` directory with the following fields:

- _Region_
- _Name_
- _Operating System_
- _Instance_
- _CPU_
- _RAM_
- _Pay as You Go_
- _Pay as You Go With Azure Hybrid Benefit_
- _One Year Reserved_
- _One Year Reserved With Azure Hybrid Benefit_
- _Three Year Reserved_
- _Three Year Reserved With Azure Hybrid Benefit_
- _Spot_
- _Spot With Azure Hybrid Benefit_

## Notes and references

<a id="closest-currency-1">01.</a> Euro is used for countries which don't have their currency listed, are [part of the European Union but not part of the Eurozone][european-union].

<a id="closest-currency-3">03.</a> USD is used when no other currency could be matched to the country.

<a id="closest-culture-4">04.</a> English (UK) has been selected due to the use of [South African English][south-african-english] in South Africa.

<a id="closest-culture-5">05.</a> Spanish is considered to be the closest language to [Rioplatense Spanish][rioplatense-spanish]

<a id="closest-culture-6">06.</a> English (UK) has been selected due to the use of [Malaysian English][malaysian-english] in Malaysia.

<a id="closest-culture-7">07.</a> English (UK) has been selected due to the use of [New Zealand English][new-zealand-english] in New Zealand.

<a id="closest-currency-8">08.</a> USD is used because the Saudi riyal is [pegged with][saudi-riyal-fixed-exchange-rate] the US Dollar.

<a id="closest-culture-9">09.</a> German, French and Italian are three of the [official languages][swizerland-official-languages] of Switzerland.

<a id="closest-culture-10">10.</a> English is one of the [official languages][hong-kong-traditional-chinese-english] of Hong-Kong. Traditional Chinese is one of the [official scripts][hong-kong-traditional-chinese-english] of Hong Kong, `zh-tw` is the only other culture available using Traditional Chinese.

<a id="closest-culture-11">11.</a> English (US) has been selected because it is the default language.

[virtual-machines-pricing]: https://azure.microsoft.com/en-au/pricing/details/virtual-machines/windows/
[managed-disks-pricing]: https://azure.microsoft.com/en-us/pricing/details/managed-disks/
[bandwidth-pricing-details]: https://azure.microsoft.com/en-us/pricing/details/bandwidth/
[iceland-import-export]: https://atlas.media.mit.edu/en/profile/country/isl/#Destinations
[south-african-english]: https://en.wikipedia.org/wiki/South_African_English
[rioplatense-spanish]: https://en.wikipedia.org/wiki/Rioplatense_Spanish
[malaysian-english]: https://en.wikipedia.org/wiki/Malaysian_English
[new-zealand-english]: https://en.wikipedia.org/wiki/New_Zealand_English
[saudi-riyal-fixed-exchange-rate]: https://en.wikipedia.org/wiki/Saudi_riyal#Fixed_exchange_rate
[european-union]: https://europa.eu/european-union/about-eu/countries_en#tab-0-0
[swizerland-official-languages]: https://en.wikipedia.org/wiki/Switzerland#Languages
[azure-china]: https://www.azure.cn/en-us/pricing/details/virtual-machines/
[hong-kong-traditional-chinese-english]: https://en.wikipedia.org/wiki/Hong_Kong#cite_note-language-status-8
