import mongoose from "mongoose";
import dotenv from "dotenv";
import Bus from "./src/models/Bus.js";

dotenv.config();

const routes = [
  { source: "Bangalore", destination: "Mysore",      duration: 3  },
  { source: "Mysore",    destination: "Bangalore",   duration: 3  },
  { source: "Bangalore", destination: "Mangalore",   duration: 7  },
  { source: "Mangalore", destination: "Bangalore",   duration: 7  },
  { source: "Bangalore", destination: "Hubli",       duration: 8  },
  { source: "Hubli",     destination: "Bangalore",   duration: 8  },
  { source: "Bangalore", destination: "Belgaum",     duration: 10 },
  { source: "Belgaum",   destination: "Bangalore",   duration: 10 },
  { source: "Bangalore", destination: "Dharwad",     duration: 9  },
  { source: "Dharwad",   destination: "Bangalore",   duration: 9  },
  { source: "Bangalore", destination: "Gulbarga",    duration: 7  },
  { source: "Gulbarga",  destination: "Bangalore",   duration: 7  },
  { source: "Bangalore", destination: "Bidar",       duration: 8  },
  { source: "Bidar",     destination: "Bangalore",   duration: 8  },
  { source: "Bangalore", destination: "Hassan",      duration: 3  },
  { source: "Hassan",    destination: "Bangalore",   duration: 3  },
  { source: "Bangalore", destination: "Shimoga",     duration: 5  },
  { source: "Shimoga",   destination: "Bangalore",   duration: 5  },
  { source: "Bangalore", destination: "Tumkur",      duration: 2  },
  { source: "Tumkur",    destination: "Bangalore",   duration: 2  },
  { source: "Mysore",    destination: "Mangalore",   duration: 5  },
  { source: "Mangalore", destination: "Mysore",      duration: 5  },
  { source: "Mysore",    destination: "Hassan",      duration: 2  },
  { source: "Hassan",    destination: "Mysore",      duration: 2  },
  { source: "Hubli",     destination: "Mangalore",   duration: 6  },
  { source: "Mangalore", destination: "Hubli",       duration: 6  },
  { source: "Hubli",     destination: "Belgaum",     duration: 3  },
  { source: "Belgaum",   destination: "Hubli",       duration: 3  },
  { source: "Bangalore", destination: "Udupi",       duration: 8  },
  { source: "Udupi",     destination: "Bangalore",   duration: 8  },
  { source: "Bangalore", destination: "Chikmagalur", duration: 5  },
  { source: "Chikmagalur", destination: "Bangalore", duration: 5  },
  { source: "Bangalore", destination: "Kodagu",      duration: 5  },
  { source: "Kodagu",    destination: "Bangalore",   duration: 5  },
  { source: "Mysore",    destination: "Kodagu",      duration: 3  },
  { source: "Kodagu",    destination: "Mysore",      duration: 3  },
  { source: "Bangalore", destination: "Raichur",     duration: 8  },
  { source: "Raichur",   destination: "Bangalore",   duration: 8  },
  { source: "Bangalore", destination: "Davangere",   duration: 5  },
  { source: "Davangere", destination: "Bangalore",   duration: 5  },
  { source: "Hubli",     destination: "Davangere",   duration: 2  },
  { source: "Davangere", destination: "Hubli",       duration: 2  },
  { source: "Bangalore", destination: "Kolar",       duration: 2  },
  { source: "Kolar",     destination: "Bangalore",   duration: 2  },
  { source: "Bangalore", destination: "Mandya",      duration: 2  },
  { source: "Mandya",    destination: "Bangalore",   duration: 2  },
  { source: "Mysore",    destination: "Shimoga",     duration: 4  },
  { source: "Shimoga",   destination: "Mysore",      duration: 4  },
  { source: "Bangalore", destination: "Bagalkot",    duration: 9  },
  { source: "Bagalkot",  destination: "Bangalore",   duration: 9  },
];

const busTypes = [
  { type: "KSRTC Ordinary",   price: 120, seats: 52 },
  { type: "KSRTC Express",    price: 180, seats: 52 },
  { type: "KSRTC Rajahamsa",  price: 280, seats: 52 },
  { type: "KSRTC Airavat",    price: 420, seats: 36 },
  { type: "KSRTC Club Class", price: 600, seats: 24 },
];

const departureTimes = [5, 6, 7, 8, 9, 10, 14, 16, 18, 20, 22];

const buses = routes.map((route, i) => {
  const bt = busTypes[i % busTypes.length];
  return {
    busNumber:     `KA-${String(i + 1).padStart(3, "0")}`,
    operator:      bt.type,
    source:        route.source,
    destination:   route.destination,
    departureHour: departureTimes[i % departureTimes.length],
    durationHours: route.duration,
    totalSeats:    bt.seats,
    availableSeats: bt.seats,
    price:         bt.price,
  };
});

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to DB");

await Bus.deleteMany({});
console.log("Cleared existing buses");

await Bus.insertMany(buses);
console.log(`✅ Seeded ${buses.length} KSRTC buses`);

await mongoose.disconnect();
