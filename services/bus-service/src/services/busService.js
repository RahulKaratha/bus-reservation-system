import Bus from "../models/Bus.js";

export const createBus = async (data) => {
  const bus = new Bus(data);
  return await bus.save();
};

export const getAllBuses = async () => {
  return await Bus.find();
};

export const getBusById = async (id) => {
  return await Bus.findById(id);
};

// Search by route — attach computed departure/arrival for the chosen date
export const searchBuses = async (source, destination, date) => {
  const buses = await Bus.find({ source, destination });

  return buses.map(bus => {
    const dep = new Date(date);
    dep.setHours(bus.departureHour, 0, 0, 0);

    const arr = new Date(dep);
    arr.setHours(arr.getHours() + bus.durationHours);

    return {
      ...bus.toObject(),
      departureTime: dep,
      arrivalTime: arr,
    };
  });
};

export const getCities = async () => {
  const sources = await Bus.distinct("source");
  const destinations = await Bus.distinct("destination");
  return [...new Set([...sources, ...destinations])].sort();
};

export const updateBusById = async (id, data) => {
  return await Bus.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteBusById = async (id) => {
  return await Bus.findByIdAndDelete(id);
};
