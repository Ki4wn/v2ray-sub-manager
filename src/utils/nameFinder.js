// Unified country data
const countryData = [
  {
    name: "Germany",
    iso: "DE",
    emoji: "🇩🇪",
    persian: ["آلمان"]
  },
  {
    name: "Netherlands",
    iso: "NL",
    emoji: "🇳🇱",
    persian: ["هلند"]
  },
  {
    name: "Austria",
    iso: "AT",
    emoji: "🇦🇹",
    persian: ["اتریش"]
  },
  {
    name: "France",
    iso: "FR",
    emoji: "🇫🇷",
    persian: ["فرانسه"]
  },
  {
    name: "Finland",
    iso: "FI",
    emoji: "🇫🇮",
    persian: ["فنلاند"]
  },
  {
    name: "Norway",
    iso: "NO",
    emoji: "🇳🇴",
    persian: ["نروژ"]
  },
  {
    name: "Iran",
    iso: "IR",
    emoji: "🇮🇷",
    persian: ["ایران"]
  },
  {
    name: "United Kingdom",
    iso: "GB",
    emoji: "🇬🇧",
    persian: ["انگلستان"]
  },
  {
    name: "Turkey",
    iso: "TR",
    emoji: "🇹🇷",
    persian: ["ترکیه"]
  },
  {
    name: "United Arab Emirates",
    iso: "AE",
    emoji: "🇦🇪",
    persian: ["امارات", "اِمارات"]
  },
  {
    name: "United States",
    iso: "US",
    emoji: "🇺🇸",
    persian: ["آمریکا"]
  },
  {
    name: "Europe",
    iso: "EU",
    emoji: "🇪🇺",
    persian: ["اروپا"]
  },
  {
    name: "Poland",
    iso: "PL",
    emoji: "🇵🇱",
    persian: ["لهستان"]
  },
  {
    name: "Russia",
    iso: "RU",
    emoji: "🇷🇺",
    persian: ["روسیه"]
  }
];

// Auto-generated maps
const emojiToCountry = {};
const countryMap = {};
const countryToISO = {};

for (const country of countryData) {
  emojiToCountry[country.emoji] = country.name;
  countryToISO[country.name] = country.iso;
  for (const fa of country.persian) {
    countryMap[fa.toLowerCase()] = country.name;
  }
}

function isoToEmoji(isoCode) {
  if (!isoCode) return "";
  return isoCode
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(char.charCodeAt(0) + 127397)
    );
}

export function findNameInText(decodedText) {
  let emoji = "";
  let countryName = "Global";
  const text = decodedText.trim().toLowerCase();

  // Match only flag emojis (e.g., 🇩🇪, 🇺🇸)
  const flagRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;
  const emojiMatch = decodedText.match(flagRegex);

  if (emojiMatch) {
    for (const candidate of emojiMatch) {
      if (emojiToCountry[candidate]) {
        emoji = candidate;
        countryName = emojiToCountry[emoji];
        console.log(decodedText, { emoji, country: countryName, way: 1 });
        return { emoji, country: countryName, way: 1 };
      }
    }
  }

  // Fallback: match based on Persian country names
  for (const key in countryMap) {
    if (text.includes(key)) {
      countryName = countryMap[key];
      break;
    }
  }

  const iso = countryToISO[countryName] || "";
  emoji = isoToEmoji(iso) || "🌐";

  console.log(decodedText, { emoji, country: countryName, way: 2 });
  return { emoji, country: countryName, way: 2 };
}




export function numberAndSortByCountry(data) {
  // Step 1: Group by country
  const grouped = data.reduce((acc, item) => {
    acc[item.country] = acc[item.country] || [];
    acc[item.country].push(item);
    return acc;
  }, {});

  // Step 2: Add numbering within each group
  const numbered = [];
  for (const country of Object.keys(grouped)) {
    grouped[country].forEach((item, idx) => {
      numbered.push({
        ...item,
        country: `${country}-${idx + 1}`
      });
    });
  }

  // Step 3: Sort by country name (alphabetically, ignoring trailing numbers)
  numbered.sort((a, b) => {
    const countryA = a.country.replace(/\s\d+$/, '');
    const countryB = b.country.replace(/\s\d+$/, '');
    if (countryA < countryB) return -1;
    if (countryA > countryB) return 1;

    const numA = parseInt(a.country.match(/\d+$/)[0], 10);
    const numB = parseInt(b.country.match(/\d+$/)[0], 10);
    return numA - numB;
  });


  return numbered;
}