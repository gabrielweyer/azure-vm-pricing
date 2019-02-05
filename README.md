# Azure VM pricing

## Parser

Retrieve `VMs` **hourly** pricing for a specific **culture**, **currency**, **operating system** and **region**.

### Pre-requisites

- `Node.js 8.12`
- `Yarn 1.13.0`

```posh
cd .\parser\
yarn
```

### Usage

```posh
cd .\parser\
yarn crawl --currency USD --culture en-us --operating-system linux --region us-west
```

You can also use short names:

```posh
yarn crawl -c USD -l en-us -o linux -r us-west
```

Arguments:

- `currency` any of the `option` `value` in the **Currency** `select`
- `culture` any of the `option` `value` in the **Culture** `select`
  - **This will impact the formatting of the pricing**
- `operating-system` any of the `option` `value` in the **OS/Software** `select`
- `region` any of the `option` `value` in the **Region** `select`

![OS and Region select](docs/assets/os-region.png)

In the footer:

![Culture and Currency select](docs/assets/culture-currency.png)

### Output

Writes `2` output files in the `out` directory. One is a `CSV`, the other one is `JSON`. Both files contain the same data.

```text
.\out\vm-pricing_<region>_<operating-system>.csv
.\out\vm-pricing_<region>_<operating-system>.json
```

Fields:

- `Instance`
- `vCPU`
- `RAM`
- `Pay as You Go`
- `One Year Reserved`
- `Three Year Reserved`
- `Three Year Reserved With Azure Hybrid Benefit`
