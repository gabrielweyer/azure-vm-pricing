# Parser tests

The parser has unit tests focusing on edge cases of price formatting:

```powershell
> cd .\parser\
> yarn test
```

The end-to-end tests attempt to compare known prices for the `D2 v3` instance in `us-west` using permutations of supported `culture`, `operating-system`, and `currency`:

```powershell
> cd .\parser\
> yarn e2e-all
```

| Culture | Culture display name | Currency                        | Currency display name  | Support            |
| ------- | ---------------------| ------------------------------- | ---------------------- | ------------------ |
| `en-us` | English (US)         | `usd`                           | US Dollar ($)          | :white_check_mark: |
| `cs-cz` | Čeština              | `eur`[[1]](#closest-currency-1) | Euro (€)               | :white_check_mark: |
| `da-dk` | Dansk                | `dkk`                           | Danish Krone (kr)      | :white_check_mark: |
| `de-de` | Deutsch              | `eur`                           | Euro (€)               | :white_check_mark: |
|         |                      | `chf`[[2]](#closest-culture-2)  | Swiss Franc. (chf)     | :white_check_mark: |
| `en-au` | English (Australia)  | `aud`                           | Australian Dollar ($)  | :white_check_mark: |
| `en-ca` | English (Canada)     | `cad`                           | Canadian Dollar ($)    | :white_check_mark: |
| `en-in` | English (India)      | `inr`                           | Indian Rupee (₹)       | :white_check_mark: |
| `en-gb` | English (UK)         | `gpb`                           | British Pound (£)      | :white_check_mark: |
|         |                      | `nzd`[[3]](#closest-culture-3)  | New Zealand Dollar ($) | :white_check_mark: |
| `es-es` | Español              | `eur`                           | Euro (€)               | :white_check_mark: |
| `es-mx` | Español (MX)         | `usd`[[4]](#closest-currency-4) | US Dollar ($)          | :white_check_mark: |
| `fr-fr` | Français             | `eur`                           | Euro (€)               | :white_check_mark: |
|         |                      | `chf`[[2]](#closest-culture-2)  | Swiss Franc. (chf)     | :white_check_mark: |
| `fr-ca` | Français (Canada)    | `cad`                           | Canadian Dollar ($)    | :white_check_mark: |
| `it-it` | Italiano             | `eur`                           | Euro (€)               | :white_check_mark: |
|         |                      | `chf`[[2]](#closest-culture-2)  | Swiss Franc. (chf)     | :white_check_mark: |
| `hu-hu` | Magyar               | `eur`[[1]](#closest-currency-1) | Euro (€)               | :white_check_mark: |
| `nb-no` | Norsk                | `nk`                            | Norwegian Krone (kr)   | :white_check_mark: |
| `nl-nl` | Nederlands           | `eur`                           | Euro (€)               | :white_check_mark: |
| `pl-pl` | Polski               | `eur`[[1]](#closest-currency-1) | Euro (€)               | :white_check_mark: |
| `pt-br` | Português (Brasil)   | `brl`                           | Brazilian Real (R$)    | :white_check_mark: |
| `pt-pt` | Português            | `eur`                           | Euro (€)               | :white_check_mark: |
| `sv-se` | Svenska              | `sek`                           | Swedish Krona (kr)     | :white_check_mark: |
| `tr-tr` | Türkçe               | `usd`[[4]](#closest-currency-4) | US Dollar ($)          | :white_check_mark: |
| `ru-ru` | Pусский              | `rub`                           | Russian Ruble (руб)    | :white_check_mark: |
| `ja-jp` | 日本語                | `jpy`                           | Japanese Yen (¥)       | :white_check_mark: |
| `ko-kr` | 한국어                | `krw`                           | Korean Won (₩)         | :white_check_mark: |
| `zh-cn` | 中文(简体)            | `N/A`                           | N/A                    | `N/A`              |
| `zh-tw` | 中文(繁體)            | `twd`                           | Taiwanese Dollar (NT$) | :white_check_mark: |

<a id="closest-currency-1">1.</a> Euro is used for countries which don't have their currency listed, are [part of the European Union but not part of the Eurozone][european-union].

<a id="closest-culture-2">2.</a> German, French and Italian are three of the [official languages][swizerland-official-languages] of Switzerland.

<a id="closest-culture-3">3.</a> English (UK) has been selected due to the use of [New Zealand English][new-zealand-english] in New Zealand.

<a id="closest-currency-4">4.</a> USD is used when no other currency could be matched to the country.

[new-zealand-english]: https://en.wikipedia.org/wiki/New_Zealand_English
[european-union]: https://europa.eu/european-union/about-eu/countries_en#tab-0-0
[swizerland-official-languages]: https://en.wikipedia.org/wiki/Switzerland#Languages
