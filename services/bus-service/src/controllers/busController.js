import {
  createBus,
  getAllBuses,
  getBusById,
  searchBuses,
  updateBusById,
  deleteBusById,
  getCities
} from "../services/busService.js";

export const addBus = async (req, res) => {
  try {
    const bus = await createBus(req.body);
    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBuses = async (req, res) => {
  try {
    const buses = await getAllBuses();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBus = async (req, res) => {
  try {
    const bus = await getBusById(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchBus = async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    if (!date) return res.status(400).json({ message: "Travel date is required" });
    const buses = await searchBuses(source, destination, date);
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCitiesList = async (req, res) => {
  try {
    const cities = await getCities();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBus = async (req, res) => {
  try {
    const bus = await updateBusById(req.params.id, req.body);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBus = async (req, res) => {
  try {
    const bus = await deleteBusById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};